import { useState, useEffect, useCallback } from "react";

const SLIDES = [
  {
    url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1600&q=80",
    label: "Comfortable Long-Distance Travel",
    sub: "Modern fleet with reclining seats, AC & WiFi on every route",
  },
  {
    url: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1600&q=80",
    label: "Explore Sri Lanka by Road",
    sub: "Hundreds of routes connecting cities, towns & scenic destinations",
  },
  {
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80",
    label: "Book Your Seat in Seconds",
    sub: "Real-time seat selection, instant confirmation & digital tickets",
  },
  {
    url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80",
    label: "Your Journey, Your Way",
    sub: "Flexible schedules, easy rebooking & 24/7 customer support",
  },
];

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <rect x="3" y="4" width="18" height="14" rx="3" />
        <path d="M3 8h18M8 4v4M16 4v4" />
        <circle cx="8" cy="14" r="1.2" fill="currentColor" />
        <circle cx="16" cy="14" r="1.2" fill="currentColor" />
      </svg>
    ),
    title: "Visual Seat Picker",
    desc: "Choose your exact seat from a live bus layout before you pay.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
    title: "Live Route Tracking",
    desc: "Track your bus in real-time so you are never left waiting.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M9 9h6M9 13h6M9 17h3" />
        <path d="M8 3v3h8V3" strokeLinejoin="round" />
      </svg>
    ),
    title: "QR Digital Tickets",
    desc: "Download your ticket instantly and board without paper.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <rect x="2" y="7" width="20" height="13" rx="2" />
        <path d="M16 7V5a4 4 0 0 0-8 0v2" />
        <circle cx="12" cy="13.5" r="1.5" fill="currentColor" />
      </svg>
    ),
    title: "Secure Wallet",
    desc: "Top up once, pay instantly for every trip with zero fees.",
  },
];

const POPULAR_ROUTES = [
  { from: "Colombo", to: "Kandy", duration: "2h 30m", price: "350", tag: "Most Popular" },
  { from: "Colombo", to: "Galle", duration: "2h 15m", price: "280", tag: "Scenic" },
  { from: "Kandy", to: "Nuwara Eliya", duration: "1h 45m", price: "220", tag: "Hill Country" },
  { from: "Colombo", to: "Jaffna", duration: "6h 30m", price: "750", tag: "Long Distance" },
  { from: "Galle", to: "Matara", duration: "0h 50m", price: "120", tag: "Express" },
  { from: "Colombo", to: "Anuradhapura", duration: "4h 00m", price: "600", tag: "Heritage" },
];

