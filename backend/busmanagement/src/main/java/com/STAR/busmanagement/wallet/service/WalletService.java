package com.STAR.busmanagement.wallet.service;

import com.STAR.busmanagement.wallet.dto.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class WalletService {

    private final RestTemplate restTemplate;

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    @Value("${supabase.service-key}")
    private String supabaseServiceKey;

    public WalletService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // ----------------------------------------------------------------
    // GET /wallet/{id}  →  get current wallet balance
    // ----------------------------------------------------------------
    public WalletBalanceResponse getBalance(String passengerId) {
        Map<String, Object> wallet = getOrCreateWallet(passengerId);

        WalletBalanceResponse resp = new WalletBalanceResponse();
        resp.setWalletId((String) wallet.get("id"));
        resp.setBalance(toFloat(wallet.get("balance")));
        resp.setLastUpdated((String) wallet.get("updated_at"));
        return resp;
    }

    // ----------------------------------------------------------------
    // GET /wallet/{id}/transactions  →  view transaction history
    // ----------------------------------------------------------------
    public List<TransactionResponse> getTransactions(String passengerId) {
        Map<String, Object> wallet = getOrCreateWallet(passengerId);
        String walletId = (String) wallet.get("id");

        String url = supabaseUrl + "/rest/v1/wallet_transactions"
                + "?wallet_id=eq." + walletId
                + "&order=created_at.desc";

        ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                url, HttpMethod.GET, new HttpEntity<>(buildHeaders()),
                new ParameterizedTypeReference<>() {}
        );

        List<Map<String, Object>> rows = response.getBody();
        if (rows == null || rows.isEmpty()) return new ArrayList<>();

        return rows.stream().map(row -> {
            TransactionResponse tr = new TransactionResponse();
            tr.setPaymentId((String) row.get("id"));
            tr.setAmount(toFloat(row.get("amount")));
            tr.setTransactionType((String) row.getOrDefault("type", "unknown"));
            tr.setTimestamp((String) row.get("created_at"));
            return tr;
        }).toList();
    }

    // ----------------------------------------------------------------
    // POST /wallet/{id}/topup  →  add funds
    // ----------------------------------------------------------------
    public WalletResponse topUp(String passengerId, TopUpRequest request) {
        if (request.getAmount() == null || request.getAmount() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Amount must be > 0");
        }

        Map<String, Object> wallet = getOrCreateWallet(passengerId);
        String walletId = (String) wallet.get("id");
        float newBalance = toFloat(wallet.get("balance")) + request.getAmount();
        String now = Instant.now().toString();

        updateWalletBalance(walletId, newBalance, now);
        logTransaction(walletId, request.getAmount(), "top_up",
                "Top-up via " + request.getMethod(), null, "completed");

        WalletResponse resp = new WalletResponse();
        resp.setWalletId(walletId);
        resp.setNewBalance(newBalance);
        resp.setMessage("Top-up successful via " + request.getMethod());
        resp.setTimestamp(now);
        return resp;
    }

    // ----------------------------------------------------------------
    // POST /payment/confirm  →  deduct fare from wallet
    // ----------------------------------------------------------------
    public WalletResponse confirmPayment(PaymentConfirmRequest request) {
        if (request.getFare() == null || request.getFare() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Fare must be > 0");
        }

        Map<String, Object> wallet = getOrCreateWallet(request.getPassengerId());
        float currentBalance = toFloat(wallet.get("balance"));

        if (currentBalance < request.getFare()) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Insufficient wallet balance");
        }

        String walletId = (String) wallet.get("id");
        float newBalance = currentBalance - request.getFare();
        String now = Instant.now().toString();

        updateWalletBalance(walletId, newBalance, now);
        logTransaction(walletId, request.getFare(), "ticket_purchase",
                "Booking payment", request.getPaymentId(), "completed");

        WalletResponse resp = new WalletResponse();
        resp.setWalletId(walletId);
        resp.setNewBalance(newBalance);
        resp.setMessage("Payment confirmed");
        resp.setTimestamp(now);
        return resp;
    }

    // ----------------------------------------------------------------
    // POST /wallet/{id}/refund  →  cancel booking & refund to wallet
    // ----------------------------------------------------------------
    public WalletResponse processRefund(String passengerId, RefundRequest request) {
        if (request.getAmount() == null || request.getAmount() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Refund amount must be > 0");
        }

        // Verify booking exists (passenger_id in bookings is bigint; UUID match is best-effort)
        String bookingUrl = supabaseUrl + "/rest/v1/bookings"
                + "?booking_id=eq." + request.getBookingId()
                + "&select=booking_id,status,fare";

        ResponseEntity<List<Map<String, Object>>> bookingResp = restTemplate.exchange(
                bookingUrl, HttpMethod.GET, new HttpEntity<>(buildHeaders()),
                new ParameterizedTypeReference<>() {}
        );

        List<Map<String, Object>> bookings = bookingResp.getBody();
        if (bookings == null || bookings.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found");
        }

        float refundAmount = request.getAmount() * 0.90f; // 10% cancellation fee

        Map<String, Object> wallet = getOrCreateWallet(passengerId);
        String walletId = (String) wallet.get("id");
        float newBalance = toFloat(wallet.get("balance")) + refundAmount;
        String now = Instant.now().toString();

        // Credit wallet
        updateWalletBalance(walletId, newBalance, now);

        // Mark booking as cancelled
        HttpHeaders headers = buildWriteHeaders();
        headers.set("Prefer", "return=minimal");
        String cancelUrl = supabaseUrl + "/rest/v1/bookings?booking_id=eq." + request.getBookingId();
        restTemplate.exchange(cancelUrl, HttpMethod.PATCH,
                new HttpEntity<>(Map.of("status", "cancelled"), headers), Void.class);

        // Record in cancellations table
        Map<String, Object> cancellation = new HashMap<>();
        cancellation.put("booking_id", request.getBookingId());
        cancellation.put("cancelled_by", passengerId);
        cancellation.put("reason", "Cancelled by passenger");
        cancellation.put("refund_amount", refundAmount);
        restTemplate.exchange(supabaseUrl + "/rest/v1/cancellations", HttpMethod.POST,
                new HttpEntity<>(cancellation, headers), Void.class);

        logTransaction(walletId, refundAmount, "refund",
                "Booking cancellation - 10% fee applied", request.getBookingId(), "completed");

        WalletResponse resp = new WalletResponse();
        resp.setWalletId(walletId);
        resp.setNewBalance(newBalance);
        resp.setMessage("Booking cancelled. Refund applied with 10% fee.");
        resp.setTimestamp(now);
        return resp;
    }

    // ----------------------------------------------------------------
    // POST /wallet/{id}/refund-to-bank  →  withdraw to bank
    // ----------------------------------------------------------------
    public WalletResponse refundToBank(String passengerId, BankRefundRequest request) {
        if (request.getAmount() == null || request.getAmount() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Amount must be > 0");
        }

        Map<String, Object> wallet = getOrCreateWallet(passengerId);
        float currentBalance = toFloat(wallet.get("balance"));

        if (currentBalance < request.getAmount()) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
                    "Insufficient wallet balance for withdrawal");
        }

        String walletId = (String) wallet.get("id");
        float newBalance = currentBalance - request.getAmount();
        String now = Instant.now().toString();

        updateWalletBalance(walletId, newBalance, now);
        logTransaction(walletId, request.getAmount(), "withdrawal",
                "Bank withdrawal", null, "completed");

        WalletResponse resp = new WalletResponse();
        resp.setWalletId(walletId);
        resp.setNewBalance(newBalance);
        resp.setMessage("Successfully refunded to bank");
        resp.setTimestamp(now);
        return resp;
    }

    // ----------------------------------------------------------------
    // Private helpers
    // ----------------------------------------------------------------

    private Map<String, Object> getOrCreateWallet(String passengerId) {
        String url = supabaseUrl + "/rest/v1/wallets"
                + "?passenger_id=eq." + passengerId
                + "&select=id,balance,updated_at";

        ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                url, HttpMethod.GET, new HttpEntity<>(buildHeaders()),
                new ParameterizedTypeReference<>() {}
        );

        List<Map<String, Object>> rows = response.getBody();
        if (rows != null && !rows.isEmpty()) {
            return rows.get(0);
        }

        // No wallet yet — create one automatically
        String walletId = UUID.randomUUID().toString();
        Map<String, Object> newWallet = new HashMap<>();
        newWallet.put("id", walletId);
        newWallet.put("passenger_id", passengerId);
        newWallet.put("balance", 0.0);

        HttpHeaders headers = buildWriteHeaders();
        headers.set("Prefer", "return=representation");

        ResponseEntity<List<Map<String, Object>>> createResp = restTemplate.exchange(
                supabaseUrl + "/rest/v1/wallets", HttpMethod.POST,
                new HttpEntity<>(newWallet, headers),
                new ParameterizedTypeReference<>() {}
        );

        List<Map<String, Object>> created = createResp.getBody();
        if (created == null || created.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create wallet");
        }
        return created.get(0);
    }

    private void updateWalletBalance(String walletId, float newBalance, String now) {
        String patchUrl = supabaseUrl + "/rest/v1/wallets?id=eq." + walletId;
        HttpHeaders headers = buildWriteHeaders();
        headers.set("Prefer", "return=minimal");
        restTemplate.exchange(patchUrl, HttpMethod.PATCH,
                new HttpEntity<>(Map.of("balance", newBalance, "updated_at", now), headers),
                Void.class);
    }

    private void logTransaction(String walletId, float amount, String type,
                                String description, String referenceId, String status) {
        Map<String, Object> tx = new HashMap<>();
        tx.put("wallet_id", walletId);
        tx.put("amount", amount);
        tx.put("type", type);
        tx.put("description", description);
        tx.put("status", status);
        if (referenceId != null) {
            tx.put("reference_id", referenceId);
        }

        HttpHeaders headers = buildWriteHeaders();
        headers.set("Prefer", "return=minimal");
        restTemplate.exchange(supabaseUrl + "/rest/v1/wallet_transactions", HttpMethod.POST,
                new HttpEntity<>(tx, headers), Void.class);
    }

    private float toFloat(Object val) {
        if (val == null) return 0f;
        if (val instanceof Number n) return n.floatValue();
        return Float.parseFloat(val.toString());
    }

    private HttpHeaders buildHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("apikey", supabaseKey);
        headers.set("Authorization", "Bearer " + supabaseKey);
        return headers;
    }

    private HttpHeaders buildWriteHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("apikey", supabaseServiceKey);
        headers.set("Authorization", "Bearer " + supabaseServiceKey);
        return headers;
    }
}
