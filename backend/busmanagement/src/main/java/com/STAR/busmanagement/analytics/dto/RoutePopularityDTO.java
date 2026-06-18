package com.STAR.busmanagement.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RoutePopularityDTO {
    private String routeName;
    private long bookingCount;
}