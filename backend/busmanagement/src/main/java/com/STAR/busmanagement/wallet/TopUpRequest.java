package com.STAR.busmanagement.wallet.dto;

import lombok.Data;

@Data
public class BankRefundRequest {
    private Float amount; // Full amount to refund to bank
}