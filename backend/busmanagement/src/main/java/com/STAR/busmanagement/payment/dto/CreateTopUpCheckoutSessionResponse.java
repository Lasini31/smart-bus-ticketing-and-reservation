package com.STAR.busmanagement.payment.dto;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateTopUpCheckoutSessionResponse {

    private String paymentId;
    private String checkoutSessionId;
    private String checkoutUrl;
    private BigDecimal amount;
    private String currency;
    private String status;
}
