package com.STAR.busmanagement.owner.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnalyticsSummaryDTO {
    private long totalBookings;
    private double totalRevenue;
    private long totalUsers;
    private long totalBuses;
    private long activeRoutes;
    private long cancelledBookings;
}