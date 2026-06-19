package com.STAR.busmanagement.driver.dto;

import lombok.Data;

@Data
public class PassengerManifestResponse {
    private String id;          // frontend uses "id" not "passengerId"
    private String name;
    private String stop;        // frontend uses "stop" not "boardingStop"
    private boolean boarded;    // frontend needs this field
    private String seatSelection;
}