import { useMemo, useState } from 'react'
import BusAnalytics from './components/BusAnalytics.jsx'
import BusEditPage from './components/BusEditPage.jsx'
import Navbar from './components/Navbar.jsx'
import MyBuses from './components/MyBuses.jsx'
import MyDrivers from './components/MyDrivers.jsx'
import DriverEditPage from './components/DriverEditPage.jsx'
import './App.css'

const analyticsRows = [
  { busNo: 'NA - 1334', routeNo: 'Route 177', percentage: 150 },
  { busNo: 'NG - 4565', routeNo: 'Route 17', percentage: 25 },
  { busNo: 'NK - 5656', routeNo: 'Route 256', percentage: 85 },
];

const buses = [
  {
    busNo: 'NA - 1334',
    routeId: '2342l3j42k3jb',
    assignedDriver: 'Theekshana D',
    type: '/Bus-Seat-Template-1.png',
    targetIncome: 'Rs.350 000/=',
  },
  {
    busNo: 'NG - 4565',
    routeId: 'jwhwe7cw769wec',
    assignedDriver: 'Sandil R',
    type: '/Bus-Seat-Template-2.png',
    targetIncome: 'Rs.280 000/=',
  },
  {
    busNo: 'NK - 5656',
    routeId: 'dkscbds89dcc',
    assignedDriver: 'Sandul R',
    type: '/Bus-Seat-Template-3.png',
    targetIncome: 'Rs.320 000/=',
  },
];

const drivers = [
  {
    name: 'Theekshana D',
    contactNo: '+94 75 755 6545',
    email: 'tk@gmail.com',
    driverId: 'SRK15',
    licenceNo: '19568465213V',
    assignedBusNo: 'NA - 1334',
    totalDrivingHours: '156hr',
  },
  {
    name: 'Sandil R',
    contactNo: '+94 77 111 2233',
    email: 'sr@gmail.com',
    driverId: 'SRK17',
    licenceNo: '17568465211V',
    assignedBusNo: 'NG - 4565',
    totalDrivingHours: '122hr',
  },
  {
    name: 'Sandul R',
    contactNo: '+94 76 888 5544',
    driverId: 'SRK20',
    licenceNo: '20568465210V',
    assignedBusNo: 'NK - 5656',
    totalDrivingHours: '138hr',
  },
];

const seatTemplates = [
  { label: 'Template 1', value: '/Bus-Seat-Template-1.png' },
  { label: 'Template 2', value: '/Bus-Seat-Template-2.png' },
  { label: 'Template 3', value: '/Bus-Seat-Template-3.png' },
];

const roots = [
  { rootName: 'Route 177', routeID: '2342l3j42k3jb' },
  { rootName: 'Route 17', routeID: 'jwhwe7cw769wec' },
  { rootName: 'Route 256', routeID: 'dkscbds89dcc' },
];

