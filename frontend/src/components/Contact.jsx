export default function Contact(){
  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <div className="mx-auto max-w-3xl bg-white p-8 rounded-2xl shadow">
        <h1 className="text-2xl font-bold">Contact Support</h1>
        <p className="mt-2 text-sm text-slate-600">For issues or questions, email support@smartbus.example or call +94 11 123 4567.</p>

        <form className="mt-6 grid gap-4">
          <input placeholder="Your name" className="border rounded px-4 py-2" />
          <input placeholder="Email" className="border rounded px-4 py-2" />
          <textarea placeholder="Message" className="border rounded px-4 py-2 h-28" />
          <button className="rounded bg-emerald-600 text-white px-4 py-2">Send message</button>
        </form>
      </div>
    </main>
  )
}
