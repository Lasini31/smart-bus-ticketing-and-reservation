// For testing mock data without Supabase DB
package com.STAR.busmanagement.owner.service;

import com.STAR.busmanagement.owner.dto.*;

public interface OwnerService {
    MessageResponse addBus(AddBusRequest request);
    MessageResponse removeBus(String busNo);
    DriverResponse addDriver(AddDriverRequest request, String employerId);
    MessageResponse removeDriver(String driverId);
    MessageResponse assignDriver(String busNo, AssignDriverRequest request);
    OwnerAnalyticsResponse getAnalytics();
}
