package com.STAR.busmanagement.auth.service;

import com.STAR.busmanagement.auth.dto.*;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;

import java.util.Map;

@Service
public class SupabaseAuthService implements AuthService{

    @Value("${env.SUPERBASE_URL}")
    private String supabaseUrl;

    @Value("${env.SUPERBASE_API_KEY}")
    private String apiKey;


    

    private final RestTemplate restTemplate = new RestTemplate();

    public AuthResponse login(LoginRequest request) {

        String url = supabaseUrl + "/auth/v1/token?grant_type=password";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("apikey", apiKey);

        Map<String, String> body = Map.of(
                "email", request.getUsername(),
                "password", request.getPassword()
        );

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response =
                restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

        Map<String, Object> resp = response.getBody();

        String token = (String) resp.get("access_token");

        // Extract user info
        Map<String, Object> user = (Map<String, Object>) resp.get("user");

        String userId = (String) user.get("id");

        Map<String, Object> metadata = (Map<String, Object>) user.get("app_metadata");

        String role = metadata != null ? metadata.get("role").toString() : "passenger";

        return AuthResponse.builder()
                .token(token)
                .role(role)
                .userId(userId)
                .build();
    }

    public AuthResponse register(RegisterRequest request) {

    String url = supabaseUrl + "/auth/v1/signup";

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.set("apikey", apiKey);

    Map<String, Object> body = Map.of(
            "email", request.getEmail(),
            "password", request.getPassword(),
            "data", Map.of("role", "passenger") // default role
    );

    HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

    ResponseEntity<Map> response =
            restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

    Map<String, Object> resp = response.getBody();

    String token = (String) resp.get("access_token");

    Map<String, Object> user = (Map<String, Object>) resp.get("user");

    String userId = (String) user.get("id");

    return AuthResponse.builder()
            .token(token)
            .role("passenger")
            .userId(userId)
            .build();
    }

    public void forgotPassword(ForgotPasswordRequest request) {

    String url = supabaseUrl + "/auth/v1/recover";

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.set("apikey", apiKey                );

    Map<String, String> body = Map.of(
            "email", request.getEmail()
    );

    HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);

    restTemplate.exchange(url, HttpMethod.POST, entity, Void.class);
    }

    public AuthResponse loginWithGoogle(GoogleLoginRequest request) {

    String url = supabaseUrl + "/auth/v1/token?grant_type=id_token";

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.set("apikey", apiKey);

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

    String role = metadata != null ? metadata.get("role").toString() : "passenger";

    return AuthResponse.builder()
            .token(token)
            .role(role)
            .userId(userId)
            .build();
    } 
    
    public void logout(String token) {

    String url = supabaseUrl + "/auth/v1/logout";

    HttpHeaders headers = new HttpHeaders();
    headers.set("apikey", apiKey);
    headers.set("Authorization", "Bearer " + token);

    HttpEntity<Void> entity = new HttpEntity<>(headers);

    restTemplate.exchange(url, HttpMethod.POST, entity, Void.class);
    }





}