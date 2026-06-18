package com.STAR.busmanagement.auth.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Data;

@Data
public class LoginRequest {
    @JsonAlias({"username"})
    private String email;

    @JsonAlias({"password"})
    private String licenseNumber;
}