// Mock delay to simulate network latency
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const mockPassengers = [
  { passengerId: "1", name: "John Smith", seatSelection: "A1", boardingStop: "Main Street" },
  { passengerId: "2", name: "Sarah Johnson", seatSelection: "A2", boardingStop: "Park Avenue" },
  { passengerId: "3", name: "Michael Brown", seatSelection: "B1", boardingStop: "Central Station" },
  { passengerId: "4", name: "Emily Davis", seatSelection: "B2", boardingStop: "Market Square" },
  { passengerId: "5", name: "David Wilson", seatSelection: "C1", boardingStop: "University Campus" },
  { passengerId: "6", name: "Lisa Anderson", seatSelection: "C2", boardingStop: "Shopping Mall" }
];

const mockDriverProfile = {
  name: "James Anderson",
  id: "DRV-2024-1523",
  phone: "+1 (555) 123-4567",
  email: "james.anderson@buscompany.com",
  address: "123 Oak Street, Springfield, IL 62701",
  licenseNumber: "CDL-A-987654321",
  experience: "8 years",
  rating: 4.8,
  totalTrips: 1247,
  createdDate: "2023-01-15",
  lastUpdated: "2024-05-20",
  status: "active",
  employerId: "EMP-9002"
};

const mockSchedule = [
  { id: "1", time: "6:00 - 10:00", status: "completed" },
  { id: "2", time: "10:30 - 14:30", status: "pending" },
  { id: "3", time: "15:00 - 19:00", status: "pending" },
  { id: "4", time: "19:30 - 23:00", status: "pending" }
];

export const driverApi = {
  /**
   * POST /driver/{id}/shift/start
   */
  startShift: async (id) => {
    await delay(500);
    return { success: true };
  },

  /**
   * POST /driver/{id}/shift/end
   */
  endShift: async (id) => {
    await delay(500);
    return { success: true };
  },

  /**
   * GET /driver/{id}/passengers
   */
  getPassengers: async (id) => {
    await delay(500);
    return mockPassengers;
  },

  /**
   * GET /driver/{id}
   */
  getDriverProfile: async (id) => {
    await delay(500);
    return {
      driverProfile: JSON.stringify(mockDriverProfile),
      busNo: "BUS-4521",
      busTurn: "Route 42 - Downtown Express",
      schedule: JSON.stringify(mockSchedule)
    };
  }
};
