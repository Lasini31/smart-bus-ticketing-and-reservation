package com.STAR.busmanagement.route.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnTransformer; // <-- Add this import
import java.util.UUID;

@Entity
@Table(name = "routes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid")
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(name = "start_location", nullable = false)
    private String startLocation;

    @Column(name = "end_location", nullable = false)
    private String endLocation;

    // This handles the type casting straight inside the database queries, bypassing Jackson entirely!
    @Column(name = "stops", columnDefinition = "jsonb")
    @ColumnTransformer(write = "?::jsonb") 
    private String stops;

    @Column(nullable = false)
    private Boolean status;
}