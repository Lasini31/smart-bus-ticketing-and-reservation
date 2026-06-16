import { useNavigate } from 'react-router-dom';

export default function TicketCard({ ticket }) {
  const navigate = useNavigate();

  const handleBuy = () => {
    navigate('/booking/select', { state: { ticket, travelers: 0 } });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
      <div className="flex items-center gap-4">
        
        {/* Left Side - Bus Details */}
        <div className="flex-1">
          <h3 className="text-base font-bold text-gray-800 mb-0.5">{ticket.busName}</h3>
          <p className="text-xs text-gray-500 mb-2">{ticket.date}</p>

          {/* From Location */}
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-green-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
              ✓
            </span>
            <div>
              <p className="text-sm text-gray-800 font-semibold">{ticket.from}</p>
            </div>
          </div>

          {/* To Location */}
          <div className="flex items-center gap-2">
            <span className="bg-green-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
              ✓
            </span>
            <div>
              <p className="text-sm text-gray-800 font-semibold">{ticket.to}</p>
            </div>
          </div>
          {/* Available Seats */}
          <p className="text-xs text-gray-600 mt-2 mb-2">Available Seats: <span className="font-bold text-gray-800">{ticket.seatsAvailable}</span></p>
        </div>

        {/* Dotted Divider */}
        <div className="border-l-2 border-dotted border-gray-300 h-26"></div>

        {/* Right Side - Time, Button, Price */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Time */}
          <p className="text-2xl font-bold text-black mb-2">{ticket.time}</p>


          {/* Buy Ticket Button */}
          <button
            onClick={handleBuy}
            className={`font-bold py-1.5 px-5 rounded-full transition mb-2 text-sm bg-green-600 hover:bg-green-700 text-white`}
          >
            Buy Ticket
          </button>

          {/* Price */}
          <p className="text-xs text-gray-600">Price/Seat:</p>
          <p className="text-sm font-bold text-red-600">Rs {ticket.pricePerSeat}</p>
          
        </div>
      </div>
    </div>
  );
}