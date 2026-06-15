package com.STAR.busmanagement.owner.dto;

import lombok.Data;

@Data
public class AddDriverRequest {
    private String name;
    private String email;
    private String contactNumber;
    private String licenseNo;
}