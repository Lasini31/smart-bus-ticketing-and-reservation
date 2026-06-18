package com.STAR.busmanagement.booking.dto;

import lombok.Data;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
public class CreateBookingRequest {
    private UUID tripId;
    private UUID passengerId;
    private Double fare;
    private Integer seatNo;
    private String startLocation;
    private String endLocation;
    private OffsetDateTime startAt;
}