package com.STAR.busmanagement.owner.model;

import lombok.Data;
import lombok.Builder;
import java.util.List;

@Data
@Builder
public class Owner {
    private String id;
    private String name;
    private String email;
    private String contactNumber;
    private List<String> busNumbers;
    private List<String> driverIds;
}