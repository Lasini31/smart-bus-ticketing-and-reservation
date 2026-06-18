package com.STAR.busmanagement.route.service;

import com.STAR.busmanagement.route.dto.CreateRouteRequest;
import com.STAR.busmanagement.route.model.Route;
import com.STAR.busmanagement.route.repository.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.UUID;
import java.util.List;

@Service
public class RouteService {

    @Autowired
    private RouteRepository routeRepository;

    public Route createRoute(CreateRouteRequest request) {
        Route route = Route.builder()
                .name(request.getName())
                .startLocation(request.getStartLocation())
                .endLocation(request.getEndLocation())
                .stops(request.getStops())
                .status(request.getStatus() != null ? request.getStatus() : true)
                .build();
        return routeRepository.save(route);
    }

    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    public Route getRouteById(UUID id) {
        return routeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Route not found with id: " + id));
    }
}