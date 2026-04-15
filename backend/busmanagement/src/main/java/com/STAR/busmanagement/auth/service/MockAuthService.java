//For testing mock data without Supbase DB
package com.STAR.busmanagement.auth.service;

import com.STAR.busmanagement.auth.dto.*;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class MockAuthService implements AuthService {

    @Override
    public AuthResponse login(LoginRequest request) {

        return AuthResponse.builder()
                .token(generateFakeJwt("passenger"))
                .role("passenger")
                .userId(UUID.randomUUID().toString())
                .build();
    }

    @Override
    public AuthResponse register(RegisterRequest request) {

        return AuthResponse.builder()
                .token(generateFakeJwt("passenger"))
                .role("passenger")
                .userId(UUID.randomUUID().toString())
                .build();
    }

    @Override
    public void forgotPassword(ForgotPasswordRequest request) {
        // Do nothing (simulate success)
    }

    @Override
    public AuthResponse loginWithGoogle(GoogleLoginRequest request) {

        return AuthResponse.builder()
                .token(generateFakeJwt("passenger"))
                .role("passenger")
                .userId(UUID.randomUUID().toString())
                .build();
    }

    @Override
    public void logout(String token) {
        // Do nothing
    }

    private String generateFakeJwt(String role) {
        // NOT a real JWT — just placeholder for now
        return "mock-token-" + role;
    }
}