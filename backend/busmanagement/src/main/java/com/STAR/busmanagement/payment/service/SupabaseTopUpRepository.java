package com.STAR.busmanagement.payment.service;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.STAR.busmanagement.payment.exception.PaymentException;
import com.STAR.busmanagement.payment.model.PassengerWalletContext;
import com.STAR.busmanagement.payment.model.TopUpCompletionResult;
import com.STAR.busmanagement.payment.model.TopUpPaymentRecord;

@Service
public class SupabaseTopUpRepository {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String serviceKey;

    private final RestTemplate restTemplate;

    public SupabaseTopUpRepository(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public PassengerWalletContext ensurePassengerWallet(String email, String displayName, String role) {
        ensureSupabaseConfigured();

        Map<String, Object> user = findUserByEmail(email)
                .orElseGet(() -> createUser(email, displayName, role));

        String userId = readString(user.get("id"));

        Map<String, Object> wallet = findWalletByPassengerId(userId)
                .orElseGet(() -> createWalletForPassenger(userId));

        String walletId = readString(wallet.get("id"));

        return new PassengerWalletContext(userId, userId, walletId, email);
    }

    public TopUpPaymentRecord createPendingTopUp(
            PassengerWalletContext context,
            BigDecimal amount,
            String currency
    ) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("passenger_id", context.passengerId());
        body.put("wallet_id", context.walletId());
        body.put("amount", amount);
        body.put("currency", currency);
        body.put("status", "pending");
        body.put("last_updated", now());

        List<Map<String, Object>> rows = exchangeForList(
                restUrl("stripe_topup_payments"),
                HttpMethod.POST,
                body
        );

        return toTopUpRecord(firstOrThrow(rows, "Unable to create pending top-up record."));
    }

    public TopUpPaymentRecord attachCheckoutSession(String paymentId, String sessionId, String checkoutUrl) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("stripe_checkout_session_id", sessionId);
        body.put("checkout_url", checkoutUrl);
        body.put("last_updated", now());

        String url = UriComponentsBuilder
                .fromUriString(restUrl("stripe_topup_payments"))
                .queryParam("id", "eq." + paymentId)
                .toUriString();

