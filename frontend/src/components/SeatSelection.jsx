import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function SeatSelection() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { balance, deduct } = useWallet();
  const ticket = state?.ticket;
  const initialTravelers = 0;
  const { token } = useAuth();

  const [driver, setDriver] = useState(null);
  const [driverLoading, setDriverLoading] = useState(false);
  const [driverError, setDriverError] = useState(null);

  useEffect(() => {
    if (!ticket) {
      navigate('/booking');
    }
  }, [ticket, navigate]);

  useEffect(() => {
    // Fetch driver details from backend when ticket (busNo) is available
    if (!ticket) return;
    const fetchDriver = async () => {
      setDriverLoading(true);
      setDriverError(null);
      try {
        const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.busmanagement.internal/v1';
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        // 1) Get bus info to obtain driverId (BusResponse.driverId)
        const busRes = await fetch(`${API_BASE}/buses/${ticket.id}`, { headers });
        if (!busRes.ok) {
          throw new Error(`Failed to fetch bus info (${busRes.status})`);
        }
        const bus = await busRes.json();
        const driverId = bus?.driverId;

        // If backend already supplies driverName/driverPhone on the bus response, use those
        if (bus?.driverName || bus?.driverPhone) {
          setDriver({ driverProfile: bus.driverName, contactNumber: bus.driverPhone });
          return;
        }

        if (!driverId) {
          setDriver(null);
          return;
        }

        // 2) Fallback: Get driver profile (DriverController GET /driver/{id})
        const drvRes = await fetch(`${API_BASE}/driver/${driverId}`, { headers });
        if (!drvRes.ok) {
          // don't throw - just record and fallback to ticket fields
          setDriverError(`Driver details unavailable (${drvRes.status})`);
          setDriver(null);
          return;
        }
        const drv = await drvRes.json();
        setDriver(drv);
      } catch (err) {
        setDriverError(err.message || String(err));
        setDriver(null);
      } finally {
        setDriverLoading(false);
      }
    };

    fetchDriver();
  }, [ticket, token]);

  if (!ticket) return null;

  const totalSeats = ticket.totalSeats || 40;
  const bookedSeats = ticket.bookedSeats || [];

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [numTickets, setNumTickets] = useState(initialTravelers);

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return;
    const maxSelectable = Math.min(ticket.seatsAvailable, totalSeats - bookedSeats.length);
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(prev => prev.filter(s => s !== seat));
      setNumTickets(prev => Math.max(0, selectedSeats.length - 1));
      return;
    }
    if (selectedSeats.length >= maxSelectable) {
      alert(`No more seats available to select`);
      return;
    }
    setSelectedSeats(prev => [...prev, seat]);
    setNumTickets(prev => Math.max(prev, selectedSeats.length + 1));
  };

  const handleProceed = () => {
    if (selectedSeats.length < 1) {
      alert('Please select at least one seat');
      return;
    }
    if (selectedSeats.length !== numTickets) {
      alert('Please ensure selected seats equal number of tickets');
      return;
    }
    const payload = {
      ticketId: ticket.id,
      seats: selectedSeats,
      numTickets,
      totalAmount: (ticket.pricePerSeat * numTickets)
    };
    if (payload.totalAmount > balance) {
      alert('Not enough balance. Redirecting to wallet top-up.');
      navigate('/wallet');
      return;
    }

    const success = deduct(payload.totalAmount, `Bus ticket: ${ticket.busName}`);
    if (!success) {
      alert('There was a problem deducting your balance. Please top up first.');
      navigate('/wallet');
      return;
    }

    navigate('/booking/ticket', {
      state: {
        ticket,
        seats: selectedSeats,
        totalAmount: payload.totalAmount
      }
    });
  };

  const rows = [];
  const seatsPerRow = 4; // 2 + aisle + 2
  for (let i = 1; i <= totalSeats; i += seatsPerRow) {
    rows.push(Array.from({ length: seatsPerRow }, (_, k) => i + k));
  }

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Seats for {ticket.busName}</h2>

          <div className="space-y-2">
            {rows.map((row, rIdx) => (
              <div key={rIdx} className="flex items-center gap-4">
                {/* Left pair */}
                <div className="flex gap-3">
                  {row.slice(0,2).map((seat) => (
                    <button
                      key={seat}
                      onClick={() => toggleSeat(seat)}
                      disabled={bookedSeats.includes(seat)}
                      className={`w-12 h-12 rounded-md flex items-center justify-center text-sm font-semibold transition
                        ${bookedSeats.includes(seat) ? 'bg-red-500 text-white cursor-not-allowed' : ''}
                        ${selectedSeats.includes(seat) ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                    >
                      {seat}
                    </button>
                  ))}
                </div>

                {/* Aisle spacer */}
                <div className="w-8" />

                {/* Right pair */}
                <div className="flex gap-3">
                  {row.slice(2,4).map((seat) => (
                    <button
                      key={seat}
                      onClick={() => toggleSeat(seat)}
                      disabled={bookedSeats.includes(seat)}
                      className={`w-12 h-12 rounded-md flex items-center justify-center text-sm font-semibold transition
                        ${bookedSeats.includes(seat) ? 'bg-red-500 text-white cursor-not-allowed' : ''}
                        ${selectedSeats.includes(seat) ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                    >
                      {seat}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-green-600 inline-block rounded-sm"></span>
              <span className="text-sm text-gray-700">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-green-100 inline-block rounded-sm border border-green-200"></span>
              <span className="text-sm text-gray-700">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-red-500 inline-block rounded-sm"></span>
              <span className="text-sm text-gray-700">Unavailable</span>
            </div>
          </div>
        </div>

        <aside className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-2">Trip Details</h3>
          <p className="text-sm text-gray-600 mb-1">Bus: <span className="font-semibold text-gray-800">{ticket.busName} ({ticket.busNumber})</span></p>
          <p className="text-sm text-gray-600 mb-1">Route: <span className="font-semibold text-gray-800">{ticket.from} → {ticket.to}</span></p>
          <p className="text-sm text-gray-600 mb-1">Departure: <span className="font-semibold text-gray-800">{ticket.time}</span></p>
          <p className="text-sm text-gray-600 mb-1">ETA: <span className="font-semibold text-gray-800">{ticket.expectedArrivalTime || ticket.arrivalTime || '-'}</span></p>
          <div className="border-t border-gray-200 mt-3 pt-3">
            <p className="text-sm text-gray-600">Driver: <span className="font-semibold text-gray-800">{driver ? (driver.driverProfile || driver.name) : (ticket.driver || 'N/A')}{driverLoading ? ' (loading...)' : ''}</span></p>
            <p className="text-sm text-gray-600">Driver Phone: <span className="font-semibold text-gray-800">{driver ? (driver.contactNumber || ticket.driverPhone || '-') : (ticket.driverPhone || '-')}</span></p>
            <p className="text-sm text-gray-600">Conductor: <span className="font-semibold text-gray-800">{ticket.conductor || 'N/A'}</span></p>
            <p className="text-sm text-gray-600">Conductor Phone: <span className="font-semibold text-gray-800">{ticket.conductorPhone || '-'}</span></p>
            {driverError && <p className="text-xs text-red-500 mt-2">{driverError}</p>}
          </div>

          <div className="mt-4">
            <label className="block text-xs text-gray-600 mb-1">Number of Tickets</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setNumTickets(prev => {
                    const next = Math.max(0, prev - 1);
                    if (selectedSeats.length > next) setSelectedSeats(s => s.slice(0, next));
                    return next;
                  });
                }}
                className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center"
              >−</button>
              <input type="number" value={numTickets} onChange={(e)=>{
                const v = parseInt(e.target.value||'0');
                if (isNaN(v)) return;
                const max = ticket.seatsAvailable;
                const next = Math.min(max, Math.max(0, v));
                if (selectedSeats.length > next) setSelectedSeats(s => s.slice(0, next));
                setNumTickets(next);
              }} className="w-16 text-center border-b-2 border-gray-200" />
              <button
                onClick={() => {
                  setNumTickets(prev => Math.min(ticket.seatsAvailable, prev + 1));
                }}
                className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center"
              >+</button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Seats available: <span className="font-semibold text-gray-800">{ticket.seatsAvailable}</span></p>
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-600">Price/Seat: <span className="font-bold text-green-700">Rs {ticket.pricePerSeat}</span></p>
            <p className="text-lg font-bold text-green-700 mt-2">Total: Rs {(ticket.pricePerSeat * numTickets).toFixed(2)}</p>
            <p className="text-sm text-gray-600 mt-2">Wallet balance: <span className="font-semibold text-green-700">Rs {balance.toFixed(2)}</span></p>
          </div>

          <button
            onClick={handleProceed}
            className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded"
          >
            Proceed to Payment
          </button>
        </aside>
      </div>
    </div>
  );
}
