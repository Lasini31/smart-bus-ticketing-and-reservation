package com.STAR.busmanagement.trip.service;

import com.STAR.busmanagement.trip.dto.CreateTripRequest;
import com.STAR.busmanagement.trip.model.Trip;
import com.STAR.busmanagement.trip.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class TripService {

    @Autowired
    private TripRepository tripRepository;

    public Trip createTrip(CreateTripRequest request) {
        Trip trip = Trip.builder()
                .routeId(request.getRouteId())
                .busId(request.getBusId())
                .driverId(request.getDriverId())
                .departureAt(request.getDepartureAt())
                .arrivalAt(request.getArrivalAt())
                .isReverseTrip(request.getIsReverseTrip() != null ? request.getIsReverseTrip() : false)
                .build();
        return tripRepository.save(trip);
    }

    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }

    public Trip getTripById(UUID id) {
        return tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trip schedule not found for ID: " + id));
    }
}