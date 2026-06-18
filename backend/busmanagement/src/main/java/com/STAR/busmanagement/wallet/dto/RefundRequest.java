package com.STAR.busmanagement.wallet.dto;

import lombok.Data;

@Data
public class RefundRequest {
    private String bookingId;   // which booking to refund
    private Float amount;       // amount to refund in LKR
}
