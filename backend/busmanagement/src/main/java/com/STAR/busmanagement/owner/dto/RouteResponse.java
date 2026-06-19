package com.STAR.busmanagement.owner.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class RouteResponse {
    private String id;
    private String name;
}