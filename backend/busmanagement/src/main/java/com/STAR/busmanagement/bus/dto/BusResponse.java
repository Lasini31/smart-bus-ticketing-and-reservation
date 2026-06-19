package com.STAR.busmanagement.bus.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BusResponse {
    private String busNo;
    private String routeId;
    private String seatTemplate;
    private String schedule;
    private String driverId;
    private String driverName;
    private String driverPhone;
}
