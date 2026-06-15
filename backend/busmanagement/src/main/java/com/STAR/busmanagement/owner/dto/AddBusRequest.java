package com.STAR.busmanagement.owner.dto;

import lombok.Data;

@Data
public class AddBusRequest {
    private String busNo;
    private String routeId;
    private String seatTemplate;
}