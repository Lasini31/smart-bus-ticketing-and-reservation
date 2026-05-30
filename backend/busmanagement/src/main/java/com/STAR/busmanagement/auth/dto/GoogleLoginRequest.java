package com.STAR.busmanagement.auth.dto;

import lombok.Data;

@Data
public class GoogleLoginRequest {
    private String idToken; // Google OAuth ID token
}