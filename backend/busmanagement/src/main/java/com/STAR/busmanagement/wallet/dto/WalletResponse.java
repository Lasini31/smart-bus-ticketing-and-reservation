package com.STAR.busmanagement.wallet.dto;

import lombok.Data;

@Data
public class WalletResponse {
    private String walletId;
    private Float newBalance;
    private String message;
    private String timestamp;
}
