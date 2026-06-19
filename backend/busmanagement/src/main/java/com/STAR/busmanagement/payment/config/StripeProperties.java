package com.STAR.busmanagement.payment.config;

import java.math.BigDecimal;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Data
@Configuration
@ConfigurationProperties(prefix = "stripe")
public class StripeProperties {

    private String secretKey;
    private String webhookSecret;
    private String currency = "lkr";
    private String successUrl = "http://localhost:5173/payment?stripe_status=success&session_id={CHECKOUT_SESSION_ID}";
    private String cancelUrl = "http://localhost:5173/payment?stripe_status=cancelled";
    private BigDecimal minTopupAmount = BigDecimal.valueOf(100);
    private BigDecimal maxTopupAmount = BigDecimal.valueOf(50000);
}
