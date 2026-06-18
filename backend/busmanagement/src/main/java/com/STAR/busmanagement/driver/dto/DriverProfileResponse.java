package com.STAR.busmanagement.driver.dto;

import lombok.Data;

@Data
public class DriverProfileResponse {
    private String name;
    private String id;
    private String phone;
    private String email;
    private String licenseNumber;
    private String busNo;
    private String busTurn;
    private String schedule;
    private Integer totalTrips;
}
