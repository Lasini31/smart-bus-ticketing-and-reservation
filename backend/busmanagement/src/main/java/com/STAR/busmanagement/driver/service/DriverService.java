package com.STAR.busmanagement.driver.service;

import com.STAR.busmanagement.driver.dto.DriverProfileResponse;
import com.STAR.busmanagement.driver.dto.PassengerManifestResponse;
import com.STAR.busmanagement.driver.dto.ShiftResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
public class DriverService {

    private final RestTemplate restTemplate;

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    public DriverService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // ----------------------------------------------------------------
    // GET /driver/{id}  →  driver profile + assigned bus info
    // ----------------------------------------------------------------
    public DriverProfileResponse getDriverProfile(String driverId) {
        String url = supabaseUrl + "/rest/v1/DRIVER"
                + "?License_Number=eq." + driverId
                + "&select=Name,Age,Gender,Bus_Number,WORK_SHIFT(Shift_Start_Time,Shift_End_Time,Active_Passenger_Count)";

        ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                new HttpEntity<>(buildHeaders()),
                new ParameterizedTypeReference<>() {}
        );

        List<Map<String, Object>> rows = response.getBody();
        if (rows == null || rows.isEmpty()) {
            throw new RuntimeException("Driver not found: " + driverId);
        }

        Map<String, Object> row = rows.get(0);

        // Fetch bus details separately
        String busNo = (String) row.get("Bus_Number");
        String busUrl = supabaseUrl + "/rest/v1/BUS"
                + "?Bus_Number=eq." + busNo
                + "&select=Bus_License,Route,Seating_Arrangement_Template_id";

        ResponseEntity<List<Map<String, Object>>> busResponse = restTemplate.exchange(
                busUrl,
                HttpMethod.GET,
                new HttpEntity<>(buildHeaders()),
                new ParameterizedTypeReference<>() {}
        );

        List<Map<String, Object>> busRows = busResponse.getBody();
        String routeInfo = (busRows != null && !busRows.isEmpty())
                ? (String) busRows.get(0).get("Route") : "N/A";

