package com.STAR.busmanagement.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.security.oauth2.server.resource.web.DefaultBearerTokenResolver;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.LinkedHashMap;

@Configuration
public class SecurityConfig {

    @Value("${app.auth.mock:false}")
    private boolean mock;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.csrf(csrf -> csrf.disable());
        http.cors(cors -> {});

        if (mock) {
            http.authorizeHttpRequests(auth -> auth
                    .anyRequest().permitAll()
            );
        } else {
            http
                    .authorizeHttpRequests(auth -> auth
                            .requestMatchers("/auth/**").permitAll()
                            .requestMatchers("/payments/stripe/webhook").permitAll()
                            .anyRequest().authenticated()
                    )
                    .oauth2ResourceServer(oauth -> oauth
                            .authenticationEntryPoint((request, response, authException) -> {
                                System.err.println("Spring Security Authentication Failed: " + authException.getMessage());
                                authException.printStackTrace();
                                response.sendError(jakarta.servlet.http.HttpServletResponse.SC_UNAUTHORIZED, authException.getMessage());
                            })
                            .bearerTokenResolver(new BearerTokenResolver() {
                                private final DefaultBearerTokenResolver defaultResolver
                                        = new DefaultBearerTokenResolver();

                                @Override
                                public String resolve(HttpServletRequest request) {
                                    // Skip JWT processing entirely for public endpoints
                                    if (request.getRequestURI().startsWith("/auth/")
                                            || request.getRequestURI().equals("/payments/stripe/webhook")) {
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

    @Bean
    public JwtDecoder jwtDecoder() {
        return token -> {
            try {
                com.nimbusds.jwt.JWT jwt = com.nimbusds.jwt.JWTParser.parse(token);
                Map<String, Object> claims = jwt.getJWTClaimsSet().getClaims();
                Map<String, Object> headers = new LinkedHashMap<>(jwt.getHeader().toJSONObject());
                
                // Convert claims to match Spring Security types
                Map<String, Object> springClaims = new LinkedHashMap<>(claims);
                
                // Extract timestamps
                java.time.Instant issuedAt = jwt.getJWTClaimsSet().getIssueTime() != null 
                        ? jwt.getJWTClaimsSet().getIssueTime().toInstant() 
                        : java.time.Instant.now();
                java.time.Instant expiresAt = jwt.getJWTClaimsSet().getExpirationTime() != null 
                        ? jwt.getJWTClaimsSet().getExpirationTime().toInstant() 
                        : java.time.Instant.now().plusSeconds(3600);
                
                return new org.springframework.security.oauth2.jwt.Jwt(token, issuedAt, expiresAt, headers, springClaims);
            } catch (Exception e) {
                throw new org.springframework.security.oauth2.jwt.JwtException("Failed to decode token", e);
            }
        };
    }
}
