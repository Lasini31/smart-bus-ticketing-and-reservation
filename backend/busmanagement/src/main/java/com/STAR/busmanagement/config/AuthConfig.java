package com.STAR.busmanagement.config;

import com.STAR.busmanagement.auth.service.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;

@Configuration
public class AuthConfig {

    @Value("${app.auth.mock}")
    private boolean mock;

    @Bean
    public AuthService authService(
            MockAuthService mockService,
            SupabaseAuthService realService
    ) {
        return mock ? mockService : realService;
    }
}