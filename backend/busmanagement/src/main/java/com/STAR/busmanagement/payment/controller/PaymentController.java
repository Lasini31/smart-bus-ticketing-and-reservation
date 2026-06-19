package com.STAR.busmanagement.payment.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.STAR.busmanagement.payment.dto.CreateTopUpCheckoutSessionRequest;
import com.STAR.busmanagement.payment.dto.CreateTopUpCheckoutSessionResponse;
import com.STAR.busmanagement.payment.dto.StripeWebhookResponse;
import com.STAR.busmanagement.payment.dto.TopUpPaymentStatusResponse;
import com.STAR.busmanagement.payment.service.StripeTopUpService;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final StripeTopUpService stripeTopUpService;

    public PaymentController(StripeTopUpService stripeTopUpService) {
        this.stripeTopUpService = stripeTopUpService;
    }

    @PostMapping("/topups/checkout-session")
    public ResponseEntity<CreateTopUpCheckoutSessionResponse> createTopUpCheckoutSession(
            @RequestBody CreateTopUpCheckoutSessionRequest request,
            @AuthenticationPrincipal Jwt jwt
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(stripeTopUpService.createCheckoutSession(request, jwt));
    }

    @GetMapping("/topups/sessions/{sessionId}")
    public ResponseEntity<TopUpPaymentStatusResponse> getTopUpStatus(
            @PathVariable String sessionId,
            @AuthenticationPrincipal Jwt jwt
    ) {
        return ResponseEntity.ok(stripeTopUpService.getTopUpStatus(sessionId, jwt));
    }

    @PostMapping("/stripe/webhook")
    public ResponseEntity<StripeWebhookResponse> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "Stripe-Signature", required = false) String signature
    ) {
        return ResponseEntity.ok(stripeTopUpService.handleWebhook(payload, signature));
    }
}
