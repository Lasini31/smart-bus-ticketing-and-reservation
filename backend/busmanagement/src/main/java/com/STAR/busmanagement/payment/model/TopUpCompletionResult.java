package com.STAR.busmanagement.payment.model;

public record TopUpCompletionResult(
        String paymentId,
        String walletId,
        boolean credited,
        Double newBalance
) {
}
