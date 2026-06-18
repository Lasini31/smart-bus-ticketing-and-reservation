// For testing mock data without Supabase DB
package com.STAR.busmanagement.owner.service;
import java.util.List;

import com.STAR.busmanagement.owner.dto.AddBusRequest;
import com.STAR.busmanagement.owner.dto.AddDriverRequest;
import com.STAR.busmanagement.owner.dto.AssignDriverRequest;
import com.STAR.busmanagement.owner.dto.DriverResponse;
import com.STAR.busmanagement.owner.dto.MessageResponse;
import com.STAR.busmanagement.owner.dto.OwnerAnalyticsResponse;

public interface OwnerService {
    MessageResponse addBus(AddBusRequest request);
    MessageResponse removeBus(String busNo);
    DriverResponse addDriver(AddDriverRequest request, String employerId);
    MessageResponse removeDriver(String driverId);
    MessageResponse assignDriver(String busNo, AssignDriverRequest request);
    OwnerAnalyticsResponse getAnalytics();
    List<DriverResponse> getDrivers(String employerId);
}
