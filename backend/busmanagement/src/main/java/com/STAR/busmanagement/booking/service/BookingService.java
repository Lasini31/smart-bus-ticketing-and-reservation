package com.STAR.busmanagement.booking.service;

import com.STAR.busmanagement.booking.dto.CreateBookingRequest;
import com.STAR.busmanagement.booking.model.Booking;
import com.STAR.busmanagement.booking.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    public Booking createBooking(CreateBookingRequest request) {
        Booking booking = Booking.builder()
                .tripId(request.getTripId())
                .passengerId(request.getPassengerId())
                .fare(request.getFare())
                .seatNo(request.getSeatNo())
                .startLocation(request.getStartLocation())
                .endLocation(request.getEndLocation())
                .startAt(request.getStartAt())
                .build();
        return bookingRepository.save(booking);
    }

    public List<Booking> getPassengerBookings(UUID passengerId) {
        return bookingRepository.findByPassengerId(passengerId);
    }

    public Booking getBookingById(UUID id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket booking record not found for ID: " + id));
    }
}