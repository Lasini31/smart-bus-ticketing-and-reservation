package com.STAR.busmanagement.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.oauth2.jose.jws.SignatureAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.security.oauth2.server.resource.web.DefaultBearerTokenResolver;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.LinkedHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestOperations;
import org.springframework.web.client.RestTemplate;

@Configuration
public class SecurityConfig {

    private static final Logger log = LoggerFactory.getLogger(SecurityConfig.class);

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

                                    String authorization = request.getHeader("Authorization");
                                    if (authorization == null) {
                                        log.warn("No Authorization header on {} {}", request.getMethod(), request.getRequestURI());
                                    } else {
                                        log.info("Authorization header received for {} {}. Prefix={}",
                                                request.getMethod(),
                                                request.getRequestURI(),
                                                authorization.length() >= 12 ? authorization.substring(0, 12) : authorization);
                                    }

                                    if (authorization != null) {
                                        String token = authorization.trim();
                                        if (token.regionMatches(true, 0, "Bearer ", 0, 7)) {
                                            token = token.substring(7).trim();
                                            if (token.regionMatches(true, 0, "Bearer ", 0, 7)) {
                                                token = token.substring(7).trim();
                                            }

                                            if ((token.startsWith("\"") && token.endsWith("\""))
                                                    || (token.startsWith("'") && token.endsWith("'"))) {
                                                token = token.substring(1, token.length() - 1).trim();
                                            }

                                            log.info("Bearer token normalized. Length={}, prefix={}, suffix={}",
                                                    token.length(),
                                                    token.length() >= 12 ? token.substring(0, 12) : token,
                                                    token.length() >= 12 ? token.substring(Math.max(0, token.length() - 12)) : token);
                                            return token;
                                        }
                                    }

                                    log.debug("Delegating bearer token resolution to default resolver for {} {}", request.getMethod(), request.getRequestURI());
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
