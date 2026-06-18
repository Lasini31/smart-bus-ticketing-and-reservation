package com.STAR.busmanagement.wallet.dto;

import lombok.Data;

@Data
public class WalletBalanceResponse {
    private String walletId;
    private Float balance;
    private String lastUpdated;
}
