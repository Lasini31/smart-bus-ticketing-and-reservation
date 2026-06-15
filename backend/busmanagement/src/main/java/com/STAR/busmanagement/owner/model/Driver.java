package com.STAR.busmanagement.owner.model;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class Driver {
    private String id;
    private String name;
    private String email;
    private String contactNumber;
    private String licenseNo;
    private String busNumber;
    private String ownerId;
}