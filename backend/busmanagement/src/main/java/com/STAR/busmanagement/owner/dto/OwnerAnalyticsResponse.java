package com.STAR.busmanagement.owner.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class OwnerAnalyticsResponse {
    private Integer totalBuses;
    private Integer totalDrivers;
    private Integer totalPassengers;
    private Integer tripsToday;
    private Double revenueToday;
    private String generatedAt;
}