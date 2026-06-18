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

import com.STAR.busmanagement.owner.dto.*;
import com.STAR.busmanagement.owner.service.OwnerService;

@RestController
@RequestMapping("/owner")
public class OwnerController {

    private final OwnerService ownerService;

    public OwnerController(OwnerService ownerService) {
        this.ownerService = ownerService;
    }

    private String getOwnerId(Authentication authentication) {
        if (authentication == null ||
            authentication.getName() == null ||
            authentication.getName().isBlank()) {
            throw new IllegalArgumentException("Owner session is required");
        }
        return authentication.getName();
    }

    // POST /owner/buses — Add a new bus
    @PostMapping("/buses")
    public ResponseEntity<?> addBus(@RequestBody AddBusRequest request, Authentication authentication) {
        try {
            String ownerId = getOwnerId(authentication);
            MessageResponse response = ownerService.addBus(request, ownerId);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(MessageResponse.builder().success(false).message(e.getMessage()).build());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(MessageResponse.builder().success(false).message(e.getMessage()).build());
        }
    }

    // DELETE /owner/buses/{busNo} — Remove a bus
    @DeleteMapping("/buses/{busNo}")
    public ResponseEntity<?> removeBus(@PathVariable String busNo, Authentication authentication) {
        try {
            getOwnerId(authentication);
            MessageResponse response = ownerService.removeBus(busNo);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(MessageResponse.builder().success(false).message(e.getMessage()).build());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(MessageResponse.builder().success(false).message(e.getMessage()).build());
        }
    }

    // POST /owner/drivers — Add a new driver
    @PostMapping("/drivers")
    public ResponseEntity<?> addDriver(@RequestBody AddDriverRequest request, Authentication authentication) {
        try {
            String ownerId = getOwnerId(authentication);
            DriverResponse response = ownerService.addDriver(request, ownerId);
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
    public ResponseEntity<?> removeDriver(@PathVariable String id, Authentication authentication) {
        try {
            getOwnerId(authentication);
            MessageResponse response = ownerService.removeDriver(id);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(MessageResponse.builder().success(false).message(e.getMessage()).build());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(MessageResponse.builder().success(false).message(e.getMessage()).build());
        }
    }

    // PUT /owner/buses/{busNo}/driver — Assign driver to bus
    @PutMapping("/buses/{busNo}/driver")
    public ResponseEntity<?> assignDriver(
            @PathVariable String busNo,
            @RequestBody AssignDriverRequest request,
            Authentication authentication) {
        try {
            getOwnerId(authentication);
            MessageResponse response = ownerService.assignDriver(busNo, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(MessageResponse.builder().success(false).message(e.getMessage()).build());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(MessageResponse.builder().success(false).message(e.getMessage()).build());
        }
    }

    // GET /owner/analytics — View analytics report
    @GetMapping("/analytics")
    public ResponseEntity<?> getAnalytics(Authentication authentication) {
        try {
            getOwnerId(authentication);
            OwnerAnalyticsResponse response = ownerService.getAnalytics();
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(MessageResponse.builder().success(false).message(e.getMessage()).build());
        }
    }

    // GET /owner/buses — Get all buses for logged in owner
    @GetMapping("/buses")
    public ResponseEntity<?> getBusesByOwner(Authentication authentication) {
        try {
            String ownerId = getOwnerId(authentication);
            return ResponseEntity.ok(ownerService.getBusesByOwner(ownerId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(MessageResponse.builder().success(false).message(e.getMessage()).build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    MessageResponse.builder().success(false).message(e.getMessage()).build());
        }
    }

    // GET /owner/my-drivers — Get all drivers for logged in owner
    @GetMapping("/my-drivers")
    public ResponseEntity<?> getDriversByOwner(Authentication authentication) {
        try {
            String ownerId = getOwnerId(authentication);
            return ResponseEntity.ok(ownerService.getDriversByOwner(ownerId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(MessageResponse.builder().success(false).message(e.getMessage()).build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    MessageResponse.builder().success(false).message(e.getMessage()).build());
        }
    }

    // GET /owner/drivers — Get drivers list for logged in owner
    @GetMapping("/drivers")
    public ResponseEntity<?> getDrivers(Authentication authentication) {
        try {
            String ownerId = getOwnerId(authentication);
            return ResponseEntity.ok(ownerService.getDrivers(ownerId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(MessageResponse.builder().success(false).message(e.getMessage()).build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    MessageResponse.builder().success(false).message(e.getMessage()).build());
        }
    }

    // GET /owner/routes — Get all routes for dropdown
    @GetMapping("/routes")
    public ResponseEntity<?> getRoutes(Authentication authentication) {
        try {
            getOwnerId(authentication);
            return ResponseEntity.ok(ownerService.getRoutes());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(MessageResponse.builder().success(false).message(e.getMessage()).build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    MessageResponse.builder().success(false).message(e.getMessage()).build());
        }
    }

    // GET /owner/bus-types — Get all bus types for dropdown
    @GetMapping("/bus-types")
    public ResponseEntity<?> getBusTypes(Authentication authentication) {
        try {
            getOwnerId(authentication);
            return ResponseEntity.ok(ownerService.getBusTypes());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(MessageResponse.builder().success(false).message(e.getMessage()).build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    MessageResponse.builder().success(false).message(e.getMessage()).build());
        }
    }
}