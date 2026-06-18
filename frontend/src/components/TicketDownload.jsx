import { useLocation, useNavigate } from 'react-router-dom';

export default function TicketDownload() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const ticket = state?.ticket;
  const seats = state?.seats || [];
  const amount = state?.totalAmount || 0;

  if (!ticket || !seats.length) {
    navigate('/booking');
    return null;
  }

  const qrValue = `${ticket.id}-${seats.join(',')}-${amount}`;

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Ticket is Ready</h1>
        <p className="text-sm text-gray-600 mb-6">Download your ticket and present the QR code when boarding.</p>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-4">
            <section className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
              <p className="text-xs uppercase text-gray-500">Bus details</p>
              <h2 className="mt-3 text-2xl font-bold text-gray-900">{ticket.busName}</h2>
              <p className="text-sm text-gray-600">Route: {ticket.from} → {ticket.to}</p>
              <p className="text-sm text-gray-600">Departure: {ticket.time}</p>
              <p className="text-sm text-gray-600">ETA: {ticket.expectedArrivalTime || ticket.arrivalTime || '-'}</p>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
              <p className="text-xs uppercase text-gray-500">Your journey</p>
              <div className="mt-3 space-y-2">
                <p className="text-sm text-gray-800">Seats reserved: <span className="font-semibold">{seats.join(', ')}</span></p>
                <p className="text-sm text-gray-800">Payment: <span className="font-semibold">Rs {amount.toFixed(2)}</span></p>
                <p className="text-sm text-gray-800">Driver: <span className="font-semibold">{ticket.driver}</span></p>
                <p className="text-sm text-gray-800">Conductor: <span className="font-semibold">{ticket.conductor}</span></p>
              </div>
            </section>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-green-50 p-6 flex flex-col items-center justify-center gap-4">
            <div className="bg-white p-4 rounded-3xl shadow">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrValue)}`}
                alt="Ticket QR code"
                className="h-56 w-56"
              />
            </div>
            <p className="text-sm text-gray-600 text-center">Scan this QR code for boarding and ticket validation.</p>
            <button
              onClick={() => window.print()}
              className="w-full rounded-full bg-green-600 px-4 py-3 text-white font-bold hover:bg-green-700 transition"
            >
              Download / Print Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
