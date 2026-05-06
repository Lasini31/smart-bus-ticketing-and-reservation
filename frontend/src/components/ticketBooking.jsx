import { useState, useMemo } from 'react';
import TicketSearch from './ticketSearch';
import TicketCard from './ticketCard';
import { SAMPLE_TICKETS } from './ticketSampleData';
import topup from '../../public/icons/topup.png';

export default function TicketBooking() {
  const [filters, setFilters] = useState({
    from: '',
    to: '',
    startDate: '',
    travelers: 1
  });

  // Filter tickets based on search criteria
  const filteredTickets = useMemo(() => {
    return SAMPLE_TICKETS.filter(ticket => {
      const fromMatch = !filters.from || ticket.from.includes(filters.from.toLowerCase());
      const toMatch = !filters.to || ticket.to.includes(filters.to.toLowerCase());
      return fromMatch && toMatch;
    });
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:pl-8 md:pr-8 md:pt-2 md:pb-8">
      {/* Main Container */}
      <div className="max-w-6xl mx-auto">
        {/* Wallet Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="md:col-span-2"></div>
          <div className="bg-white shadow-md pt-1 pb-1 pl-6 pr-6 border-b-2 border-gray-200 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Wallet</p>
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 text-2xl font-semibold">Balance</span>
                  <h2 className="text-2xl font-bold text-green-600 mr-4">Rs.5440.50</h2>
                </div>
              </div>
              <div className="flex flex-col items-center border-md hover:bg-gray-100 p-2 rounded-lg transition cursor-pointer">
                <div className="bg-blue-100 p-2 rounded-lg mb-2">
                  <img src={topup} alt="Top-up" className="w-10 h-10" />
                </div>
                <p className=" font-semibold text-sm">
                  Top-up
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <TicketSearch onSearch={setFilters} />

        {/* Results Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Available Buses
            <span className="text-sm text-gray-600 ml-2">
              ({filteredTickets.length} results)
            </span>
          </h2>
        </div>

        {/* Tickets List */}
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {filteredTickets.length > 0 ? (
            filteredTickets.map(ticket => {
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
              <p className="text-gray-500 text-lg">
                No buses found matching your criteria
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Try adjusting your search filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}