        DriverProfileResponse dto = new DriverProfileResponse();
        dto.setDriverProfile(row.get("Name") + " | Age: " + row.get("Age") + " | Gender: " + row.get("Gender"));
        dto.setBusNo(busNo);
        dto.setBusTurn(routeInfo);
        dto.setSchedule(buildScheduleString(row));
        return dto;
    }

    // ----------------------------------------------------------------
    // GET /driver/{id}/passengers  →  active passenger manifest
    // ----------------------------------------------------------------
    public List<PassengerManifestResponse> getPassengers(String driverId) {
        // 1. Find the bus assigned to this driver
        String busUrl = supabaseUrl + "/rest/v1/BUS"
                + "?select=Bus_Number"
                + "&Bus_Number=in.(select Bus_Number from DRIVER where License_Number=eq." + driverId + ")";

        // Simpler: get driver's bus number first
        String driverUrl = supabaseUrl + "/rest/v1/DRIVER"
                + "?License_Number=eq." + driverId
                + "&select=Bus_Number";

        ResponseEntity<List<Map<String, Object>>> driverResp = restTemplate.exchange(
                driverUrl,
                HttpMethod.GET,
                new HttpEntity<>(buildHeaders()),
                new ParameterizedTypeReference<>() {}
        );

        List<Map<String, Object>> driverRows = driverResp.getBody();
        if (driverRows == null || driverRows.isEmpty()) {
            throw new RuntimeException("Driver not found: " + driverId);
        }
        String busNo = (String) driverRows.get(0).get("Bus_Number");

        // 2. Get active bookings for this bus (booking_status = confirmed)
        String bookingUrl = supabaseUrl + "/rest/v1/BOOKINGS"
                + "?select=passenger_id,start_location,PASSENGER(name),BOOKING_SEAT(SEAT(seat_number))"
                + "&booking_status=eq.confirmed";

        ResponseEntity<List<Map<String, Object>>> bookingResp = restTemplate.exchange(
                bookingUrl,
                HttpMethod.GET,
                new HttpEntity<>(buildHeaders()),
                new ParameterizedTypeReference<>() {}
        );

        List<Map<String, Object>> bookings = bookingResp.getBody();
        if (bookings == null) return List.of();

        return bookings.stream().map(b -> {
            PassengerManifestResponse p = new PassengerManifestResponse();
            p.setPassengerId((String) b.get("passenger_id"));

            @SuppressWarnings("unchecked")
            Map<String, Object> passenger = (Map<String, Object>) b.get("PASSENGER");
            p.setName(passenger != null ? (String) passenger.get("name") : "Unknown");

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> seatBookings = (List<Map<String, Object>>) b.get("BOOKING_SEAT");
            if (seatBookings != null && !seatBookings.isEmpty()) {
                @SuppressWarnings("unchecked")
                Map<String, Object> seat = (Map<String, Object>) seatBookings.get(0).get("SEAT");
                p.setSeatSelection(seat != null ? (String) seat.get("seat_number") : "N/A");
            } else {
                p.setSeatSelection("N/A");
            }

            p.setBoardingStop((String) b.get("start_location"));
            return p;
        }).toList();
    }

    // ----------------------------------------------------------------
    // POST /driver/{id}/shift/start  →  mark shift started
    // ----------------------------------------------------------------
    public ShiftResponse startShift(String driverId) {
        return updateShift(driverId, "STARTED");
    }

    // ----------------------------------------------------------------
    // POST /driver/{id}/shift/end  →  mark shift ended
    // ----------------------------------------------------------------
    public ShiftResponse endShift(String driverId) {
        return updateShift(driverId, "ENDED");
    }

    // ----------------------------------------------------------------
    // Private helpers
    // ----------------------------------------------------------------
    private ShiftResponse updateShift(String driverId, String status) {
        // Get the active work shift for this driver's bus
        String driverUrl = supabaseUrl + "/rest/v1/DRIVER"
                + "?License_Number=eq." + driverId
                + "&select=Bus_Number";

        ResponseEntity<List<Map<String, Object>>> driverResp = restTemplate.exchange(
                driverUrl,
                HttpMethod.GET,
                new HttpEntity<>(buildHeaders()),
                new ParameterizedTypeReference<>() {}
        );

        List<Map<String, Object>> rows = driverResp.getBody();
        if (rows == null || rows.isEmpty()) {
            throw new RuntimeException("Driver not found: " + driverId);
        }
        String busNo = (String) rows.get(0).get("Bus_Number");

        // PATCH the WORK_SHIFT record to update times
        String shiftUrl = supabaseUrl + "/rest/v1/WORK_SHIFT"
                + "?Bus_Number=eq." + busNo;

        String now = Instant.now().toString();
        Map<String, Object> patchBody = ("STARTED".equals(status))
                ? Map.of("Shift_Start_Time", now)
                : Map.of("Shift_End_Time", now);

        HttpHeaders headers = buildHeaders();
        headers.set("Prefer", "return=minimal");

        restTemplate.exchange(
                shiftUrl,
                HttpMethod.PATCH,
                new HttpEntity<>(patchBody, headers),
                Void.class
        );

        ShiftResponse resp = new ShiftResponse();
        resp.setDriverId(driverId);
        resp.setStatus(status);
        resp.setTimestamp(now);
        return resp;
    }

    private String buildScheduleString(Map<String, Object> row) {
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> shifts = (List<Map<String, Object>>) row.get("WORK_SHIFT");
        if (shifts == null || shifts.isEmpty()) return "No schedule";
        Map<String, Object> shift = shifts.get(0);
        return "Start: " + shift.get("Shift_Start_Time") + " | End: " + shift.get("Shift_End_Time");
    }

    private HttpHeaders buildHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("apikey", supabaseKey);
        headers.set("Authorization", "Bearer " + supabaseKey);
        return headers;
    }
}
