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
import jakarta.servlet.http.HttpServletRequest;
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
    public JwtDecoder jwtDecoder(@Value("${env.VITE_SUPABASE_URL}") String supabaseUrl) {
        String jwkSetUri = supabaseUrl + "/auth/v1/.well-known/jwks.json";
        log.info("Configuring JwtDecoder with JWK set URI {}", jwkSetUri);

        RestTemplate restTemplate = new RestTemplate(new SimpleClientHttpRequestFactory());
        restTemplate.getInterceptors().add((request, body, execution) -> {
            request.getHeaders().set("apikey", "sb_publishable_zWjaFipP-Rn95FQ44BRKbg_9WqwSPpi");
            request.getHeaders().set(HttpHeaders.ACCEPT, "application/json");
            return execution.execute(request, body);
        });

        return NimbusJwtDecoder
                .withJwkSetUri(jwkSetUri)
                .restOperations((RestOperations) restTemplate)
                .jwsAlgorithm(SignatureAlgorithm.ES256)
                .build();
    }
}
