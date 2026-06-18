package com.STAR.busmanagement.analytics.service;

import com.STAR.busmanagement.analytics.dto.AnalyticsSummaryDTO;
import com.STAR.busmanagement.analytics.dto.BookingTrendDTO;
import com.STAR.busmanagement.analytics.dto.BusIncomeDTO;
import com.STAR.busmanagement.analytics.dto.RoutePopularityDTO;
import com.STAR.busmanagement.analytics.repository.AnalyticsRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AnalyticsService {

    private final AnalyticsRepository repo;

    public AnalyticsService(AnalyticsRepository repo) {
        this.repo = repo;
    }

    // Collects all summary numbers into one response object
    public AnalyticsSummaryDTO getSummary() {
        return new AnalyticsSummaryDTO(
            repo.getTotalBookings(),
            repo.getTotalRevenue(),
            repo.getTotalUsers(),
            repo.getTotalBuses(),
            repo.getActiveRoutes(),
            repo.getCancelledBookings()
        );
    }

    // Validates days value then fetches trends
    public List<BookingTrendDTO> getBookingTrends(int days) {
        if (days <= 0 || days > 365) days = 30;
        return repo.getBookingTrends(days);
    }

    // Validates limit value then fetches top routes
    public List<RoutePopularityDTO> getTopRoutes(int limit) {
        if (limit <= 0 || limit > 20) limit = 5;
        return repo.getTopRoutes(limit);
    }

    // NEW METHOD: Fetches the bus income analytics for the frontend progress bars
    public List<BusIncomeDTO> getBusIncomeAnalytics() {
        return repo.getBusIncomeAnalytics();
    }
}