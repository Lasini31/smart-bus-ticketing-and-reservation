import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-lg shadow-slate-200">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="mt-2 text-sm text-slate-500">Review your account, manage bookings, and open the wallet.</p>
        </div>

        <section className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-slate-900">Account details</h2>
            <p className="mt-3 text-sm text-slate-600">This demo stores user state locally in your browser.</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li>• User role: Passenger</li>
              <li>• Booking history: simulated</li>
              <li>• Wallet balance: shown in Wallet page</li>
            </ul>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <button
              onClick={() => navigate('/booking')}
              className="rounded-3xl bg-emerald-600 px-5 py-4 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Search buses
            </button>
            <button
              onClick={() => navigate('/wallet')}
              className="rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Go to Wallet
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}