export default function OwnerDashboard() {
  const [busList, setBusList] = useState(buses);
  const [driverList, setDriverList] = useState(drivers);
  const [view, setView] = useState('dashboard');
  const [selectedBusNo, setSelectedBusNo] = useState(buses[0].busNo);
  const [selectedDriverId, setSelectedDriverId] = useState(drivers[0].driverId);

  const selectedBus = useMemo(
    () => busList.find((bus) => bus.busNo === selectedBusNo) || busList[0],
    [busList, selectedBusNo],
  );

  const selectedDriver = useMemo(
    () => driverList.find((driver) => driver.driverId === selectedDriverId) || driverList[0],
    [driverList, selectedDriverId],
  );

  const handleEditBus = (busNo) => {
    setSelectedBusNo(busNo);
    setView('edit');
  };

  const handleAddBus = () => {
    setSelectedBusNo('');
    setView('add-bus');
  };
 
  const handleEditDriver = (driverId) => {
    setSelectedDriverId(driverId);
    setView('driver-edit');
  };

  const handleAddDriver = () => {
    setSelectedDriverId('');
    setView('add-driver');
  };

  const handleSaveBus = (updatedBus) => {
    setBusList((currentBuses) => {
      const existingBus = currentBuses.find((bus) => bus.busNo === selectedBusNo);

      setDriverList((currentDrivers) =>
        currentDrivers.map((driver) => {
          if (driver.name === updatedBus.assignedDriver) {
            return {
              ...driver,
              assignedBusNo: updatedBus.busNo,
            };
          }

          if (existingBus && driver.name === existingBus.assignedDriver && driver.name !== updatedBus.assignedDriver) {
            return {
              ...driver,
              assignedBusNo: '',
            };
          }

          return driver;
        }),
      );

      return currentBuses.some((bus) => bus.busNo === selectedBusNo)
        ? currentBuses.map((bus) => (bus.busNo === selectedBusNo ? updatedBus : bus))
        : [...currentBuses, updatedBus];
    });
    setSelectedBusNo(updatedBus.busNo);
    setView('dashboard');
  };

  const handleSaveDriver = (updatedDriver) => {
    setDriverList((currentDrivers) => {
      const existingDriver = currentDrivers.find((driver) => driver.driverId === selectedDriverId);
      const nextDrivers = currentDrivers.some((driver) => driver.driverId === selectedDriverId)
        ? currentDrivers.map((driver) => (driver.driverId === selectedDriverId ? updatedDriver : driver))
        : [...currentDrivers, updatedDriver];

      setBusList((currentBuses) =>
        currentBuses.map((bus) => {
          if (bus.busNo === updatedDriver.assignedBusNo) {
            return {
              ...bus,
              assignedDriver: updatedDriver.name,
            };
          }

          if (
            existingDriver &&
            bus.busNo === existingDriver.assignedBusNo &&
            existingDriver.assignedBusNo !== updatedDriver.assignedBusNo
          ) {
            return {
              ...bus,
              assignedDriver: '',
            };
          }

          if (existingDriver && bus.busNo === existingDriver.assignedBusNo) {
            return {
              ...bus,
              assignedDriver: updatedDriver.name,
            };
          }

          return bus;
        }),
      );

      return nextDrivers;
    });
    setSelectedDriverId(updatedDriver.driverId);
    setView('dashboard');
  };

  const handleDeleteDriver = (driverId) => {
    setDriverList((currentDrivers) =>
      currentDrivers.filter((driver) => driver.driverId !== driverId)
    );

    setBusList((currentBuses) =>
      currentBuses.map((bus) => {
        if (bus.assignedDriver === selectedDriver?.name) {
          return {
            ...bus,
            assignedDriver: '',
          };
        }
        return bus;
      })
    );

    setView('dashboard');
  };

  const handleDeleteBus = (busNo) => {
    setBusList((currentBuses) =>
      currentBuses.filter((bus) => bus.busNo !== busNo)
    );

    setDriverList((currentDrivers) =>
      currentDrivers.map((driver) => {
        if (driver.assignedBusNo === busNo) {
          return {
            ...driver,
            assignedBusNo: '',
          };
        }
        return driver;
      })
    );

    setView('dashboard');
  };

  const handleBackToDashboard = () => {
    setView('dashboard');
  };

  return (
    <div className="dashboard-shell">
      <Navbar />

      {view === 'edit' ? (
        <main className="dashboard-content">
          <BusEditPage
            bus={selectedBus}
            drivers={driverList}
            roots={roots}
            seatTemplates={seatTemplates}
            onBack={handleBackToDashboard}
            onSave={handleSaveBus}
            onDelete={handleDeleteBus}
          />
        </main>
      ) : view === 'add-bus' ? (
        <main className="dashboard-content">
          <BusEditPage
            bus={null}
            drivers={driverList}
            roots={roots}
            seatTemplates={seatTemplates}
            onBack={handleBackToDashboard}
            onSave={handleSaveBus}
            onDelete={undefined}
          />
        </main>
      ) : view === 'add-driver' ? (
        <main className="dashboard-content">
          <DriverEditPage
            driver={null}
            buses={busList}
            onBack={handleBackToDashboard}
            onSave={handleSaveDriver}
            onDelete={undefined}
          />
        </main>
      ) : view === 'driver-edit' ? (
        <main className="dashboard-content">
          <DriverEditPage
            driver={selectedDriver}
            buses={busList}
            onBack={handleBackToDashboard}
            onSave={handleSaveDriver}
            onDelete={handleDeleteDriver}
          />
        </main>
      ) : (
        <main className="dashboard-content">
          <BusAnalytics rows={analyticsRows} periodLabel="Last 28 days" totalIncome="Rs. xxx xxx" />

          <section className="dashboard-grid">
            <MyBuses buses={busList} roots={roots} onAddBus={handleAddBus} onEditBus={handleEditBus} />
            <MyDrivers drivers={driverList} onAddDriver={handleAddDriver} onEditDriver={handleEditDriver} />
          </section>
        </main>
      )}
    </div>
  );
}
