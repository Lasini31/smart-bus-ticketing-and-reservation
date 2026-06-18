package com.STAR.busmanagement.driver.controller;

import com.STAR.busmanagement.driver.dto.DriverProfileResponse;
import com.STAR.busmanagement.driver.dto.PassengerManifestResponse;
import com.STAR.busmanagement.driver.dto.ShiftResponse;
import com.STAR.busmanagement.driver.service.DriverService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/driver")
public class DriverController {

    private final DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    // GET /driver/{id}
    // Returns driver profile + assigned bus info
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('driver', 'owner', 'admin')")
    public ResponseEntity<DriverProfileResponse> getDriverProfile(@PathVariable String id) {
        return ResponseEntity.ok(driverService.getDriverProfile(id));
    }

    // GET /driver/{id}/passengers
    // Returns the passenger manifest for the driver's active bus
    @GetMapping("/{id}/passengers")
    @PreAuthorize("hasAuthority('driver')")
    public ResponseEntity<List<PassengerManifestResponse>> getPassengers(@PathVariable String id) {
        return ResponseEntity.ok(driverService.getPassengers(id));
    }

    // POST /driver/{id}/shift/start
    @PostMapping("/{id}/shift/start")
    @PreAuthorize("hasAuthority('driver')")
    public ResponseEntity<ShiftResponse> startShift(@PathVariable String id) {
        return ResponseEntity.ok(driverService.startShift(id));
    }

    // POST /driver/{id}/shift/end
    @PostMapping("/{id}/shift/end")
    @PreAuthorize("hasAuthority('driver')")
    public ResponseEntity<ShiftResponse> endShift(@PathVariable String id) {
        return ResponseEntity.ok(driverService.endShift(id));
    }
}
