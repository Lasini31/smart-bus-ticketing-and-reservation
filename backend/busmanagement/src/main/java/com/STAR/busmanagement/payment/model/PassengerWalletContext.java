package com.STAR.busmanagement.payment.model;

public record PassengerWalletContext(
        String userId,
        String passengerId,
        String walletId,
        String email
) {
}
