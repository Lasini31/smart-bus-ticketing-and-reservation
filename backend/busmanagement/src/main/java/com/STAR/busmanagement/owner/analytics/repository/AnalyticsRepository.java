package com.STAR.busmanagement.owner.analytics.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.STAR.busmanagement.owner.analytics.dto.BookingTrendDTO;
import com.STAR.busmanagement.owner.analytics.dto.BusIncomeDTO;
import com.STAR.busmanagement.owner.analytics.dto.RoutePopularityDTO;

import java.util.ArrayList;
import java.util.List;

@Repository
public class AnalyticsRepository {

    private final JdbcTemplate jdbc;

    public AnalyticsRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public long getTotalBookings() {
        try {
            Long result = jdbc.queryForObject(
                "SELECT COUNT(*) FROM bookings", Long.class);
            return result != null ? result : 0L;
        } catch (Exception e) {
            return 0L;
        }
    }

    public double getTotalRevenue() {
        try {
            Double result = jdbc.queryForObject(
                "SELECT COALESCE(SUM(fare), 0) FROM bookings",
                Double.class);
            return result != null ? result : 0.0;
        } catch (Exception e) {
            return 0.0;
        }
    }

    public long getTotalUsers() {
        try {
            Long result = jdbc.queryForObject(
                "SELECT COUNT(*) FROM profiles", Long.class);
            return result != null ? result : 0L;
        } catch (Exception e) {
            return 0L;
        }
    }

    public long getTotalBuses() {
        try {
            Long result = jdbc.queryForObject(
                "SELECT COUNT(*) FROM buses WHERE status = true",
                Long.class);
            return result != null ? result : 0L;
        } catch (Exception e) {
            return 0L;
        }
    }

    public long getActiveRoutes() {
        try {
            Long result = jdbc.queryForObject(
                "SELECT COUNT(*) FROM routes WHERE status = true",
                Long.class);
            return result != null ? result : 0L;
        } catch (Exception e) {
            return 0L;
        }
    }

    public long getCancelledBookings() {
        try {
            Long result = jdbc.queryForObject(
                "SELECT COUNT(*) FROM cancellations", Long.class);
            return result != null ? result : 0L;
        } catch (Exception e) {
            return 0L;
        }
    }

    public List<BookingTrendDTO> getBookingTrends(int days) {
        try {
            String sql = "SELECT TO_CHAR(created_at, 'DD Mon') AS date, " +
                         "COUNT(*) AS count " +
                         "FROM bookings " +
                         "WHERE created_at >= NOW() - INTERVAL '" + days + " days' " +
                         "GROUP BY TO_CHAR(created_at, 'DD Mon'), DATE(created_at) " +
                         "ORDER BY DATE(created_at) ASC";
            return jdbc.query(sql, (rs, r) ->
                new BookingTrendDTO(rs.getString("date"), rs.getLong("count")));
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    public List<RoutePopularityDTO> getTopRoutes(int limit) {
        try {
            String sql = "SELECT r.name, COUNT(b.id) AS cnt " +
                         "FROM bookings b " +
                         "JOIN trips t ON b.trip_id = t.id " +
                         "JOIN routes r ON t.route_id = r.id " +
                         "GROUP BY r.name " +
                         "ORDER BY cnt DESC " +
                         "LIMIT " + limit;
            return jdbc.query(sql, (rs, r) ->
                new RoutePopularityDTO(rs.getString("name"), rs.getLong("cnt")));
        } catch (Exception e) {
            return new ArrayList<>();
        }
    } // <--- This was the missing closing brace!

    public List<BusIncomeDTO> getBusIncomeAnalytics() {
        try {
            // Note: If 'route_no' is not yet in the Supabase view, the query will fail if we select it.
            // For now, we will query what the leader provided. You will need to ask the database 
            // designer to add route_no to the view later.
            String sql = "SELECT plate_no, target_income, income_last_30_days, target_percentage FROM bus_income_analytics";
            
            return jdbc.query(sql, (rs, rowNum) -> {
                BusIncomeDTO dto = new BusIncomeDTO();
                dto.setPlateNo(rs.getString("plate_no"));
                dto.setTargetIncome(rs.getDouble("target_income"));
                dto.setIncomeLast30Days(rs.getDouble("income_last_30_days"));
                dto.setTargetPercentage(rs.getDouble("target_percentage"));
                
                // Set routeNo to a placeholder until the DB view is updated to include it
                dto.setRouteNo("N/A"); 
                
                return dto;
            });
        } catch (Exception e) {
            e.printStackTrace(); 
            return new ArrayList<>();
        }
    }
}