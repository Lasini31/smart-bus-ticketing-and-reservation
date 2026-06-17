export default function Bookings(){
  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <div className="mx-auto max-w-4xl bg-white p-8 rounded-2xl shadow">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <p className="mt-2 text-sm text-slate-600">Your past and upcoming bookings will appear here (demo data).</p>

        <div className="mt-6 space-y-4">
          <div className="p-4 border rounded">No bookings yet in demo mode.</div>
        </div>
      </div>
    </main>
  )
}
