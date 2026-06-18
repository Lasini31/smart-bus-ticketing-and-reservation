// For testing mock data without Supabase DB
package com.STAR.busmanagement.owner.service;

import java.util.List;
import com.STAR.busmanagement.owner.dto.*;

public interface OwnerService {
    MessageResponse addBus(AddBusRequest request, String ownerId);
    MessageResponse removeBus(String busNo);
    DriverResponse addDriver(AddDriverRequest request, String employerId);
    MessageResponse removeDriver(String driverId);
    MessageResponse assignDriver(String busNo, AssignDriverRequest request);
    OwnerAnalyticsResponse getAnalytics();
    List<DriverResponse> getDrivers(String employerId);
    List<BusListResponse> getBusesByOwner(String ownerId);
    List<DriverListResponse> getDriversByOwner(String ownerId);
    List<RouteResponse> getRoutes();
    List<BusTypeResponse> getBusTypes();
}