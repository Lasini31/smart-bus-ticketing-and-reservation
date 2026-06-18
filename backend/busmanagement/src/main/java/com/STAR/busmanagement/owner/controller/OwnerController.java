package com.STAR.busmanagement.owner.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.STAR.busmanagement.owner.dto.AddBusRequest;
import com.STAR.busmanagement.owner.dto.AddDriverRequest;
import com.STAR.busmanagement.owner.dto.AssignDriverRequest;
import com.STAR.busmanagement.owner.dto.DriverResponse;
import com.STAR.busmanagement.owner.dto.MessageResponse;
import com.STAR.busmanagement.owner.dto.OwnerAnalyticsResponse;
import com.STAR.busmanagement.owner.service.OwnerService;

@RestController
@RequestMapping("/owner")
public class OwnerController {

    private final OwnerService ownerService;

    public OwnerController(OwnerService ownerService) {
        this.ownerService = ownerService;
    }


    //  get owners data
    @GetMapping("/drivers")
    public ResponseEntity<?> getDrivers(Authentication authentication) {

    try {

        if (authentication == null ||
            authentication.getName() == null ||
            authentication.getName().isBlank()) {

            throw new IllegalArgumentException("Owner session is required");
        }

        return ResponseEntity.ok(
                ownerService.getDrivers(authentication.getName())
        );

    } catch (Exception e) {

        return ResponseEntity.badRequest().body(
                MessageResponse.builder()
                        .success(false)
                        .message(e.getMessage())
                        .build()
        );
    }
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
    public ResponseEntity<?> addDriver(@RequestBody AddDriverRequest request, Authentication authentication) {
        try {
            if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
                throw new IllegalArgumentException("Owner session is required");
            }

            DriverResponse response = ownerService.addDriver(request, authentication.getName());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(MessageResponse.builder().success(false).message(e.getMessage()).build());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(MessageResponse.builder().success(false).message(e.getMessage()).build());
        }
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
