package com.STAR.busmanagement.trip.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "trips")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid")
    private UUID id;

    @Column(name = "route_id", nullable = false)
    private UUID routeId;

    @Column(name = "bus_id", nullable = false)
    private UUID busId;

    @Column(name = "driver_id", nullable = false)
    private UUID driverId;

    @Column(name = "departure_at", nullable = false)
    private OffsetDateTime departureAt;

    @Column(name = "arrival_at", nullable = false)
    private OffsetDateTime arrivalAt;

    @Column(name = "is_reverse_trip", nullable = false)
    private Boolean isReverseTrip;
}