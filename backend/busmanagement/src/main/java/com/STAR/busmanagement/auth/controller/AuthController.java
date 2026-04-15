package com.STAR.busmanagement.auth.controller;

import com.STAR.busmanagement.auth.dto.*;
import com.STAR.busmanagement.auth.service.AuthService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService; //AuthService used for mock data checking

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    //Controller mapping for Auth
    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }


    //Controller mapping for Register
    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    //Controller mapping for FORGOT PASSWORD
    @PostMapping("/forgot-password")
    public void forgotPassword(@RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
    }

    //Controller mapping for GOOGLE LOGIN
    @PostMapping("/login-google")
    public AuthResponse googleLogin(@RequestBody GoogleLoginRequest request) {
        return authService.loginWithGoogle(request);
    }

    // Controller mapping for LOGOUT
    @DeleteMapping("/logout")
    public void logout(@RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        authService.logout(token);
    }

}