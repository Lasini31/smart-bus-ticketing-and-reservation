package com.STAR.busmanagement.route.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteResponse {
    private String routeId;   // API contract: GET /routes/{id} returns routeId
    private String name;
    private String startLocation;
    private String endLocation;
    private String stops;
    private Boolean status;
}