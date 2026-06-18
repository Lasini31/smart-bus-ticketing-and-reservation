import './App.css';

import BusAnalytics from './components/BusAnalytics';
import BusEditPage from './components/BusEditPage';
import Navbar from './components/Navbar';
import MyBuses from './components/MyBuses';
import MyDrivers from './components/MyDrivers';
import DriverEditPage from './components/DriverEditPage';

import { useMemo, useState } from 'react';

const analyticsRows = [
  { busNo: 'NA - 1334', routeNo: '177', percentage: 150 },
  { busNo: 'NG - 4565', routeNo: '17', percentage: 25 },
  { busNo: 'NK - 5656', routeNo: '256', percentage: 85 },
];

const buses = [
  {
    busNo: 'NA - 1334',
    routeNo: '177',
    assignedDriver: 'Theekshana D',
    type: '/Bus-Seat-Template-1.png',
    targetIncome: 'Rs.350 000/=',
  },
  {
    busNo: 'NG - 4565',
    routeNo: '17',
    assignedDriver: 'Sandil R',
    type: '/Bus-Seat-Template-2.png',
    targetIncome: 'Rs.280 000/=',
  },
  {
    busNo: 'NK - 5656',
    routeNo: '256',
    assignedDriver: 'Sandul R',
    type: '/Bus-Seat-Template-3.png',
    targetIncome: 'Rs.320 000/=',
  },
];

const drivers = [
  {
    name: 'Theekshana Kaushallya',
    contactNo: '+94 75 755 6545',
    driverId: 'SRK15',
    licenceNo: '19568465213V',
    assignedBusNo: 'NA - 1334',
    status: 'Due',
    totalDrivingHours: '156hr',
    payableAmount: 500000,
    paymentHistory: [
      { date: 'March', amount: 'Rs.250 000/=' },
      { date: 'February', amount: 'Rs.250 000/=' },
      { date: 'January', amount: 'Rs.250 000/=' },
    ],
  },
  {
    name: 'Sandil R',
    contactNo: '+94 77 111 2233',
    driverId: 'SRK17',
    licenceNo: '17568465211V',
    assignedBusNo: 'NG - 4565',
    status: 'Paid',
    totalDrivingHours: '122hr',
    payableAmount: 0,
    paymentHistory: [
      { date: 'March', amount: 'Rs.250 000/=' },
      { date: 'February', amount: 'Rs.250 000/=' },
      { date: 'January', amount: 'Rs.250 000/=' },
    ],
  },
  {
    name: 'Sandul R',
    contactNo: '+94 76 888 5544',
    driverId: 'SRK20',
    licenceNo: '20568465210V',
    assignedBusNo: 'NK - 5656',
    status: 'Paid',
    totalDrivingHours: '138hr',
    payableAmount: 0,
    paymentHistory: [
      { date: 'March', amount: 'Rs.250 000/=' },
      { date: 'February', amount: 'Rs.250 000/=' },
      { date: 'January', amount: 'Rs.250 000/=' },
    ],
  },
];

const seatTemplates = [
  { label: 'Template 1', value: '/Bus-Seat-Template-1.png' },
  { label: 'Template 2', value: '/Bus-Seat-Template-2.png' },
  { label: 'Template 3', value: '/Bus-Seat-Template-3.png' },
];

function App() {
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
        : [
            ...currentDrivers,
            {
              ...updatedDriver,
              paymentHistory: updatedDriver.paymentHistory || [],
              status: updatedDriver.payableAmount > 0 ? 'Due' : 'Paid',
            },
          ];

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

  const handlePayDriver = (driverId, paymentAmount) => {
    setDriverList((currentDrivers) =>
      currentDrivers.map((driver) => {
        if (driver.driverId !== driverId) {
          return driver;
        }

        const nextHistory = [
          { date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }), amount: `Rs.${paymentAmount.toLocaleString()}/=` },
          ...driver.paymentHistory,
        ];

        return {
          ...driver,
          payableAmount: 0,
          status: 'Paid',
          paymentHistory: nextHistory,
        };
      }),
    );
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
            seatTemplates={seatTemplates}
            onBack={handleBackToDashboard}
            onSave={handleSaveBus}
          />
        </main>
      ) : view === 'add-bus' ? (
        <main className="dashboard-content">
          <BusEditPage
            bus={null}
            drivers={driverList}
            seatTemplates={seatTemplates}
            onBack={handleBackToDashboard}
            onSave={handleSaveBus}
          />
        </main>
      ) : view === 'add-driver' ? (
        <main className="dashboard-content">
          <DriverEditPage
            driver={null}
            buses={busList}
            onBack={handleBackToDashboard}
            onSave={handleSaveDriver}
            onPay={handlePayDriver}
          />
        </main>
      ) : view === 'driver-edit' ? (
        <main className="dashboard-content">
          <DriverEditPage
            driver={selectedDriver}
            buses={busList}
            onBack={handleBackToDashboard}
            onSave={handleSaveDriver}
            onPay={handlePayDriver}
          />
        </main>
      ) : (
        <main className="dashboard-content">
          <BusAnalytics rows={analyticsRows} periodLabel="Last 28 days" totalIncome="Rs. xxx xxx" />

          <section className="dashboard-grid">
            <MyBuses buses={busList} onAddBus={handleAddBus} onEditBus={handleEditBus} />
            <MyDrivers drivers={driverList} onAddDriver={handleAddDriver} onEditDriver={handleEditDriver} />
          </section>
        </main>
      )}
    </div>
  );
}

export default App;

