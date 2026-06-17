package com.STAR.busmanagement.driver.dto;

import lombok.Data;

@Data
public class ShiftResponse {
    private String driverId;
    private String status;   // "STARTED" | "ENDED"
    private String timestamp;
}
