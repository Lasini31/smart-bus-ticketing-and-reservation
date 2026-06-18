package com.STAR.busmanagement.analytics.controller;

import com.STAR.busmanagement.analytics.dto.AnalyticsSummaryDTO;
import com.STAR.busmanagement.analytics.dto.BookingTrendDTO;
import com.STAR.busmanagement.analytics.dto.BusIncomeDTO;
import com.STAR.busmanagement.analytics.dto.RoutePopularityDTO;
import com.STAR.busmanagement.analytics.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/owner/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final AnalyticsService service;

    public AnalyticsController(AnalyticsService service) {
        this.service = service;
    }

    // GET /owner/analytics/summary
    // Returns: { totalBookings, totalRevenue, totalUsers, totalBuses, ... }
    @GetMapping("/summary")
    public ResponseEntity<AnalyticsSummaryDTO> getSummary() {
        return ResponseEntity.ok(service.getSummary());
    }

    // GET /owner/analytics/booking-trends?days=30
    // Returns: [ { date: "15 Jun", count: 12 }, ... ]
    @GetMapping("/booking-trends")
    public ResponseEntity<List<BookingTrendDTO>> getTrends(
        @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(service.getBookingTrends(days));
    }

    // GET /owner/analytics/top-routes?limit=5
    // Returns: [ { routeName: "Colombo-Kandy", bookingCount: 45 }, ... ]
    @GetMapping("/top-routes")
    public ResponseEntity<List<RoutePopularityDTO>> getTopRoutes(
        @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(service.getTopRoutes(limit));
    }

    // GET /owner/analytics/bus-income
    // Provides data for the specific bus progress bars on the owner dashboard
    @GetMapping("/bus-income")
    public ResponseEntity<List<BusIncomeDTO>> getBusIncomeAnalytics() {
        return ResponseEntity.ok(service.getBusIncomeAnalytics());
    }
}