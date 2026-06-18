package com.STAR.busmanagement.payment.model;

import java.math.BigDecimal;

public record TopUpPaymentRecord(
        String paymentId,
        String passengerId,
        String walletId,
        BigDecimal amount,
        String currency,
        String status,
        String checkoutSessionId,
        String paymentIntentId,
        Double walletBalance
) {
}
