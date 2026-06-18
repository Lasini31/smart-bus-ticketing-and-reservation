package com.STAR.busmanagement.exception;

public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException() {
        super("Invalid login credentials");
    }

    public InvalidCredentialsException(String message) {
        super(message);
    }
}
