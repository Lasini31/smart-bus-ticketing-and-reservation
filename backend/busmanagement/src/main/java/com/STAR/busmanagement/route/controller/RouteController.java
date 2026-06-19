package com.STAR.busmanagement.route.controller;

import com.STAR.busmanagement.route.dto.CreateRouteRequest;
import com.STAR.busmanagement.route.dto.RouteResponse;
import com.STAR.busmanagement.route.model.Route;
import com.STAR.busmanagement.route.service.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/routes")
public class RouteController {

    @Autowired
    private RouteService routeService;

    @PostMapping
    public ResponseEntity<RouteResponse> createRoute(@RequestBody CreateRouteRequest request) {
        Route route = routeService.createRoute(request);
        return ResponseEntity.ok(mapToResponse(route));
    }

    @GetMapping
    public ResponseEntity<List<RouteResponse>> getAllRoutes() {
        List<RouteResponse> responses = routeService.getAllRoutes().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RouteResponse> getRouteById(@PathVariable UUID id) {
        Route route = routeService.getRouteById(id);
        return ResponseEntity.ok(mapToResponse(route));
    }

    private RouteResponse mapToResponse(Route route) {
        return RouteResponse.builder()
                .routeId(route.getId() != null ? route.getId().toString() : null)
                .name(route.getName())
                .startLocation(route.getStartLocation())
                .endLocation(route.getEndLocation())
                .stops(route.getStops())
                .status(route.getStatus())
                .build();
    }
}