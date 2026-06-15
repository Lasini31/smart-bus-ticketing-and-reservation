package com.STAR.busmanagement.owner.service;

import com.STAR.busmanagement.owner.dto.*;
import com.STAR.busmanagement.owner.model.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OwnerService {

    private final List<Bus> buses = new ArrayList<>();
    private final List<Driver> drivers = new ArrayList<>();

    // ADD BUS
    public MessageResponse addBus(AddBusRequest request) {
        boolean exists = buses.stream()
                .anyMatch(b -> b.getBusNo().equals(request.getBusNo()));
        if (exists) {
            throw new RuntimeException("CONFLICT: Bus number already exists.");
        }
        Bus bus = Bus.builder()
                .busNo(request.getBusNo())
                .routeId(request.getRouteId())
                .seatTemplate(request.getSeatTemplate())
                .driverId(null)
                .build();
        buses.add(bus);
        return MessageResponse.builder()
                .success(true)
                .message("Bus " + request.getBusNo() + " added successfully.")
                .build();
    }

    // REMOVE BUS
    public MessageResponse removeBus(String busNo) {
        boolean removed = buses.removeIf(b -> b.getBusNo().equals(busNo));
        if (!removed) {
            throw new RuntimeException("NOT_FOUND: Bus " + busNo + " does not exist.");
        }
        return MessageResponse.builder()
                .success(true)
                .message("Bus " + busNo + " removed successfully.")
                .build();
    }

    // ADD DRIVER
    public DriverResponse addDriver(AddDriverRequest request) {
        String newId = "DRV-" + (drivers.size() + 1);
        Driver driver = Driver.builder()
                .id(newId)
                .name(request.getName())
                .email(request.getEmail())
                .contactNumber(request.getContactNumber())
                .licenseNo(request.getLicenseNo())
                .busNumber(null)
                .build();
        drivers.add(driver);
        return DriverResponse.builder()
                .driverId(newId)
                .name(request.getName())
                .email(request.getEmail())
                .contactNumber(request.getContactNumber())
                .licenseNo(request.getLicenseNo())
                .busNo(null)
                .build();
    }

    // REMOVE DRIVER
    public MessageResponse removeDriver(String driverId) {
        boolean removed = drivers.removeIf(d -> d.getId().equals(driverId));
        if (!removed) {
            throw new RuntimeException("NOT_FOUND: Driver " + driverId + " does not exist.");
        }
        return MessageResponse.builder()
                .success(true)
                .message("Driver " + driverId + " removed successfully.")
                .build();
    }

    // ASSIGN DRIVER TO BUS
    public MessageResponse assignDriver(String busNo, AssignDriverRequest request) {
        Bus bus = buses.stream()
                .filter(b -> b.getBusNo().equals(busNo))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("NOT_FOUND: Bus " + busNo + " does not exist."));
        Driver driver = drivers.stream()
                .filter(d -> d.getId().equals(request.getDriverId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("NOT_FOUND: Driver " + request.getDriverId() + " does not exist."));
        bus.setDriverId(driver.getId());
        driver.setBusNumber(busNo);
        return MessageResponse.builder()
                .success(true)
                .message("Driver " + driver.getName() + " assigned to Bus " + busNo + " successfully.")
                .build();
    }

    // GET ANALYTICS
    public OwnerAnalyticsResponse getAnalytics() {
        return OwnerAnalyticsResponse.builder()
                .totalBuses(buses.size())
                .totalDrivers(drivers.size())
                .totalPassengers(1842)
                .tripsToday(94)
                .revenueToday(47500.00)
                .generatedAt(java.time.ZonedDateTime.now(java.time.ZoneOffset.UTC)
                        .format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'")))
                .build();
    }
}