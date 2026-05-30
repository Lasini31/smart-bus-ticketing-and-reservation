//For testing mock data without Supbase DB
package com.STAR.busmanagement.auth.service;

import com.STAR.busmanagement.auth.dto.*;

public interface AuthService {

    AuthResponse login(LoginRequest request);

    AuthResponse register(RegisterRequest request);

    void forgotPassword(ForgotPasswordRequest request);

    AuthResponse loginWithGoogle(GoogleLoginRequest request);

    void logout(String token);
}