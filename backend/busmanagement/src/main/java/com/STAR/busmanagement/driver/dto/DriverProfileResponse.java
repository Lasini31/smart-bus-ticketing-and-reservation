package com.STAR.busmanagement.driver.dto;

import lombok.Data;

@Data
public class DriverProfileResponse {
    private String driverProfile;
    private String busNo;
    private String busTurn;
    private String schedule;
}
