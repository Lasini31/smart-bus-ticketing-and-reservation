package com.STAR.busmanagement.driver.dto;

import lombok.Data;

@Data
public class DriverProfileResponse {
    private String name;
    private String id;
    private String phone;
    private String email;
    private String address;
    private String licenseNumber;
    private String experience;
    private Double rating;
    private Integer totalTrips;
    private String busNo;
    private String busTurn;
    private String schedule;
}