export default function Home() {
  // FIX 2: separate slide index from a "transitioning" flag used only for text animation
  const [current, setCurrent] = useState(0);
  const [textKey, setTextKey] = useState(0); // triggers text re-animation only
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  const goTo = useCallback((idxOrFn) => {
    setCurrent((prev) => {
      const next = typeof idxOrFn === "function" ? idxOrFn(prev) : idxOrFn;
      // kick text animation without touching image opacity
      setTextKey((k) => k + 1);
      return next;
    });
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      goTo((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(t);
  }, [goTo]);

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ─── HERO SLIDER ──────────────────────────────────────────────
          FIX 1: height is 75vh (3/4 screen), full width
          FIX 2: all images always rendered; CSS crossfade via opacity
                 transition — no "fading" state that blanks the image
          FIX 3: search bar lives in its own fixed-position layer so
                 text animation never shifts it
      ──────────────────────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden" style={{ height: "75vh", minHeight: 480 }}>

        {/* IMAGE STACK — FIX 2: plain CSS crossfade, no blank frame */}
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${slide.url})`,
              opacity: i === current ? 1 : 0,
              transition: "opacity 800ms ease-in-out",
              zIndex: i === current ? 1 : 0,
            }}
          />
        ))}

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/65 z-10" />

        {/* TEXT LAYER — FIX 3: anchored to upper-centre, animates independently */}
        <div className="absolute inset-x-0 top-0 z-20 flex flex-col items-center justify-center px-4 text-center"
             style={{ height: "55%" }}>
          <div key={textKey} style={{ animation: "fadeSlideUp 0.6s ease both" }}>
            <span className="inline-block rounded-full bg-green-500/20 border border-green-400/40 px-4 py-1 text-xs font-semibold text-green-300 tracking-widest uppercase mb-4 backdrop-blur-sm">
              Sri Lanka's #1 Bus Platform
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight max-w-3xl">
              {SLIDES[current].label}
            </h1>
            <p className="mt-3 text-base sm:text-lg text-white/75 max-w-xl mx-auto">
              {SLIDES[current].sub}
            </p>
          </div>
        </div>

        {/* SEARCH BAR LAYER — FIX 3: fixed at bottom-centre of hero, never moves */}
        <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center px-4 pb-8">
          <div className="w-full max-w-4xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col bg-white rounded-xl px-4 py-3 gap-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">From</label>
                <input
                  type="text"
                  placeholder="Origin city..."
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="text-slate-900 font-semibold text-sm outline-none bg-transparent placeholder-slate-400"
                />
              </div>
              <div className="flex flex-col bg-white rounded-xl px-4 py-3 gap-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">To</label>
                <input
                  type="text"
                  placeholder="Destination city..."
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="text-slate-900 font-semibold text-sm outline-none bg-transparent placeholder-slate-400"
                />
              </div>
              <div className="flex flex-col bg-white rounded-xl px-4 py-3 gap-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Travel Date</label>
                <input
                  type="date"
                  min={today}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="text-slate-900 font-semibold text-sm outline-none bg-transparent"
                />
              </div>
            </div>
            <div className="mt-3">
              <a
                href={`/booking?from=${from}&to=${to}&date=${date}`}
                className="block w-full text-center rounded-xl bg-green-600 hover:bg-green-700 transition-all text-white font-bold py-3.5 text-base shadow-lg shadow-green-900/30"
              >
                Search Available Buses
              </a>
            </div>
          </div>

          {/* Slide dots */}
          <div className="flex gap-2 mt-4">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "bg-green-400 w-8" : "bg-white/40 w-3 hover:bg-white/60"}`}
              />
            ))}
          </div>
        </div>

        {/* Prev / Next arrows */}
        <button
          onClick={() => goTo((current - 1 + SLIDES.length) % SLIDES.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button
          onClick={() => goTo((current + 1) % SLIDES.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </section>

      {/* ─── FIX 4: USER LOGIN BUTTON — sits between hero and stats bar ─── */}
      <div className="bg-white border-b border-slate-100 py-3 px-4">
        <div className="mx-auto max-w-7xl flex items-center justify-end gap-3">
          <span className="text-sm text-slate-500">Already have an account?</span>
          <a
            href="/login"
            className="inline-flex items-center gap-2 rounded-full border border-green-600 text-green-700 hover:bg-green-600 hover:text-white transition-all font-semibold text-sm px-5 py-2"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
            Sign In
          </a>
          <a
            href="/register"
            className="inline-flex items-center gap-2 rounded-full bg-green-600 hover:bg-green-700 transition-all text-white font-semibold text-sm px-5 py-2 shadow-sm"
          >
            Create Account
          </a>
        </div>
      </div>

      {/* STATS BAR */}
      <section className="bg-green-600 py-5">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-green-500">
            {[
              { n: "500+", label: "Daily Routes" },
              { n: "1.2M+", label: "Happy Passengers" },
              { n: "200+", label: "Partner Buses" },
              { n: "99.8%", label: "On-time Rate" },
            ].map((s) => (
              <div key={s.label} className="text-center px-4 py-2">
                <div className="text-2xl font-black text-white">{s.n}</div>
                <div className="text-xs text-green-200 font-medium mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest uppercase text-green-600">Why BusGoLK</span>
            <h2 className="mt-2 text-3xl lg:text-4xl font-black text-slate-900">Everything you need in one app</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md hover:border-green-200 transition-all duration-200">
                <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors duration-200">
                  {f.icon}
                </div>
                <h3 className="font-bold text-slate-900 text-base">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR ROUTES */}
      <section className="py-20 bg-green-50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-green-600">Routes</span>
              <h2 className="mt-1 text-3xl font-black text-slate-900">Popular journeys</h2>
            </div>
            <a href="/routes" className="text-sm font-semibold text-green-600 hover:text-green-700 transition-colors">View all</a>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {POPULAR_ROUTES.map((r) => (
              <a
                key={`${r.from}-${r.to}`}
                href={`/booking?from=${r.from}&to=${r.to}`}
                className="group flex items-center justify-between rounded-2xl bg-white border border-slate-100 p-5 shadow-sm hover:shadow-md hover:border-green-300 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 border-2 border-green-200" />
                    <div className="w-px h-6 bg-green-200 my-1" />
                    <div className="w-2 h-2 rounded-full bg-slate-400 border-2 border-slate-200" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{r.from}</div>
                    <div className="text-xs text-slate-400 my-0.5">{r.duration}</div>
                    <div className="font-bold text-slate-900 text-sm">{r.to}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block rounded-full bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 mb-2">{r.tag}</span>
                  <div className="text-xs text-slate-400">from</div>
                  <div className="text-lg font-black text-green-600">Rs. {r.price}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest uppercase text-green-600">Simple Process</span>
            <h2 className="mt-2 text-3xl lg:text-4xl font-black text-slate-900">Book a ticket in 3 steps</h2>
          </div>
          <div className="relative grid sm:grid-cols-3 gap-8">
            {[
              { title: "Search your route", desc: "Enter origin, destination and travel date to see available buses instantly.", icon: "🔍", n: "1" },
              { title: "Pick your seat", desc: "View a live seat map and select your preferred seat before checkout.", icon: "💺", n: "2" },
              { title: "Pay and ride", desc: "Pay via wallet or card, get your QR ticket and board at the terminal.", icon: "🎫", n: "3" },
            ].map((s) => (
              <div key={s.n} className="relative flex flex-col items-center text-center">
                <div className="relative w-20 h-20 rounded-2xl bg-green-50 border-2 border-green-100 flex items-center justify-center text-3xl mb-4 z-10">
                  {s.icon}
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-600 text-white text-xs font-black flex items-center justify-center">{s.n}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-500 max-w-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OWNER CTA */}
      <section className="py-16 bg-slate-900">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-green-400">For bus operators</span>
              <h2 className="mt-2 text-2xl lg:text-3xl font-black text-white">Grow your passenger count with BusGoLK</h2>
              <p className="mt-3 text-slate-400 max-w-lg text-sm leading-relaxed">
                List your buses, set routes and schedules, and let thousands of commuters find and book your seats — all managed from a simple operator dashboard.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a href="/owner-register" className="rounded-full bg-green-600 hover:bg-green-500 transition-colors px-6 py-3 text-white font-bold text-sm text-center">
                Register as Operator
              </a>
              <a href="/owner-info" className="rounded-full border border-slate-600 hover:border-slate-400 transition-colors px-6 py-3 text-slate-300 font-semibold text-sm text-center">
                Learn more
              </a>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}