package com.STAR.busmanagement.owner.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RoutePopularityDTO {
    private String routeName;
    private long bookingCount;
}