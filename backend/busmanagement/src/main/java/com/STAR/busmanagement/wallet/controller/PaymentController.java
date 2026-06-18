package com.STAR.busmanagement.wallet.controller;

import com.STAR.busmanagement.wallet.dto.PaymentConfirmRequest;
import com.STAR.busmanagement.wallet.dto.WalletResponse;
import com.STAR.busmanagement.wallet.service.WalletService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    private final WalletService walletService;

    public PaymentController(WalletService walletService) {
        this.walletService = walletService;
    }

    // POST /payment/confirm  →  deduct fare from passenger's wallet
    @PostMapping("/confirm")
    @PreAuthorize("hasAuthority('passenger')")
    public ResponseEntity<WalletResponse> confirmPayment(@RequestBody PaymentConfirmRequest request) {
        return ResponseEntity.ok(walletService.confirmPayment(request));
    }
}
