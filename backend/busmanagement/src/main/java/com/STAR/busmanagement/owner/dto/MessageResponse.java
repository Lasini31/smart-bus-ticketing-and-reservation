package com.STAR.busmanagement.owner.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class MessageResponse {
    private Boolean success;
    private String message;
}