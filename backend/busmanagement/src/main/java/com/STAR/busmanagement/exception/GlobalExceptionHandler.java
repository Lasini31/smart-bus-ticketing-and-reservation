package com.STAR.busmanagement.exception;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(HttpClientErrorException.class)
    public ResponseEntity<?> handleHttpClientError(HttpClientErrorException ex) {
        HttpStatus status = HttpStatus.UNAUTHORIZED;
        String message = "Invalid login credentials";

        if (!ex.getStatusCode().equals(HttpStatus.BAD_REQUEST) && !ex.getStatusCode().equals(HttpStatus.UNAUTHORIZED)) {
            status = HttpStatus.valueOf(ex.getStatusCode().value());
            message = "Authentication failed";
        }

        return ResponseEntity.status(status).body(
                Map.of("error", Map.of(
                        "code", "INVALID_CREDENTIALS",
                        "message", message
                ))
        );
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<?> handleInvalidCredentials(InvalidCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                Map.of("error", Map.of(
                        "code", "INVALID_CREDENTIALS",
                        "message", ex.getMessage()
                ))
        );
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of("error", Map.of(
                        "code", "SERVER_ERROR",
                        "message", ex.getMessage()
                ))
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneric(Exception ex) {

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of("error", Map.of(
                        "code", "SERVER_ERROR",
                        "message", ex.getMessage()
                ))
        );
    }
}