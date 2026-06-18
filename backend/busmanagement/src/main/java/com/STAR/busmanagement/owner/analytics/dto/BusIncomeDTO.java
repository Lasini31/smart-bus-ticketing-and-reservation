package com.STAR.busmanagement.owner.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BusIncomeDTO {
    private String plateNo;
    private double targetIncome;
    private double incomeLast30Days;
    private double targetPercentage;
    private String routeNo; // Adding this because the UI mockup requires it
}