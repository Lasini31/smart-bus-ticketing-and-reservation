package com.STAR.busmanagement.owner.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
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
    public DriverResponse addDriver(AddDriverRequest request) {

        // STEP 1 - Insert into profiles table
        String profileUrl = supabaseUrl + "/rest/v1/profiles";

        Map<String, Object> profileBody = Map.of(
                "role", "driver",
                "name", request.getName(),
                "contact_no", request.getContactNumber(),
                "email", request.getEmail(),
                "status", "active"
        );

        HttpEntity<Map<String, Object>> profileEntity
                = new HttpEntity<>(profileBody, getHeaders());

        ResponseEntity<Map[]> profileResponse
                = restTemplate.exchange(
                        profileUrl,
                        HttpMethod.POST,
                        profileEntity,
                        Map[].class
                );

        Map[] profileData = profileResponse.getBody();

        if (profileData == null || profileData.length == 0) {
            throw new RuntimeException("Failed to create driver profile");
        }

        String driverId = profileData[0].get("id").toString();

        // STEP 2 - Insert into driver_details table
        String driverDetailsUrl = supabaseUrl + "/rest/v1/driver_details";

        // TODO: Replace with actual logged-in owner's UUID
        String employerId = "OWNER_UUID_HERE";

        Map<String, Object> driverDetailsBody = Map.of(
                "driver_id", driverId,
                "employer_id", employerId,
                "license_no", request.getLicenseNo()
        );

        HttpEntity<Map<String, Object>> driverDetailsEntity
                = new HttpEntity<>(driverDetailsBody, getHeaders());

        restTemplate.exchange(
                driverDetailsUrl,
                HttpMethod.POST,
                driverDetailsEntity,
                Object.class
        );

        // STEP 3 - Return response
        return DriverResponse.builder()
                .name(request.getName())
                .email(request.getEmail())
                .contactNumber(request.getContactNumber())
                .licenseNo(request.getLicenseNo())
                .busNo(null)
                .build();
    }

    // REMOVE DRIVER
    @Override
    public MessageResponse removeDriver(String driverId) {

        try {

            HttpEntity<Void> entity
                    = new HttpEntity<>(getHeaders());

            String driverDetailsUrl
                    = supabaseUrl + "/rest/v1/driver_details?driver_id=eq." + driverId;

            restTemplate.exchange(
                    driverDetailsUrl,
                    HttpMethod.DELETE,
                    entity,
                    Void.class
            );

            String profileUrl
                    = supabaseUrl + "/rest/v1/profiles?id=eq." + driverId;

            restTemplate.exchange(
                    profileUrl,
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
        String driverUrl = supabaseUrl + "/rest/v1/drivers?select=count";

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
}
