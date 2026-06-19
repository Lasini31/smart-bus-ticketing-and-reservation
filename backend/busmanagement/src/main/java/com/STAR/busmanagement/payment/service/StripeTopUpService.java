package com.STAR.busmanagement.payment.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.STAR.busmanagement.payment.config.StripeProperties;
import com.STAR.busmanagement.payment.dto.CreateTopUpCheckoutSessionRequest;
import com.STAR.busmanagement.payment.dto.CreateTopUpCheckoutSessionResponse;
import com.STAR.busmanagement.payment.dto.StripeWebhookResponse;
import com.STAR.busmanagement.payment.dto.TopUpPaymentStatusResponse;
import com.STAR.busmanagement.payment.exception.PaymentException;
import com.STAR.busmanagement.payment.model.PassengerWalletContext;
import com.STAR.busmanagement.payment.model.TopUpCompletionResult;
import com.STAR.busmanagement.payment.model.TopUpPaymentRecord;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.RequestOptions;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;

@Service
public class StripeTopUpService {

    private final StripeProperties stripeProperties;
    private final SupabaseTopUpRepository topUpRepository;
    private final ObjectMapper objectMapper;

    public StripeTopUpService(
            StripeProperties stripeProperties,
            SupabaseTopUpRepository topUpRepository,
            ObjectMapper objectMapper
    ) {
        this.stripeProperties = stripeProperties;
        this.topUpRepository = topUpRepository;
        this.objectMapper = objectMapper;
    }

    public CreateTopUpCheckoutSessionResponse createCheckoutSession(
            CreateTopUpCheckoutSessionRequest request,
            Jwt jwt
    ) {
        ensureStripeSecretConfigured();

        AuthenticatedPassenger passenger = requirePassenger(jwt);
        BigDecimal amount = validateAmount(request.getAmount());
        String currency = stripeProperties.getCurrency().toLowerCase();

        PassengerWalletContext walletContext = topUpRepository.ensurePassengerWallet(
                passenger.email(),
                passenger.displayName(),
                passenger.role()
        );

        TopUpPaymentRecord pendingPayment = topUpRepository.createPendingTopUp(
                walletContext,
                amount,
                currency
        );

        try {
            Session session = Session.create(
                    buildCheckoutSessionParams(pendingPayment, passenger, amount, currency),
                    RequestOptions.builder()
                            .setApiKey(stripeProperties.getSecretKey())
                            .build()
            );

            TopUpPaymentRecord attachedPayment = topUpRepository.attachCheckoutSession(
                    pendingPayment.paymentId(),
                    session.getId(),
                    session.getUrl()
            );

            return CreateTopUpCheckoutSessionResponse.builder()
                    .paymentId(attachedPayment.paymentId())
                    .checkoutSessionId(session.getId())
                    .checkoutUrl(session.getUrl())
                    .amount(amount)
                    .currency(currency)
                    .status(attachedPayment.status())
                    .build();
        } catch (StripeException ex) {
            topUpRepository.markPaymentStatus(pendingPayment.paymentId(), "failed_to_create_checkout");
            throw new PaymentException(
                    HttpStatus.BAD_GATEWAY,
                    "STRIPE_CHECKOUT_ERROR",
                    "Stripe could not create the Checkout Session: " + ex.getMessage()
            );
        }
    }

    public StripeWebhookResponse handleWebhook(String payload, String signatureHeader) {
        ensureStripeWebhookConfigured();

        if (!StringUtils.hasText(signatureHeader)) {
            throw new PaymentException(
                    HttpStatus.BAD_REQUEST,
                    "STRIPE_SIGNATURE_MISSING",
                    "Stripe-Signature header is required."
            );
        }

        Event event = verifyStripeEvent(payload, signatureHeader);
        JsonNode eventJson = readEventJson(payload);
        String eventType = event.getType();

        return switch (eventType) {
            case "checkout.session.completed", "checkout.session.async_payment_succeeded" ->
                    completePaidCheckoutSession(eventJson, event.getId(), eventType);
            case "checkout.session.expired" ->
                    markCheckoutSessionStatus(eventJson, event.getId(), eventType, "expired");
            case "checkout.session.async_payment_failed" ->
                    markCheckoutSessionStatus(eventJson, event.getId(), eventType, "failed");
            default -> StripeWebhookResponse.builder()
                    .received(true)
                    .eventType(eventType)
                    .message("Event received but not used by wallet top-up flow.")
                    .build();
        };
    }

    public TopUpPaymentStatusResponse getTopUpStatus(String sessionId, Jwt jwt) {
        AuthenticatedPassenger passenger = requirePassenger(jwt);
        PassengerWalletContext walletContext = topUpRepository.ensurePassengerWallet(
                passenger.email(),
                passenger.displayName(),
                passenger.role()
        );

        TopUpPaymentRecord record = topUpRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new PaymentException(
                        HttpStatus.NOT_FOUND,
                        "TOPUP_NOT_FOUND",
                        "Top-up payment was not found."
                ));

