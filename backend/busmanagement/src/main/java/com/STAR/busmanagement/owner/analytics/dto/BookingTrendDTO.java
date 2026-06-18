package com.STAR.busmanagement.owner.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BookingTrendDTO {
    private String date;    // e.g. "15 Jun"
    private long count;     // number of bookings on that day
}