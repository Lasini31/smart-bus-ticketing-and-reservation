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

import com.STAR.busmanagement.owner.dto.AddBusRequest;
import com.STAR.busmanagement.owner.dto.AddDriverRequest;
import com.STAR.busmanagement.owner.dto.AssignDriverRequest;
import com.STAR.busmanagement.owner.dto.DriverResponse;
import com.STAR.busmanagement.owner.dto.MessageResponse;
import com.STAR.busmanagement.owner.dto.OwnerAnalyticsResponse;
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

    private final RestTemplate restTemplate = new RestTemplate();

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


        // get all drivers for an employer
    @Override
        public List<DriverResponse> getDrivers(String employerId) {

    String url =
            supabaseUrl +
            "/rest/v1/driver_table?employer_id=eq."
            + employerId;

    HttpEntity<Void> entity =
            new HttpEntity<>(getHeaders());

    ResponseEntity<Map[]> response =
            restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    Map[].class
            );

    List<DriverResponse> drivers =
            new java.util.ArrayList<>();

    if (response.getBody() != null) {

        for (Map row : response.getBody()) {

            DriverResponse driver =
                    DriverResponse.builder()
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
    public MessageResponse addBus(AddBusRequest request) {
        String url = supabaseUrl + "/rest/v1/buses";

        Map<String, Object> body = Map.of(
                "plate_no", request.getBusNo(),
                "route_id", request.getRouteId(),
                "bus_type_id", request.getBusTypeId(),
                "owner_id", request.getOwnerId(),
                "status", request.getStatus() != null ? request.getStatus() : "active"
        );

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

    String driverTableUrl =
            supabaseUrl + "/rest/v1/driver_table?on_conflict=driver_id";

    Map<String, Object> body = new java.util.HashMap<>();

    body.put("driver_id", driverId);
    body.put("employer_id", employerId);
    body.put("license_no", request.getLicenseNo());
    body.put("name", request.getName());
    body.put("contact_no", request.getContactNumber());
    body.put("email", request.getEmail());

    HttpHeaders headers = getHeaders();
    headers.set("Prefer", "return=representation");

    HttpEntity<Map<String, Object>> entity =
            new HttpEntity<>(body, headers);

    try {

        ResponseEntity<Map[]> response = restTemplate.exchange(
                driverTableUrl,
                HttpMethod.POST,
                entity,
                Map[].class
        );

        Map<String, Object> createdDriver = firstRow(
                response.getBody(),
                "Driver was not created"
        );

        return DriverResponse.builder()
                .driverId(createdDriver.get("driver_id").toString())
                .name(valueAsString(createdDriver.get("name")))
                .email(valueAsString(createdDriver.get("email")))
                .contactNumber(valueAsString(createdDriver.get("contact_no")))
                .licenseNo(valueAsString(createdDriver.get("license_no")))
                .busNo(null)
                .build();

    } catch (HttpStatusCodeException e) {

        log.error(
                "Driver creation failed. status={}, body={}",
                e.getStatusCode(),
                e.getResponseBodyAsString()
        );

        throw new RuntimeException(
                "Driver creation failed: " +
                        e.getResponseBodyAsString()
        );
    }
}

    // REMOVE DRIVER
    @Override
    public MessageResponse removeDriver(String driverId) {

        try {

            HttpEntity<Void> entity
                    = new HttpEntity<>(getHeaders());

            String driverDetailsUrl
                    = supabaseUrl + "/rest/v1/driver_table?driver_id=eq." + driverId;

            restTemplate.exchange(
                    driverDetailsUrl,
                    HttpMethod.DELETE,
                    entity,
                    Void.class
            );

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
        String url = supabaseUrl + "/rest/v1/drivers?driver_id=eq." + request.getDriverId();

        Map<String, Object> body = Map.of(
                "assigned_bus", busNo
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
            profileResponse = restTemplate.exchange(
                    profileUrl,
                    HttpMethod.GET,
                    entity,
                    Map[].class
            );
        } catch (HttpStatusCodeException e) {
            log.error("Supabase profile lookup failed. email={}, status={}, body={}", email, e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("profile lookup failed: " + e.getStatusCode() + " " + e.getResponseBodyAsString(), e);
        }

        Map<String, Object> profile = firstRow(
                profileResponse.getBody(),
                "Driver profile was not found for email: " + email
        );

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
