package com.STAR.busmanagement.bus.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "buses")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Bus {

    @Id
    @Column(name = "id")
    private UUID id;

    @Column(name = "plate_no")
    private String plateNo;

    @Column(name = "route_id")
    private UUID routeId;

    @Column(name = "bus_type_id")
    private UUID busTypeId;

    @Column(name = "owner_id")
    private UUID ownerId;

    @Column(name = "status")
    private String status;

    @Column(name = "assigned_driver_id")
    private UUID assignedDriverId;
}
