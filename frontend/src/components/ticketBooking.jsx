import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext.jsx'
import { useWallet } from '../contexts/WalletContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import TicketSearch from './ticketSearch';
import TicketCard from './ticketCard';
import topup from '../../public/icons/topup.png';

export default function TicketBooking() {
  const navigate = useNavigate()
  const { messages } = useLanguage()
  const { balance } = useWallet()
  const { token } = useAuth()

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    from: '',
    to: '',
    startDate: '',
    travelers: 1
  });

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.busmanagement.internal/v1';
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        // Fetch buses + routes in parallel per API contract §6 and §7
        const [busesRes, routesRes] = await Promise.all([
          fetch(`${API_BASE}/buses`, { headers }),
          fetch(`${API_BASE}/routes`, { headers })
        ]);

        if (busesRes.ok && routesRes.ok) {
          const buses = await busesRes.json();
          const routes = await routesRes.json();

          if (Array.isArray(buses) && Array.isArray(routes) && buses.length > 0) {
            const formattedTickets = buses.map(bus => {
              // routeId is now a String in RouteResponse (fixed backend DTO to match API contract)
              const route = routes.find(r => r.routeId === bus.routeId) || {};
              return {
                id: bus.busNo,
                busName: `Bus ${bus.busNo}`,                 // ticketCard: ticket.busName
                from: route.startLocation || 'Unknown',
                to: route.endLocation || 'Unknown',
                date: new Date().toISOString().split('T')[0],
                time: bus.schedule || '08:00 AM',          // ticketCard: ticket.time
                busType: bus.seatTemplate === 'luxury' ? 'Luxury' : 'Normal',
                pricePerSeat: 1000,                                 // ticketCard: ticket.pricePerSeat
                seatsAvailable: 40,
                operator: bus.driverId ? `Driver ${bus.driverId}` : 'Smart Bus Transport',
                amenities: ['A/C', 'WiFi'],
              };
            }).sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' }));
            setTickets(formattedTickets);
            setError(null);
            return;
          }
        }

        // API returned no usable data
        setTickets([]);
        setError('No bus data received from the server.');
      } catch (err) {
        console.error('Failed to fetch buses/routes from backend:', err);
        setTickets([]);
        setError('Could not connect to the backend server. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [token]);

  // ── Filter and pagination logic ──────────────────────────────────────────────
  // - No filters: show all available buses sorted consistently.
  // - Page size: 6 buses per page.
  // - Paginate both unfiltered and filtered results.
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const filteredTickets = useMemo(() => {
    const noFilter = !filters.from && !filters.to;
    if (noFilter) return tickets;

    return tickets.filter(ticket => {
      const fromMatch = !filters.from ||
        ticket.from.toLowerCase().includes(filters.from.toLowerCase());
      const toMatch = !filters.to ||
        ticket.to.toLowerCase().includes(filters.to.toLowerCase());
      return fromMatch && toMatch;
    });
  }, [tickets, filters]); // <-- tickets added to deps

  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / pageSize));
  const pagedTickets = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTickets.slice(start, start + pageSize);
  }, [filteredTickets, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredTickets]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:pl-8 md:pr-8 md:pt-2 md:pb-8">
      {/* Main Container */}
      <div className="max-w-6xl mx-auto">

        {/* Wallet Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="hidden md:block md:col-span-2" />
          <div className="bg-white shadow-md p-5 border-b-2 border-gray-200 border rounded-lg w-full">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <p className="text-gray-600 text-sm">Wallet</p>
                <div className="flex flex-wrap items-baseline gap-2 mt-1">
                  <span className="text-gray-700 text-2xl font-semibold">Balance</span>
                  <h2 className="text-2xl font-bold text-green-600">Rs.{(balance || 0).toFixed(2)}</h2>
                </div>
              </div>
              <div
                className="flex w-full md:w-auto flex-wrap items-center justify-center md:justify-between gap-3 border border-gray-200 hover:bg-gray-100 p-3 rounded-lg transition cursor-pointer text-green-700"
                onClick={() => navigate('/wallet')}
              >
                <div className="flex-shrink-0 flex items-center justify-center bg-green-100 p-2 rounded-lg min-w-[44px] min-h-[44px]">
                  <img src={topup} alt="Top-up" className="w-8 h-8 object-contain" />
                </div>
                <p className="font-semibold text-sm whitespace-nowrap">Top-up</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <TicketSearch onSearch={setFilters} />

        {/* Results Header */}
        <div className="mb-6 flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-800">
            {messages.booking?.available || 'Available Buses'}
            <span className="text-sm text-gray-600 ml-2">({filteredTickets.length} results)</span>
          </h2>
          {error && (
            <span className="text-xs bg-red-100 text-red-700 border border-red-300 rounded-full px-3 py-1 font-medium">
              Backend Offline
            </span>
          )}
        </div>

        {/* Tickets List */}
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {loading ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">Loading tickets...</p>
            </div>
          ) : error ? (
            <div className="col-span-full bg-red-50 border border-red-200 rounded-lg shadow-sm p-12 text-center">
              <p className="text-red-600 text-lg font-semibold">Error Loading Buses</p>
              <p className="text-red-500 text-sm mt-2">{error}</p>
            </div>
          ) : pagedTickets.length > 0 ? (
            pagedTickets.map(ticket => {
              const canBook = filters.travelers <= ticket.seatsAvailable;
              return (
                <div key={ticket.id} className={canBook ? '' : 'opacity-60'}>
                  <TicketCard
                    ticket={ticket}
                    travelers={filters.travelers}
                  />
                </div>
              );
            })
          ) : (
            <div className="col-span-full bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg">No buses found matching your criteria</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search filters</p>
            </div>
          )}
        </div>

        {(!filters.from && !filters.to) && filteredTickets.length > pageSize && (
          <div className="mt-6 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">
              Showing page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
