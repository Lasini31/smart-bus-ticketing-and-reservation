package com.STAR.busmanagement.bus.controller;

import com.STAR.busmanagement.bus.dto.BusResponse;
import com.STAR.busmanagement.bus.service.BusService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/buses")
@RequiredArgsConstructor
public class BusController {

    private final BusService busService;

    // GET /buses  — List all buses (Passenger / Owner)
    @GetMapping
    public ResponseEntity<List<BusResponse>> getAllBuses() {
        return ResponseEntity.ok(busService.getAllBuses());
    }

    // GET /buses/{busNo}  — Get bus details (All)
    @GetMapping("/{busNo}")
    public ResponseEntity<BusResponse> getBus(@PathVariable String busNo) {
        try {
            BusResponse resp = busService.getBusByNo(busNo);
            return ResponseEntity.ok(resp);
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}
