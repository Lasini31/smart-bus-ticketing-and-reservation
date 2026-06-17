package com.STAR.busmanagement.owner.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class DriverResponse {
    private String driverId;
    private String name;
    private String email;
    private String contactNumber;
    private String licenseNo;
    private String busNo;
}