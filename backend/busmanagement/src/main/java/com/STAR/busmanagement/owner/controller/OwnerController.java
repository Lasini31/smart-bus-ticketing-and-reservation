package com.STAR.busmanagement.owner.controller;

import com.STAR.busmanagement.owner.dto.*;
import com.STAR.busmanagement.owner.service.OwnerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/owner")
public class OwnerController {

    private final OwnerService ownerService;

    public OwnerController(OwnerService ownerService) {
        this.ownerService = ownerService;
    }

    // POST /owner/buses — Add a new bus
    @PostMapping("/buses")
    public ResponseEntity<MessageResponse> addBus(@RequestBody AddBusRequest request) {
        try {
            MessageResponse response = ownerService.addBus(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(MessageResponse.builder().message(e.getMessage()).build());
        }
    }

    // DELETE /owner/buses/{busNo} — Remove a bus
    @DeleteMapping("/buses/{busNo}")
    public ResponseEntity<MessageResponse> removeBus(@PathVariable String busNo) {
        try {
            MessageResponse response = ownerService.removeBus(busNo);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(MessageResponse.builder().message(e.getMessage()).build());
        }
    }

    // POST /owner/drivers — Add a new driver
    @PostMapping("/drivers")
    public ResponseEntity<DriverResponse> addDriver(@RequestBody AddDriverRequest request) {
        DriverResponse response = ownerService.addDriver(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // DELETE /owner/drivers/{id} — Remove a driver
    @DeleteMapping("/drivers/{id}")
    public ResponseEntity<MessageResponse> removeDriver(@PathVariable String id) {
        try {
            MessageResponse response = ownerService.removeDriver(id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(MessageResponse.builder().message(e.getMessage()).build());
        }
    }

    // PUT /owner/buses/{busNo}/driver — Assign driver to bus
    @PutMapping("/buses/{busNo}/driver")
    public ResponseEntity<MessageResponse> assignDriver(
            @PathVariable String busNo,
            @RequestBody AssignDriverRequest request) {
        try {
            MessageResponse response = ownerService.assignDriver(busNo, request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(MessageResponse.builder().message(e.getMessage()).build());
        }
    }

    // GET /owner/analytics — View analytics report
    @GetMapping("/analytics")
    public ResponseEntity<OwnerAnalyticsResponse> getAnalytics() {
        OwnerAnalyticsResponse response = ownerService.getAnalytics();
        return ResponseEntity.ok(response);
    }
}