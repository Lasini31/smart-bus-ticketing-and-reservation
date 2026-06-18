package com.STAR.busmanagement.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.security.oauth2.server.resource.web.DefaultBearerTokenResolver;
import jakarta.servlet.http.HttpServletRequest;

@Configuration
public class SecurityConfig {

    @Value("${app.auth.mock:false}")
    private boolean mock;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.csrf(csrf -> csrf.disable());
        
        if (mock) {
            http.authorizeHttpRequests(auth -> auth
                    .anyRequest().permitAll()
            );
        } else {
            http
                    .authorizeHttpRequests(auth -> auth
                            .requestMatchers("/auth/**").permitAll()
                            .anyRequest().authenticated()
                    )
                    .oauth2ResourceServer(oauth -> oauth
                            .bearerTokenResolver(new BearerTokenResolver() {
                                private final DefaultBearerTokenResolver defaultResolver
                                        = new DefaultBearerTokenResolver();

                                @Override
                                public String resolve(HttpServletRequest request) {
                                    // Skip JWT processing entirely for /auth/** endpoints
                                    if (request.getRequestURI().startsWith("/auth/")) {
                                        return null;
                                    }
                                    return defaultResolver.resolve(request);
                                }
                            })
                            .jwt(jwt -> jwt
                                    .jwtAuthenticationConverter(new JwtAuthConverter())
                            )
                    );
        }

        return http.build();
    }
}