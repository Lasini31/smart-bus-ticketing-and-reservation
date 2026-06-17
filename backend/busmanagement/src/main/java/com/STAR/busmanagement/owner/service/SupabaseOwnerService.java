package com.STAR.busmanagement.owner.service;

import com.STAR.busmanagement.owner.dto.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.context.annotation.Primary;

import java.util.Map;

@Primary
@Service
public class SupabaseOwnerService implements OwnerService {

    @Value("${env.SUPABASE_URL}")
    private String supabaseUrl;

    @Value("${env.SUPABASE_API_KEY}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    private HttpHeaders getHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("apikey", apiKey);
        headers.set("Authorization", "Bearer " + apiKey);
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
        restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

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
        String url = supabaseUrl + "/rest/v1/drivers";

        Map<String, Object> body = Map.of(
                "license", request.getLicenseNo(),
                "status", "Active",
                "employed_by", 1
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, getHeaders());
        restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

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
        String url = supabaseUrl + "/rest/v1/drivers?driver_id=eq." + driverId;

        HttpEntity<Void> entity = new HttpEntity<>(getHeaders());
        restTemplate.exchange(url, HttpMethod.DELETE, entity, Void.class);

        return MessageResponse.builder()
                .success(true)
                .message("Driver " + driverId + " removed successfully.")
                .build();
    }

    // ASSIGN DRIVER TO BUS
    @Override
    public MessageResponse assignDriver(String busNo, AssignDriverRequest request) {
        String url = supabaseUrl + "/rest/v1/drivers?driver_id=eq." + request.getDriverId();

        Map<String, Object> body = Map.of(
                "assigned_bus", busNo
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, getHeaders());
        restTemplate.exchange(url, HttpMethod.PATCH, entity, Map.class);

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