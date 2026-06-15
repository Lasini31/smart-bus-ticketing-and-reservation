package com.STAR.busmanagement.owner.model;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class Bus {
    private String busNo;
    private String routeId;
    private String seatTemplate;
    private String schedule;
    private String driverId;
    private String ownerId;
}