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
    // {id} is the profile UUID of the driver (from auth)
    // ----------------------------------------------------------------
    public DriverProfileResponse getDriverProfile(String driverId) {

        // 1. Get profile info from profiles table
        String profileUrl = supabaseUrl + "/rest/v1/profiles"
                + "?id=eq." + driverId
                + "&select=id,name,contact_no,email";

        ResponseEntity<List<Map<String, Object>>> profileResp = restTemplate.exchange(
                profileUrl,
                HttpMethod.GET,
                new HttpEntity<>(buildHeaders()),
                new ParameterizedTypeReference<>() {}
        );

        List<Map<String, Object>> profileRows = profileResp.getBody();
        if (profileRows == null || profileRows.isEmpty()) {
            throw new RuntimeException("Driver not found: " + driverId);
        }
        Map<String, Object> profile = profileRows.get(0);

        // 2. Get license number from driver_table
        String detailsUrl = supabaseUrl + "/rest/v1/driver_table"
                + "?driver_id=eq." + driverId
                + "&select=license_no";

        ResponseEntity<List<Map<String, Object>>> detailsResp = restTemplate.exchange(
                detailsUrl,
                HttpMethod.GET,
                new HttpEntity<>(buildHeaders()),
                new ParameterizedTypeReference<>() {}
        );

        List<Map<String, Object>> detailsRows = detailsResp.getBody();
        String licenseNo = (detailsRows != null && !detailsRows.isEmpty())
                ? (String) detailsRows.get(0).get("license_no") : "N/A";

        // 3. Get assigned bus info from buses table
        String busUrl = supabaseUrl + "/rest/v1/buses"
                + "?assigned_driver_id=eq." + driverId
                + "&select=id,plate_no,route_id,status";

        ResponseEntity<List<Map<String, Object>>> busResp = restTemplate.exchange(
                busUrl,
                HttpMethod.GET,
                new HttpEntity<>(buildHeaders()),
                new ParameterizedTypeReference<>() {}
        );

        List<Map<String, Object>> busRows = busResp.getBody();
        String busNo = "N/A";
        String routeId = null;

        if (busRows != null && !busRows.isEmpty()) {
            Map<String, Object> bus = busRows.get(0);
            busNo = (String) bus.get("plate_no");
            routeId = (String) bus.get("route_id");
        }

        // 4. Get route info
        String routeName = "N/A";
        if (routeId != null) {
            String routeUrl = supabaseUrl + "/rest/v1/routes"
                    + "?id=eq." + routeId
                    + "&select=name,start_location,end_location";

            ResponseEntity<List<Map<String, Object>>> routeResp = restTemplate.exchange(
                    routeUrl,
                    HttpMethod.GET,
                    new HttpEntity<>(buildHeaders()),
                    new ParameterizedTypeReference<>() {}
            );

            List<Map<String, Object>> routeRows = routeResp.getBody();
            if (routeRows != null && !routeRows.isEmpty()) {
                Map<String, Object> route = routeRows.get(0);
                routeName = route.get("start_location") + " → " + route.get("end_location");
            }
        }

        // 5. Get active shift schedule
        String shiftUrl = supabaseUrl + "/rest/v1/driver_shifts"
                + "?driver_id=eq." + driverId
                + "&order=shift_start.desc&limit=1"
                + "&select=shift_start,shift_end";

        ResponseEntity<List<Map<String, Object>>> shiftResp = restTemplate.exchange(
                shiftUrl,
                HttpMethod.GET,
                new HttpEntity<>(buildHeaders()),
                new ParameterizedTypeReference<>() {}
        );

        List<Map<String, Object>> shiftRows = shiftResp.getBody();
        String schedule = "No schedule";
        if (shiftRows != null && !shiftRows.isEmpty()) {
            Map<String, Object> shift = shiftRows.get(0);
            schedule = "Start: " + shift.get("shift_start") + " | End: " + shift.get("shift_end");
        }

        // 6. Get total completed trips (arrival_at in the past) for this driver
        int totalTrips = countCompletedTrips(driverId);

        // Build response
        DriverProfileResponse dto = new DriverProfileResponse();
        dto.setName((String) profile.get("name"));
        dto.setId(driverId);
        dto.setPhone((String) profile.get("contact_no"));
        dto.setEmail((String) profile.get("email"));
        dto.setLicenseNumber(licenseNo);
        dto.setBusNo(busNo);
        dto.setBusTurn(routeName);
        dto.setSchedule(schedule);
        dto.setTotalTrips(totalTrips);
        return dto;
    }

    // ----------------------------------------------------------------
    // Counts trips for a driver whose arrival_at has already passed,
    // used as a proxy for "completed trips" since the trips table has
    // no explicit status column.
    // ----------------------------------------------------------------
    private int countCompletedTrips(String driverId) {
        String nowIso = Instant.now().toString();

        String countUrl = supabaseUrl + "/rest/v1/trips"
                + "?driver_id=eq." + driverId
                + "&arrival_at=lt." + nowIso
                + "&select=id"
                + "&limit=1";

        HttpHeaders headers = buildHeaders();
        headers.set("Prefer", "count=exact");

        ResponseEntity<List<Map<String, Object>>> resp = restTemplate.exchange(
                countUrl,
                HttpMethod.GET,
                new HttpEntity<>(headers),
                new ParameterizedTypeReference<>() {}
        );

        // PostgREST returns the exact count in the Content-Range response header,
        // e.g. "Content-Range: 0-9/42" — the total is the value after the slash.
        String contentRange = resp.getHeaders().getFirst("Content-Range");
        if (contentRange != null && contentRange.contains("/")) {
            String totalPart = contentRange.substring(contentRange.indexOf('/') + 1);
            if (!totalPart.equals("*")) {
                try {
                    return Integer.parseInt(totalPart);
                } catch (NumberFormatException ignored) {
                    // fall through to body-based fallback
                }
            }
        }

        // Fallback: count rows returned in the body if the header wasn't usable
        List<Map<String, Object>> rows = resp.getBody();
        return rows != null ? rows.size() : 0;
    }

    // ----------------------------------------------------------------
    // GET /driver/{id}/passengers  →  active passenger manifest
    // Gets passengers booked on the driver's current active trip
    // ----------------------------------------------------------------
    public List<PassengerManifestResponse> getPassengers(String driverId) {

        // 1. Find the active trip assigned to this driver
        String tripUrl = supabaseUrl + "/rest/v1/trips"
                + "?driver_id=eq." + driverId
                + "&select=id"
                + "&order=departure_at.desc&limit=1";

        ResponseEntity<List<Map<String, Object>>> tripResp = restTemplate.exchange(
                tripUrl,
                HttpMethod.GET,
                new HttpEntity<>(buildHeaders()),
                new ParameterizedTypeReference<>() {}
        );

        List<Map<String, Object>> tripRows = tripResp.getBody();
        if (tripRows == null || tripRows.isEmpty()) {
            return List.of();
        }
        String tripId = (String) tripRows.get(0).get("id");

        // 2. Get confirmed bookings for this trip
        String bookingUrl = supabaseUrl + "/rest/v1/bookings"
                + "?trip_id=eq." + tripId
                + "&status=eq.confirmed"
                + "&select=id,passenger_id,seat_no,start_location,end_location,profiles(name)";

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
            p.setId((String) b.get("passenger_id"));

            @SuppressWarnings("unchecked")
            Map<String, Object> profile = (Map<String, Object>) b.get("profiles");
            p.setName(profile != null ? (String) profile.get("name") : "Unknown");

            Object seatNo = b.get("seat_no");
            p.setSeatSelection(seatNo != null ? String.valueOf(seatNo) : "N/A");
            p.setStop((String) b.get("start_location"));
            p.setBoarded(false);
            return p;
        }).toList();
    }

    // ----------------------------------------------------------------
    // POST /driver/{id}/shift/start  →  create a new shift record
    // ----------------------------------------------------------------
    public ShiftResponse startShift(String driverId) {
        String now = Instant.now().toString();

        // Insert a new shift with start time
        // shift_end is required by schema so we set a placeholder 8 hours ahead
        String shiftEnd = Instant.now().plusSeconds(8 * 3600).toString();

        String insertUrl = supabaseUrl + "/rest/v1/driver_shifts";
        Map<String, Object> body = Map.of(
                "driver_id", driverId,
                "shift_start", now,
                "shift_end", shiftEnd
        );

        HttpHeaders headers = buildHeaders();
        headers.set("Prefer", "return=minimal");
        restTemplate.exchange(insertUrl, HttpMethod.POST, new HttpEntity<>(body, headers), Void.class);

        ShiftResponse resp = new ShiftResponse();
        resp.setDriverId(driverId);
        resp.setStatus("STARTED");
        resp.setTimestamp(now);
        return resp;
    }

    // ----------------------------------------------------------------
    // POST /driver/{id}/shift/end  →  update shift_end on latest shift
    // ----------------------------------------------------------------
    public ShiftResponse endShift(String driverId) {
        // Get the latest shift for this driver
        String getUrl = supabaseUrl + "/rest/v1/driver_shifts"
                + "?driver_id=eq." + driverId
                + "&order=shift_start.desc&limit=1"
                + "&select=id";

        ResponseEntity<List<Map<String, Object>>> resp = restTemplate.exchange(
                getUrl,
                HttpMethod.GET,
                new HttpEntity<>(buildHeaders()),
                new ParameterizedTypeReference<>() {}
        );

        List<Map<String, Object>> rows = resp.getBody();
        if (rows == null || rows.isEmpty()) {
            throw new RuntimeException("No active shift found for driver: " + driverId);
        }

        String shiftId = (String) rows.get(0).get("id");
        String now = Instant.now().toString();

        // Update shift_end to now
        String patchUrl = supabaseUrl + "/rest/v1/driver_shifts?id=eq." + shiftId;
        HttpHeaders headers = buildHeaders();
        headers.set("Prefer", "return=minimal");
        restTemplate.exchange(
                patchUrl,
                HttpMethod.PATCH,
                new HttpEntity<>(Map.of("shift_end", now), headers),
                Void.class
        );

        ShiftResponse shiftResp = new ShiftResponse();
        shiftResp.setDriverId(driverId);
        shiftResp.setStatus("ENDED");
        shiftResp.setTimestamp(now);
        return shiftResp;
    }

    // ----------------------------------------------------------------
    // Private helpers
    // ----------------------------------------------------------------
    private HttpHeaders buildHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("apikey", supabaseKey);
        headers.set("Authorization", "Bearer " + supabaseKey);
        return headers;
    }
}
