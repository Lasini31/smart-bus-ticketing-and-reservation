package com.STAR.busmanagement.bus.service;

import com.STAR.busmanagement.bus.dto.BusResponse;
import com.STAR.busmanagement.bus.model.Bus;
import com.STAR.busmanagement.bus.repository.BusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BusService {

    private final BusRepository busRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.api-key}")
    private String supabaseKey;

    public List<BusResponse> getAllBuses() {
        return busRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public BusResponse getBusByNo(String busNo) {
        return busRepository.findByPlateNo(busNo)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Bus not found"));
    }

    private BusResponse mapToResponse(Bus bus) {
        BusResponse.BusResponseBuilder builder = BusResponse.builder()
                .busNo(bus.getPlateNo())
                .routeId(bus.getRouteId() != null ? bus.getRouteId().toString() : null)
                .seatTemplate("luxury") // Default fallback as these aren't in the DB schema
                .schedule("08:00 AM")   // Default fallback
                .driverId(bus.getAssignedDriverId() != null ? bus.getAssignedDriverId().toString() : null);

        // If there's an assigned driver id, try to fetch public driver info (name, contact)
        if (bus.getAssignedDriverId() != null) {
                try {
                String driverId = bus.getAssignedDriverId().toString();
                String drvUrl = supabaseUrl + "/rest/v1/drivers?driver_id=eq." + driverId + "&select=driver_id,user_id,assigned_bus";

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.set("apikey", supabaseKey);
                headers.set("Authorization", "Bearer " + supabaseKey);
                headers.set("Accept-Profile", "public");
                headers.set("Content-Profile", "public");

                ResponseEntity<List<Map<String, Object>>> drvResp = restTemplate.exchange(
                        drvUrl,
                        HttpMethod.GET,
                        new HttpEntity<>(null, headers),
                        new ParameterizedTypeReference<List<Map<String, Object>>>() {}
                );
                List<Map<String, Object>> drvRows = drvResp.getBody();
                if (drvRows != null && !drvRows.isEmpty()) {
                    Map<String, Object> drvRow = drvRows.get(0);
                    Object userIdObj = drvRow.get("user_id");
                    if (userIdObj != null) {
                        String userId = userIdObj.toString();
                        String userUrl = supabaseUrl + "/rest/v1/users?user_id=eq." + userId + "&select=name,contact_no";
                        ResponseEntity<List<Map<String, Object>>> userResp = restTemplate.exchange(
                                userUrl,
                                HttpMethod.GET,
                                new HttpEntity<>(null, headers),
                                new ParameterizedTypeReference<List<Map<String, Object>>>() {}
                        );
                        List<Map<String, Object>> userRows = userResp.getBody();
                        if (userRows != null && !userRows.isEmpty()) {
                            Map<String, Object> user = userRows.get(0);
                            builder.driverName(user.get("name") != null ? user.get("name").toString() : null);
                            builder.driverPhone(user.get("contact_no") != null ? user.get("contact_no").toString() : null);
                        }
                    }
                }
            } catch (Exception ignored) {
                // Fail silently; we still return basic bus info with driverId only
            }
        }

        return builder.build();
    }
}
