/*package com.STAR.busmanagement.wallet.controller;

import com.STAR.busmanagement.wallet.dto.*;
import com.STAR.busmanagement.wallet.service.WalletService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/wallet")
public class WalletController {

    private final WalletService walletService;

    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    // GET /wallet/{id}  →  get balance
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('passenger', 'admin')")
    public ResponseEntity<WalletBalanceResponse> getBalance(@PathVariable String id) {
        return ResponseEntity.ok(walletService.getBalance(id));
    }

    // POST /wallet/{id}/topup  →  add funds
    @PostMapping("/{id}/topup")
    @PreAuthorize("hasAuthority('passenger')")
    public ResponseEntity<WalletResponse> topUp(
            @PathVariable String id,
            @RequestBody TopUpRequest request) {
        return ResponseEntity.ok(walletService.topUp(id, request));
    }

    // POST /wallet/{id}/refund  →  refund to wallet
    @PostMapping("/{id}/refund")
    @PreAuthorize("hasAnyAuthority('passenger', 'admin')")
    public ResponseEntity<WalletResponse> refund(
            @PathVariable String id,
            @RequestBody RefundRequest request) {
        return ResponseEntity.ok(walletService.processRefund(id, request));
    }
}*/

package com.STAR.busmanagement.wallet.controller;

import com.STAR.busmanagement.wallet.dto.*;
import com.STAR.busmanagement.wallet.service.WalletService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wallet")
public class WalletController {

    private final WalletService walletService;

    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    // GET /wallet/{id}  →  get balance
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('passenger', 'admin')")
    public ResponseEntity<WalletBalanceResponse> getBalance(@PathVariable String id) {
        return ResponseEntity.ok(walletService.getBalance(id));
    }

    // GET /wallet/{id}/transactions → display recent transactions
    @GetMapping("/{id}/transactions")
    @PreAuthorize("hasAnyAuthority('passenger', 'admin')")
    public ResponseEntity<List<TransactionResponse>> getTransactions(@PathVariable String id) {
        return ResponseEntity.ok(walletService.getTransactions(id));
    }

    // POST /wallet/{id}/topup  →  add funds (supports "bank" as method)
    @PostMapping("/{id}/topup")
    @PreAuthorize("hasAuthority('passenger')")
    public ResponseEntity<WalletResponse> topUp(
            @PathVariable String id,
            @RequestBody TopUpRequest request) {
        return ResponseEntity.ok(walletService.topUp(id, request));
    }

    // POST /wallet/{id}/refund  →  cancel booking & refund to wallet (minus 10% fee)
    @PostMapping("/{id}/refund")
    @PreAuthorize("hasAnyAuthority('passenger', 'admin')")
    public ResponseEntity<WalletResponse> refund(
            @PathVariable String id,
            @RequestBody RefundRequest request) {
        return ResponseEntity.ok(walletService.processRefund(id, request));
    }

    // POST /wallet/{id}/refund-to-bank  →  refund full requested amount to bank
    @PostMapping("/{id}/refund-to-bank")
    @PreAuthorize("hasAuthority('passenger')")
    public ResponseEntity<WalletResponse> refundToBank(
            @PathVariable String id,
            @RequestBody BankRefundRequest request) {
        return ResponseEntity.ok(walletService.refundToBank(id, request));
    }
}