        List<Map<String, Object>> rows = exchangeForList(url, HttpMethod.PATCH, body);
        return toTopUpRecord(firstOrThrow(rows, "Unable to attach Stripe Checkout Session."));
    }

    public void markPaymentStatus(String paymentId, String status) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", status);
        body.put("last_updated", now());

        String url = UriComponentsBuilder
                .fromUriString(restUrl("stripe_topup_payments"))
                .queryParam("id", "eq." + paymentId)
                .toUriString();

        exchangeForList(url, HttpMethod.PATCH, body);
    }

    public TopUpCompletionResult completeTopUp(String sessionId, String paymentIntentId, String stripeEventId) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("p_checkout_session_id", sessionId);
        body.put("p_payment_intent_id", paymentIntentId);
        body.put("p_stripe_event_id", stripeEventId);

        List<Map<String, Object>> rows = exchangeForList(
                restUrl("rpc/complete_stripe_topup"),
                HttpMethod.POST,
                body
        );

        Map<String, Object> row = firstOrThrow(rows, "Unable to complete top-up payment.");
        return new TopUpCompletionResult(
                readString(row.get("payment_id")),
                readString(row.get("wallet_id")),
                Boolean.TRUE.equals(row.get("credited")),
                readDouble(row.get("new_balance"))
        );
    }

    public void markSessionStatus(
            String sessionId,
            String status,
            String paymentIntentId,
            String stripeEventId
    ) {
        if (!StringUtils.hasText(sessionId)) {
            return;
        }

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", status);
        body.put("last_updated", now());

        if (StringUtils.hasText(paymentIntentId)) {
            body.put("stripe_payment_intent_id", paymentIntentId);
        }
        if (StringUtils.hasText(stripeEventId)) {
            body.put("stripe_event_id", stripeEventId);
        }

        String url = UriComponentsBuilder
                .fromUriString(restUrl("stripe_topup_payments"))
                .queryParam("stripe_checkout_session_id", "eq." + sessionId)
                .queryParam("status", "neq.completed")
                .toUriString();

        exchangeForList(url, HttpMethod.PATCH, body);
    }

    public Optional<TopUpPaymentRecord> findBySessionId(String sessionId) {
        ensureSupabaseConfigured();

        String url = UriComponentsBuilder
                .fromUriString(restUrl("stripe_topup_payments"))
                .queryParam("select", "*")
                .queryParam("stripe_checkout_session_id", "eq." + sessionId)
                .queryParam("limit", "1")
                .toUriString();

        List<Map<String, Object>> rows = exchangeForList(url, HttpMethod.GET, null);
        if (rows.isEmpty()) {
            return Optional.empty();
        }

        TopUpPaymentRecord record = toTopUpRecord(rows.get(0));
        Double walletBalance = findWalletBalance(record.walletId()).orElse(null);

        return Optional.of(new TopUpPaymentRecord(
                record.paymentId(),
                record.passengerId(),
                record.walletId(),
                record.amount(),
                record.currency(),
                record.status(),
                record.checkoutSessionId(),
                record.paymentIntentId(),
                walletBalance
        ));
    }

    private Optional<Map<String, Object>> findUserByEmail(String email) {
        String url = UriComponentsBuilder
                .fromUriString(restUrl("profiles"))
                .queryParam("select", "id,email,name,role")
                .queryParam("email", "eq." + email)
                .queryParam("limit", "1")
                .toUriString();

        List<Map<String, Object>> rows = exchangeForList(url, HttpMethod.GET, null);
        return rows.stream().findFirst();
    }

    private Map<String, Object> createUser(String email, String displayName, String role) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("name", StringUtils.hasText(displayName) ? displayName : email);
        body.put("contact_no", "N/A");
        body.put("email", email);
        body.put("role", StringUtils.hasText(role) ? role : "passenger");
        body.put("status", "Active");

        List<Map<String, Object>> rows = exchangeForList(restUrl("profiles"), HttpMethod.POST, body);
        return firstOrThrow(rows, "Unable to create passenger user profile.");
    }

    private Optional<Map<String, Object>> findWalletByPassengerId(String passengerId) {
        String url = UriComponentsBuilder
                .fromUriString(restUrl("wallets"))
                .queryParam("select", "id,balance")
                .queryParam("passenger_id", "eq." + passengerId)
                .queryParam("limit", "1")
                .toUriString();

        List<Map<String, Object>> rows = exchangeForList(url, HttpMethod.GET, null);
        return rows.stream().findFirst();
    }

    private Map<String, Object> createWalletForPassenger(String passengerId) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("id", java.util.UUID.randomUUID().toString());
        body.put("passenger_id", passengerId);
        body.put("balance", 0.0);
        body.put("updated_at", now());

        List<Map<String, Object>> rows = exchangeForList(restUrl("wallets"), HttpMethod.POST, body);
        return firstOrThrow(rows, "Unable to create wallet.");
    }

    private Optional<Double> findWalletBalance(String walletId) {
        String url = UriComponentsBuilder
                .fromUriString(restUrl("wallets"))
                .queryParam("select", "balance")
                .queryParam("id", "eq." + walletId)
                .queryParam("limit", "1")
                .toUriString();

        List<Map<String, Object>> rows = exchangeForList(url, HttpMethod.GET, null);
        return rows.stream()
                .findFirst()
                .map(row -> readDouble(row.get("balance")));
    }

    private List<Map<String, Object>> exchangeForList(
            String url,
            HttpMethod method,
            Map<String, Object> body
    ) {
        try {
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers());
            ResponseEntity<List> response = restTemplate.exchange(url, method, entity, List.class);
            return (List<Map<String, Object>>) response.getBody();
        } catch (RestClientException ex) {
            throw new PaymentException(
                    HttpStatus.BAD_GATEWAY,
                    "SUPABASE_PAYMENT_ERROR",
                    "Unable to update wallet payment data: " + ex.getMessage()
            );
        }
    }

    private HttpHeaders headers() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("apikey", serviceKey);
        headers.setBearerAuth(serviceKey);
        headers.set("Prefer", "return=representation");
        headers.set("Accept-Profile", "public");
        headers.set("Content-Profile", "public");
        return headers;
    }

    private String restUrl(String path) {
        return supabaseUrl + "/rest/v1/" + path;
    }

    private TopUpPaymentRecord toTopUpRecord(Map<String, Object> row) {
        return new TopUpPaymentRecord(
                readString(row.get("id")),
                readString(row.get("passenger_id")),
                readString(row.get("wallet_id")),
                readBigDecimal(row.get("amount")),
                readString(row.get("currency")),
                readString(row.get("status")),
                readString(row.get("stripe_checkout_session_id")),
                readString(row.get("stripe_payment_intent_id")),
                null
        );
    }

    private Map<String, Object> firstOrThrow(List<Map<String, Object>> rows, String message) {
        if (rows == null || rows.isEmpty()) {
            throw new PaymentException(HttpStatus.BAD_GATEWAY, "SUPABASE_EMPTY_RESPONSE", message);
        }
        return rows.get(0);
    }

    private void ensureSupabaseConfigured() {
        if (!StringUtils.hasText(supabaseUrl) || !StringUtils.hasText(serviceKey)) {
            throw new PaymentException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "SUPABASE_NOT_CONFIGURED",
                    "Supabase URL or service key is not configured."
            );
        }
    }

    private String now() {
        return OffsetDateTime.now(ZoneOffset.UTC).toString();
    }

    private Double readDouble(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Number number) {
            return number.doubleValue();
        }
        return Double.valueOf(value.toString());
    }

    private BigDecimal readBigDecimal(Object value) {
        if (value == null) {
            return BigDecimal.ZERO;
        }
        if (value instanceof BigDecimal decimal) {
            return decimal;
        }
        if (value instanceof Number number) {
            return BigDecimal.valueOf(number.doubleValue());
        }
        return new BigDecimal(value.toString());
    }

    private String readString(Object value) {
        return value == null ? null : value.toString();
    }
}
