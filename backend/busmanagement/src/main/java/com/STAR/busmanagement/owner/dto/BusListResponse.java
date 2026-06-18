package com.STAR.busmanagement.owner.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class BusListResponse {
    private String busNo;
    private String routeNo;
    private String assignedDriver;
    private String assignedDriverId;
    private String type;
    private Double targetIncome;
    private Double percentage;
}