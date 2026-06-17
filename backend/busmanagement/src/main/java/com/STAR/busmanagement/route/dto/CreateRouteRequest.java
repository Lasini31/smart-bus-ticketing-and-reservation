package com.STAR.busmanagement.route.dto;

import lombok.Data;

@Data
public class CreateRouteRequest {
    private String name;
    private String startLocation;
    private String endLocation;
    private String stops; // JSON array string e.g., '["Stop A", "Stop B"]'
    private Boolean status;
}