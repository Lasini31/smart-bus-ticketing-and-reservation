package com.STAR.busmanagement.owner.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import com.STAR.busmanagement.owner.dto.*;

@Primary
@Service
public class SupabaseOwnerService implements OwnerService {

    private static final Logger log = LoggerFactory.getLogger(SupabaseOwnerService.class);

    @Value("${env.VITE_SUPABASE_URL}")
    private String supabaseUrl;

    @Value("${env.VITE_SUPABASE_PUBLISHABLE_KEY}")
    private String serviceKey;

    @Value("${env.VITE_API_BASE}")
    private String apiKey;

    private final RestTemplate restTemplate;

    public SupabaseOwnerService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    private HttpHeaders getHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("apikey", serviceKey);
        headers.set("Authorization", "Bearer " + serviceKey);
        headers.set("Prefer", "return=representation");
        headers.set("Accept-Profile", "public");
        headers.set("Content-Profile", "public");
        return headers;
    }

    // GET ALL DRIVERS FOR AN EMPLOYER
    @Override
    public List<DriverResponse> getDrivers(String employerId) {
        String url = supabaseUrl + "/rest/v1/driver_table?employer_id=eq." + employerId;

        HttpEntity<Void> entity = new HttpEntity<>(getHeaders());
        ResponseEntity<Map[]> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map[].class);

        List<DriverResponse> drivers = new java.util.ArrayList<>();

        if (response.getBody() != null) {
            for (Map row : response.getBody()) {
                DriverResponse driver = DriverResponse.builder()
                        .driverId(valueAsString(row.get("driver_id")))
                        .name(valueAsString(row.get("name")))
                        .email(valueAsString(row.get("email")))
                        .contactNumber(valueAsString(row.get("contact_no")))
                        .licenseNo(valueAsString(row.get("license_no")))
                        .busNo(null)
                        .build();
                drivers.add(driver);
            }
        }

        return drivers;
    }

    // ADD BUS
    @Override
    public MessageResponse addBus(AddBusRequest request, String ownerId) {
        String url = supabaseUrl + "/rest/v1/buses";

        Map<String, Object> body = new java.util.HashMap<>();
        body.put("plate_no", request.getBusNo());
        body.put("route_id", request.getRouteId());
        body.put("bus_type_id", request.getBusTypeId());
        body.put("owner_id", ownerId);
        body.put("status", request.getStatus() != null ? request.getStatus() : "active");
        body.put("target_income", request.getTargetIncome());
        if (request.getAssignedDriverId() != null && !request.getAssignedDriverId().isBlank()) {
            body.put("assigned_driver_id", request.getAssignedDriverId());
        }

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, getHeaders());
        restTemplate.exchange(url, HttpMethod.POST, entity, Object.class);

        return MessageResponse.builder()
                .success(true)
                .message("Bus " + request.getBusNo() + " added successfully.")
                .build();
    }

    // REMOVE BUS
    @Override
    public MessageResponse removeBus(String busNo) {
        String url = supabaseUrl + "/rest/v1/buses?plate_no=eq." + busNo;

        HttpEntity<Void> entity = new HttpEntity<>(getHeaders());
        restTemplate.exchange(url, HttpMethod.DELETE, entity, Void.class);

        return MessageResponse.builder()
                .success(true)
                .message("Bus " + busNo + " removed successfully.")
                .build();
    }

    // ADD DRIVER
    @Override
    public DriverResponse addDriver(AddDriverRequest request, String employerId) {
        requireField(employerId, "employerId is required");
        requireField(request.getEmail(), "email is required");

        String driverId = java.util.UUID.randomUUID().toString();
        String driverTableUrl = supabaseUrl + "/rest/v1/driver_table?on_conflict=driver_id";

        Map<String, Object> body = new java.util.HashMap<>();
        body.put("driver_id", driverId);
        body.put("employer_id", employerId);
        body.put("license_no", request.getLicenseNo());
        body.put("name", request.getName());
        body.put("contact_no", request.getContactNumber());
        body.put("email", request.getEmail());

        HttpHeaders headers = getHeaders();
        headers.set("Prefer", "return=representation");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map[]> response = restTemplate.exchange(
                    driverTableUrl, HttpMethod.POST, entity, Map[].class);

            Map<String, Object> createdDriver = firstRow(response.getBody(), "Driver was not created");

            return DriverResponse.builder()
                    .driverId(createdDriver.get("driver_id").toString())
                    .name(valueAsString(createdDriver.get("name")))
                    .email(valueAsString(createdDriver.get("email")))
                    .contactNumber(valueAsString(createdDriver.get("contact_no")))
                    .licenseNo(valueAsString(createdDriver.get("license_no")))
                    .busNo(null)
                    .build();

        } catch (HttpStatusCodeException e) {
            log.error("Driver creation failed. status={}, body={}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Driver creation failed: " + e.getResponseBodyAsString());
        }
    }

    // REMOVE DRIVER
    @Override
    public MessageResponse removeDriver(String driverId) {
        try {
            HttpEntity<Void> entity = new HttpEntity<>(getHeaders());
            String driverDetailsUrl = supabaseUrl + "/rest/v1/driver_table?driver_id=eq." + driverId;
            restTemplate.exchange(driverDetailsUrl, HttpMethod.DELETE, entity, Void.class);

            return MessageResponse.builder()
                    .success(true)
                    .message("Driver removed successfully.")
                    .build();

        } catch (Exception e) {
            return MessageResponse.builder()
                    .success(false)
                    .message("Failed to remove driver: " + e.getMessage())
                    .build();
        }
    }

    // ASSIGN DRIVER TO BUS
    @Override
    public MessageResponse assignDriver(String busNo, AssignDriverRequest request) {
        String url = supabaseUrl + "/rest/v1/buses?plate_no=eq." + busNo;

        Map<String, Object> body = Map.of(
                "assigned_driver_id", request.getDriverId()
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, getHeaders());
        restTemplate.exchange(url, HttpMethod.PATCH, entity, Object.class);

        return MessageResponse.builder()
                .success(true)
                .message("Driver " + request.getDriverId() + " assigned to Bus " + busNo + " successfully.")
                .build();
    }

    // GET ANALYTICS
    @Override
    public OwnerAnalyticsResponse getAnalytics() {
        String busUrl = supabaseUrl + "/rest/v1/buses?select=count";
        String driverUrl = supabaseUrl + "/rest/v1/driver_table?select=count";

        HttpEntity<Void> entity = new HttpEntity<>(getHeaders());

        ResponseEntity<Object[]> busResponse = restTemplate.exchange(busUrl, HttpMethod.GET, entity, Object[].class);
        ResponseEntity<Object[]> driverResponse = restTemplate.exchange(driverUrl, HttpMethod.GET, entity, Object[].class);

        int totalBuses = busResponse.getBody() != null ? busResponse.getBody().length : 0;
        int totalDrivers = driverResponse.getBody() != null ? driverResponse.getBody().length : 0;

        return OwnerAnalyticsResponse.builder()
                .totalBuses(totalBuses)
                .totalDrivers(totalDrivers)
                .totalPassengers(1842)
                .tripsToday(94)
                .revenueToday(47500.00)
                .generatedAt(java.time.ZonedDateTime.now(java.time.ZoneOffset.UTC)
                        .format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'")))
                .build();
    }

    // GET BUSES BY OWNER
    @Override
    public List<BusListResponse> getBusesByOwner(String ownerId) {
        String url = supabaseUrl + "/rest/v1/buses?owner_id=eq." + ownerId + "&select=*";

        HttpEntity<Void> entity = new HttpEntity<>(getHeaders());
        ResponseEntity<Map[]> busResponse = restTemplate.exchange(url, HttpMethod.GET, entity, Map[].class);

        List<BusListResponse> result = new java.util.ArrayList<>();
        if (busResponse.getBody() == null) return result;

        for (Map row : busResponse.getBody()) {
            String busId = valueAsString(row.get("id"));
            String plateNo = valueAsString(row.get("plate_no"));
            String busTypeId = valueAsString(row.get("bus_type_id"));
            String routeId = valueAsString(row.get("route_id"));
            String assignedDriverId = valueAsString(row.get("assigned_driver_id"));
            Double targetIncome = row.get("target_income") != null ?
                    Double.parseDouble(row.get("target_income").toString()) : null;

            // Get route name
            String routeNo = null;
            if (routeId != null) {
                String routeUrl = supabaseUrl + "/rest/v1/routes?id=eq." + routeId + "&select=name";
                ResponseEntity<Map[]> routeResponse = restTemplate.exchange(routeUrl, HttpMethod.GET, entity, Map[].class);
                if (routeResponse.getBody() != null && routeResponse.getBody().length > 0) {
                    routeNo = valueAsString(routeResponse.getBody()[0].get("name"));
                }
            }

            // Get bus type image
            String type = null;
            if (busTypeId != null) {
                String busTypeUrl = supabaseUrl + "/rest/v1/bus_types?id=eq." + busTypeId + "&select=seat_image_url";
                ResponseEntity<Map[]> busTypeResponse = restTemplate.exchange(busTypeUrl, HttpMethod.GET, entity, Map[].class);
                if (busTypeResponse.getBody() != null && busTypeResponse.getBody().length > 0) {
                    type = valueAsString(busTypeResponse.getBody()[0].get("seat_image_url"));
                }
            }

            // Get driver name
            String assignedDriverName = null;
            if (assignedDriverId != null) {
                String driverUrl = supabaseUrl + "/rest/v1/driver_table?driver_id=eq." + assignedDriverId + "&select=name";
                ResponseEntity<Map[]> driverResponse = restTemplate.exchange(driverUrl, HttpMethod.GET, entity, Map[].class);
                if (driverResponse.getBody() != null && driverResponse.getBody().length > 0) {
                    assignedDriverName = valueAsString(driverResponse.getBody()[0].get("name"));
                }
            }

            // Get analytics percentage
            Double percentage = null;
            if (busId != null) {
                String analyticsUrl = supabaseUrl + "/rest/v1/bus_income_analytics?bus_id=eq." + busId + "&select=target_percentage";
                ResponseEntity<Map[]> analyticsResponse = restTemplate.exchange(analyticsUrl, HttpMethod.GET, entity, Map[].class);
                if (analyticsResponse.getBody() != null && analyticsResponse.getBody().length > 0) {
                    Object pct = analyticsResponse.getBody()[0].get("target_percentage");
                    if (pct != null) percentage = Double.parseDouble(pct.toString());
                }
            }

            result.add(BusListResponse.builder()
                    .busNo(plateNo)
                    .routeNo(routeNo)
                    .assignedDriver(assignedDriverName)
                    .assignedDriverId(assignedDriverId)
                    .type(type)
                    .targetIncome(targetIncome)
                    .percentage(percentage)
                    .build());
        }

        return result;
    }

    // GET DRIVERS BY OWNER WITH HOURS
    @Override
    public List<DriverListResponse> getDriversByOwner(String ownerId) {
        String url = supabaseUrl + "/rest/v1/driver_table?employer_id=eq." + ownerId + "&select=*";

        HttpEntity<Void> entity = new HttpEntity<>(getHeaders());
        ResponseEntity<Map[]> driverResponse = restTemplate.exchange(url, HttpMethod.GET, entity, Map[].class);

        List<DriverListResponse> result = new java.util.ArrayList<>();
        if (driverResponse.getBody() == null) return result;

        for (Map row : driverResponse.getBody()) {
            String driverId = valueAsString(row.get("driver_id"));

            // Get assigned bus plate number
            String assignedBusNo = null;
            String busUrl = supabaseUrl + "/rest/v1/buses?assigned_driver_id=eq." + driverId + "&select=plate_no";
            ResponseEntity<Map[]> busResponse = restTemplate.exchange(busUrl, HttpMethod.GET, entity, Map[].class);
            if (busResponse.getBody() != null && busResponse.getBody().length > 0) {
                assignedBusNo = valueAsString(busResponse.getBody()[0].get("plate_no"));
            }

            // Get total driving hours from completed shifts only
            String shiftsUrl = supabaseUrl + "/rest/v1/driver_shifts?driver_id=eq." + driverId + "&shift_end=not.is.null&select=shift_start,shift_end";
            ResponseEntity<Map[]> shiftsResponse = restTemplate.exchange(shiftsUrl, HttpMethod.GET, entity, Map[].class);

            double totalHours = 0;
            if (shiftsResponse.getBody() != null) {
                for (Map shift : shiftsResponse.getBody()) {
                    String start = valueAsString(shift.get("shift_start"));
                    String end = valueAsString(shift.get("shift_end"));
                    if (start != null && end != null) {
                        java.time.OffsetDateTime startTime = java.time.OffsetDateTime.parse(start);
                        java.time.OffsetDateTime endTime = java.time.OffsetDateTime.parse(end);
                        totalHours += java.time.Duration.between(startTime, endTime).toMinutes() / 60.0;
                    }
                }
            }

            result.add(DriverListResponse.builder()
                    .name(valueAsString(row.get("name")))
                    .contactNo(valueAsString(row.get("contact_no")))
                    .email(valueAsString(row.get("email")))
                    .driverId(driverId)
                    .licenceNo(valueAsString(row.get("license_no")))
                    .assignedBusNo(assignedBusNo)
                    .totalDrivingHours(String.format("%.1fhr", totalHours))
                    .build());
        }

        return result;
    }

    // GET ROUTES FOR DROPDOWN
    @Override
    public List<RouteResponse> getRoutes() {
        String url = supabaseUrl + "/rest/v1/routes?select=id,name";

        HttpEntity<Void> entity = new HttpEntity<>(getHeaders());
        ResponseEntity<Map[]> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map[].class);

        List<RouteResponse> result = new java.util.ArrayList<>();
        if (response.getBody() == null) return result;

        for (Map row : response.getBody()) {
            result.add(RouteResponse.builder()
                    .id(valueAsString(row.get("id")))
                    .name(valueAsString(row.get("name")))
                    .build());
        }

        return result;
    }

    // GET BUS TYPES FOR DROPDOWN
    @Override
    public List<BusTypeResponse> getBusTypes() {
        String url = supabaseUrl + "/rest/v1/bus_types?select=id,name,seat_image_url";

        HttpEntity<Void> entity = new HttpEntity<>(getHeaders());
        ResponseEntity<Map[]> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map[].class);

        List<BusTypeResponse> result = new java.util.ArrayList<>();
        if (response.getBody() == null) return result;

        for (Map row : response.getBody()) {
            result.add(BusTypeResponse.builder()
                    .id(valueAsString(row.get("id")))
                    .name(valueAsString(row.get("name")))
                    .seat_image_url(valueAsString(row.get("seat_image_url")))
                    .build());
        }

        return result;
    }

    private void requireField(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(message);
        }
    }

    private String findProfileIdByEmail(String email) {
        String encodedEmail = URLEncoder.encode(email, StandardCharsets.UTF_8);
        String profileUrl = supabaseUrl + "/rest/v1/profiles?email=eq." + encodedEmail + "&select=id";

        HttpEntity<Void> entity = new HttpEntity<>(getHeaders());
        ResponseEntity<Map[]> profileResponse;
        try {
            profileResponse = restTemplate.exchange(profileUrl, HttpMethod.GET, entity, Map[].class);
        } catch (HttpStatusCodeException e) {
            log.error("Supabase profile lookup failed. email={}, status={}, body={}", email, e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("profile lookup failed: " + e.getStatusCode() + " " + e.getResponseBodyAsString(), e);
        }

        Map<String, Object> profile = firstRow(profileResponse.getBody(), "Driver profile was not found for email: " + email);

        Object profileId = profile.get("id");
        if (profileId == null) {
            throw new RuntimeException("Driver profile id was not returned from Supabase");
        }

        return profileId.toString();
    }

    private Map<String, Object> firstRow(Map[] rows, String message) {
        if (rows == null || rows.length == 0) {
            throw new RuntimeException(message);
        }
        return rows[0];
    }

    private String valueAsString(Object value) {
        return value != null ? value.toString() : null;
    }
}