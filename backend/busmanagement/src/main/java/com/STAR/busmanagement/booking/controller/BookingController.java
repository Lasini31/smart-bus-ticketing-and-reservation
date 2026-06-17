package com.STAR.busmanagement.booking.controller;

import com.STAR.busmanagement.booking.dto.CreateBookingRequest;
import com.STAR.busmanagement.booking.model.Booking;
import com.STAR.busmanagement.booking.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody CreateBookingRequest request) {
        return ResponseEntity.ok(bookingService.createBooking(request));
    }

    @GetMapping("/passenger/{passengerId}")
    public ResponseEntity<List<Booking>> getPassengerBookings(@PathVariable UUID passengerId) {
        return ResponseEntity.ok(bookingService.getPassengerBookings(passengerId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable UUID id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }
}