package com.STAR.busmanagement.auth.service;

import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.STAR.busmanagement.auth.dto.AuthResponse;
import com.STAR.busmanagement.auth.dto.ForgotPasswordRequest;
import com.STAR.busmanagement.auth.dto.GoogleLoginRequest;
import com.STAR.busmanagement.auth.dto.LoginRequest;
import com.STAR.busmanagement.auth.dto.RegisterRequest;

@Service
public class SupabaseAuthService implements AuthService {

    private final String SUPABASE_URL = "https://rpbufjokybeukqcdfumq.supabase.co";
    private final String API_KEY = "sb_publishable_zWjaFipP-Rn95FQ44BRKbg_9WqwSPpi";
    private final RestTemplate restTemplate = new RestTemplate();

    // Helper method to eliminate header duplication
    private HttpHeaders createBaseHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("apikey", API_KEY);
        return headers;
    }

    public AuthResponse login(LoginRequest request) {
        String url = SUPABASE_URL + "/auth/v1/token?grant_type=password";
        HttpHeaders headers = createBaseHeaders();

        Map<String, String> body = Map.of(
                "email", request.getUsername(),
                "password", request.getPassword()
        );

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response =
                    restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

            Map<String, Object> resp = response.getBody();
            String token = (String) resp.get("access_token");

            Map<String, Object> user = (Map<String, Object>) resp.get("user");
            String userId = (String) user.get("id");
            Map<String, Object> metadata = (Map<String, Object>) user.get("app_metadata");

            String role = (metadata != null && metadata.get("role") != null)
                    ? metadata.get("role").toString()
                    : "passenger";

            return AuthResponse.builder()
                    .token(token)
                    .role(role)
                    .userId(userId)
                    .build();
        } catch (HttpClientErrorException ex) {
            if (ex.getStatusCode() == HttpStatus.BAD_REQUEST || ex.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                throw new com.STAR.busmanagement.exception.InvalidCredentialsException();
            }
            throw new RuntimeException("Authentication failed: " + ex.getStatusCode());
        }
    }

    public AuthResponse register(RegisterRequest request) {
        String url = SUPABASE_URL + "/auth/v1/signup";
        HttpHeaders headers = createBaseHeaders();

        Map<String, Object> body = Map.of(
                "email", request.getEmail(),
                "password", request.getPassword(),
                "data", Map.of(
                        "role", request.getRole()
                        //"name", request.getName() != null ? request.getName() : "",
                        //"contact_no", request.getContact_no() != null ? request.getContact_no() : ""
                )
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response =
                restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

        Map<String, Object> resp = response.getBody();
        String token = (String) resp.get("access_token");
        Map<String, Object> user = (Map<String, Object>) resp.get("user");

        if (user == null || token == null) {
            return AuthResponse.builder()
                    .token(null)
                    .role(request.getRole())
                    .userId(null)
                    .build();
        }

        String userId = (String) user.get("id");

        return AuthResponse.builder()
                .token(token)
                .role(request.getRole()) // Duplication safely removed here
                .userId(userId)
                .build();
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        String url = SUPABASE_URL + "/auth/v1/recover";
        HttpHeaders headers = createBaseHeaders();

        Map<String, String> body = Map.of(
                "email", request.getEmail()
        );

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);
        restTemplate.exchange(url, HttpMethod.POST, entity, Void.class);
    }

    public AuthResponse loginWithGoogle(GoogleLoginRequest request) {
        String url = SUPABASE_URL + "/auth/v1/token?grant_type=id_token";
        HttpHeaders headers = createBaseHeaders();

        Map<String, String> body = Map.of(
                "provider", "google",
                "id_token", request.getIdToken()
        );

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response =
                restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

        Map<String, Object> resp = response.getBody();
        String token = (String) resp.get("access_token");

        Map<String, Object> user = (Map<String, Object>) resp.get("user");
        String userId = (String) user.get("id");
        Map<String, Object> metadata = (Map<String, Object>) user.get("app_metadata");

        String role = (metadata != null && metadata.get("role") != null)
                ? metadata.get("role").toString()
                : "passenger";

        return AuthResponse.builder()
                .token(token)
                .role(role)
                .userId(userId)
                .build();
    }

    public void logout(String token) {
        String url = SUPABASE_URL + "/auth/v1/logout";
        
        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", API_KEY);
        headers.set("Authorization", "Bearer " + token);

        HttpEntity<Void> entity = new HttpEntity<>(headers);
        restTemplate.exchange(url, HttpMethod.POST, entity, Void.class);
    }
}