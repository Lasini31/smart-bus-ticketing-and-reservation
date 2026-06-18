package com.STAR.busmanagement.payment.dto;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TopUpPaymentStatusResponse {

    private String paymentId;
    private String checkoutSessionId;
    private String paymentIntentId;
    private BigDecimal amount;
    private String currency;
    private String status;
    private Double walletBalance;
}
