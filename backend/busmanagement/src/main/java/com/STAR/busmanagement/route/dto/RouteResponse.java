package com.STAR.busmanagement.route.dto;

import lombok.*;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteResponse {
    private UUID id;
    private String name;
    private String startLocation;
    private String endLocation;
    private String stops;
    private Boolean status;
}