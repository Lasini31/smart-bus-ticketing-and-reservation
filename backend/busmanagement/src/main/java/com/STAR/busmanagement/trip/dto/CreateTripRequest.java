package com.STAR.busmanagement.trip.dto;

import lombok.Data;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
public class CreateTripRequest {
    private UUID routeId;
    private UUID busId;
    private UUID driverId;
    private OffsetDateTime departureAt;
    private OffsetDateTime arrivalAt;
    private Boolean isReverseTrip;
}