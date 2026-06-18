package com.STAR.busmanagement.owner.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class DriverListResponse {
    private String name;
    private String contactNo;
    private String email;
    private String driverId;
    private String licenceNo;
    private String assignedBusNo;
    private String totalDrivingHours;
}