package com.STAR.busmanagement.wallet.dto;

import lombok.Data;

@Data
public class TransactionResponse {
    private String paymentId;
    private Float amount;
    private String transactionType; // TOPUP, PAYMENT, REFUND, BANK_REFUND
    private String timestamp;
}