package com.STAR.busmanagement.payment.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class CreateTopUpCheckoutSessionRequest {

    private BigDecimal amount;
}