        if ("pending".equalsIgnoreCase(record.status())) {
            try {
                Session session = Session.retrieve(
                        sessionId,
                        RequestOptions.builder()
                                .setApiKey(stripeProperties.getSecretKey())
                                .build()
                );
                if ("paid".equalsIgnoreCase(session.getPaymentStatus())) {
                    topUpRepository.completeTopUp(
                            sessionId,
                            session.getPaymentIntent(),
                            null
                    );
                    record = topUpRepository.findBySessionId(sessionId).orElse(record);
                }
            } catch (StripeException e) {
                System.err.println("Warning: Fallback Stripe checkout session retrieval failed: " + e.getMessage());
            }
        }

        if (!walletContext.passengerId().equals(record.passengerId())) {
            throw new PaymentException(
                    HttpStatus.FORBIDDEN,
                    "TOPUP_FORBIDDEN",
                    "You cannot view another passenger's top-up payment."
            );
        }

        return TopUpPaymentStatusResponse.builder()
                .paymentId(record.paymentId())
                .checkoutSessionId(record.checkoutSessionId())
                .paymentIntentId(record.paymentIntentId())
                .amount(record.amount())
                .currency(record.currency())
                .status(record.status())
                .walletBalance(record.walletBalance())
                .build();
    }

    private SessionCreateParams buildCheckoutSessionParams(
            TopUpPaymentRecord pendingPayment,
            AuthenticatedPassenger passenger,
            BigDecimal amount,
            String currency
    ) {
        Map<String, String> metadata = new LinkedHashMap<>();
        metadata.put("topupPaymentId", pendingPayment.paymentId().toString());
        metadata.put("passengerId", pendingPayment.passengerId().toString());
        metadata.put("walletId", pendingPayment.walletId().toString());
        metadata.put("amount", amount.toPlainString());
        metadata.put("currency", currency);

        return SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setCustomerEmail(passenger.email())
                .setClientReferenceId(pendingPayment.passengerId().toString())
                .setSuccessUrl(stripeProperties.getSuccessUrl())
                .setCancelUrl(stripeProperties.getCancelUrl())
                .putAllMetadata(metadata)
                .setPaymentIntentData(
                        SessionCreateParams.PaymentIntentData.builder()
                                .putAllMetadata(metadata)
                                .build()
                )
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency(currency)
                                                .setUnitAmount(toMinorUnitAmount(amount))
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName("STAR Bus Wallet Top-up")
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                )
                .build();
    }

    private StripeWebhookResponse completePaidCheckoutSession(
            JsonNode eventJson,
            String eventId,
            String eventType
    ) {
        JsonNode session = checkoutSessionObject(eventJson);
        String sessionId = text(session, "id");
        String paymentStatus = text(session, "payment_status");
        String paymentIntentId = text(session, "payment_intent");

        if (!"paid".equalsIgnoreCase(paymentStatus)) {
            return StripeWebhookResponse.builder()
                    .received(true)
                    .eventType(eventType)
                    .message("Checkout Session is not paid yet, so the wallet was not credited.")
                    .build();
        }

        TopUpCompletionResult result = topUpRepository.completeTopUp(
                sessionId,
                paymentIntentId,
                eventId
        );

        String message = result.credited()
                ? "Wallet credited successfully."
                : "Checkout Session was already processed earlier.";

        return StripeWebhookResponse.builder()
                .received(true)
                .eventType(eventType)
                .message(message)
                .build();
    }

    private StripeWebhookResponse markCheckoutSessionStatus(
            JsonNode eventJson,
            String eventId,
            String eventType,
            String status
    ) {
        JsonNode session = checkoutSessionObject(eventJson);
        topUpRepository.markSessionStatus(
                text(session, "id"),
                status,
                text(session, "payment_intent"),
                eventId
        );

        return StripeWebhookResponse.builder()
                .received(true)
                .eventType(eventType)
                .message("Checkout Session marked as " + status + ".")
                .build();
    }

    private Event verifyStripeEvent(String payload, String signatureHeader) {
        try {
            return Webhook.constructEvent(payload, signatureHeader, stripeProperties.getWebhookSecret());
        } catch (SignatureVerificationException ex) {
            throw new PaymentException(
                    HttpStatus.BAD_REQUEST,
                    "STRIPE_SIGNATURE_INVALID",
                    "Stripe webhook signature verification failed."
            );
        } catch (RuntimeException ex) {
            throw new PaymentException(
                    HttpStatus.BAD_REQUEST,
                    "STRIPE_PAYLOAD_INVALID",
                    "Stripe webhook payload is invalid."
            );
        }
    }

    private JsonNode readEventJson(String payload) {
        try {
            return objectMapper.readTree(payload);
        } catch (Exception ex) {
            throw new PaymentException(
                    HttpStatus.BAD_REQUEST,
                    "STRIPE_PAYLOAD_INVALID",
                    "Stripe webhook payload is not valid JSON."
            );
        }
    }

    private JsonNode checkoutSessionObject(JsonNode eventJson) {
        JsonNode session = eventJson.path("data").path("object");
        if (!StringUtils.hasText(text(session, "id"))) {
            throw new PaymentException(
                    HttpStatus.BAD_REQUEST,
                    "STRIPE_SESSION_MISSING",
                    "Stripe event does not contain a Checkout Session."
            );
        }
        return session;
    }

    private BigDecimal validateAmount(BigDecimal requestedAmount) {
        if (requestedAmount == null) {
            throw invalidAmount("Top-up amount is required.");
        }

        BigDecimal amount;
        try {
            amount = requestedAmount.setScale(2, RoundingMode.UNNECESSARY);
        } catch (ArithmeticException ex) {
            throw invalidAmount("Top-up amount can have a maximum of two decimal places.");
        }

        if (amount.compareTo(stripeProperties.getMinTopupAmount()) < 0) {
            throw invalidAmount("Minimum top-up amount is LKR "
                    + stripeProperties.getMinTopupAmount().toPlainString() + ".");
        }

        if (amount.compareTo(stripeProperties.getMaxTopupAmount()) > 0) {
            throw invalidAmount("Maximum top-up amount is LKR "
                    + stripeProperties.getMaxTopupAmount().toPlainString() + ".");
        }

        return amount;
    }

    private PaymentException invalidAmount(String message) {
        return new PaymentException(HttpStatus.BAD_REQUEST, "INVALID_TOPUP_AMOUNT", message);
    }

    private Long toMinorUnitAmount(BigDecimal amount) {
        return amount.movePointRight(2).longValueExact();
    }

    private AuthenticatedPassenger requirePassenger(Jwt jwt) {
        if (jwt == null) {
            throw new PaymentException(
                    HttpStatus.UNAUTHORIZED,
                    "AUTHENTICATION_REQUIRED",
                    "Login is required before creating a wallet top-up."
            );
        }

        String email = jwt.getClaimAsString("email");
        if (!StringUtils.hasText(email)) {
            throw new PaymentException(
                    HttpStatus.BAD_REQUEST,
                    "AUTH_EMAIL_MISSING",
                    "Authenticated user email was not found in the token."
            );
        }

        String role = resolveRole(jwt);
        if (!"passenger".equalsIgnoreCase(role)) {
            throw new PaymentException(
                    HttpStatus.FORBIDDEN,
                    "PASSENGER_ONLY",
                    "Only passenger accounts can top up a wallet."
            );
        }

        return new AuthenticatedPassenger(email, resolveDisplayName(jwt, email), role);
    }

    private String resolveRole(Jwt jwt) {
        return Optional.ofNullable(readMetadataValue(jwt, "app_metadata", "role"))
                .or(() -> Optional.ofNullable(readMetadataValue(jwt, "user_metadata", "role")))
                .orElse("passenger");
    }

    private String resolveDisplayName(Jwt jwt, String email) {
        String directName = jwt.getClaimAsString("name");
        if (StringUtils.hasText(directName)) {
            return directName;
        }

        return Optional.ofNullable(readMetadataValue(jwt, "user_metadata", "name"))
                .or(() -> Optional.ofNullable(readMetadataValue(jwt, "user_metadata", "full_name")))
                .orElse(email);
    }

    private String readMetadataValue(Jwt jwt, String claimName, String key) {
        Map<String, Object> metadata = jwt.getClaim(claimName);
        if (metadata == null || metadata.get(key) == null) {
            return null;
        }
        return metadata.get(key).toString();
    }

    private String text(JsonNode node, String fieldName) {
        JsonNode value = node.path(fieldName);
        return value.isMissingNode() || value.isNull() ? null : value.asText();
    }

    private void ensureStripeSecretConfigured() {
        if (!StringUtils.hasText(stripeProperties.getSecretKey())) {
            throw new PaymentException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "STRIPE_NOT_CONFIGURED",
                    "STRIPE_SECRET_KEY is not configured."
            );
        }
    }

    private void ensureStripeWebhookConfigured() {
        if (!StringUtils.hasText(stripeProperties.getWebhookSecret())) {
            throw new PaymentException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "STRIPE_WEBHOOK_NOT_CONFIGURED",
                    "STRIPE_WEBHOOK_SECRET is not configured."
            );
        }
    }

    private record AuthenticatedPassenger(String email, String displayName, String role) {
    }
}
