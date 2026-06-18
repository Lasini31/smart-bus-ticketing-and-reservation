package com.STAR.busmanagement.wallet.dto;

import lombok.Data;

@Data
public class TopUpRequest {
    private Float amount;            // must be > 0, in LKR
    private String method;           // "card" | "bank"
    private String paymentIntentId;  // Stripe PaymentIntent ID — present for card payments
}
