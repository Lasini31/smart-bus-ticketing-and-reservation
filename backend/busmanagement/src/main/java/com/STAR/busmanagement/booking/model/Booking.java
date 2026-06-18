package com.STAR.busmanagement.booking.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "bookings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid")
    private UUID id;

    @Column(name = "trip_id", nullable = false)
    private UUID tripId;

    @Column(name = "passenger_id", nullable = false)
    private UUID passengerId;

    @Column(nullable = false)
    private Double fare;

    @Column(name = "seat_no", nullable = false)
    private Integer seatNo;

    @Column(name = "start_location", nullable = false)
    private String startLocation;

    @Column(name = "end_location", nullable = false)
    private String endLocation;

    @Column(nullable = false)
    private String status; // e.g., "PENDING", "CONFIRMED", "CANCELLED"

    @Column(name = "start_at")
    private OffsetDateTime startAt;

    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = OffsetDateTime.now();
        if (this.status == null) {
            this.status = "CONFIRMED"; // Default status
        }
    }
}