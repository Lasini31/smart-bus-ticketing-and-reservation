package com.STAR.busmanagement.wallet.dto;

import lombok.Data;

@Data
public class PaymentConfirmRequest {
    private String paymentId;
    private String passengerId;
    private Float fare;   // in LKR
}
