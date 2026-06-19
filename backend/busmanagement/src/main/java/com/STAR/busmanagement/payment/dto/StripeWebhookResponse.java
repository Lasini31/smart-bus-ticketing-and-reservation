package com.STAR.busmanagement.payment.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StripeWebhookResponse {

    private boolean received;
    private String eventType;
    private String message;
}
