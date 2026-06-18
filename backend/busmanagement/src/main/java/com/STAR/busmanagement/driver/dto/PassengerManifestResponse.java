package com.STAR.busmanagement.driver.dto;

import lombok.Data;

@Data
public class PassengerManifestResponse {
    private String passengerId;
    private String name;
    private String seatSelection;
    private String boardingStop;
}
