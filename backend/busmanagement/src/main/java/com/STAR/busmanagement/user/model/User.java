package com.STAR.busmanagement.user.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID; // <-- Add this import

@Entity
@Table(name = "profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @Column(columnDefinition = "uuid") // <-- Forces Hibernate to match Supabase's UUID type
    private UUID id; // <-- Change data type from String to UUID

    @Column(nullable = false)
    private String name;

    @Column(name = "contact_no")
    private String contactNumber;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String role;
    
    @Column(name = "license_no")
    private String licenseNo;
}