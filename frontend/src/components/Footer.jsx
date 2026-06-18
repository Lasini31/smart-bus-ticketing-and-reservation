import React from 'react';

export default function Footer(){
  return (
      <footer className="bg-slate-900 py-4">
        <div className="mx-auto max-w-7xl px-4 border-t border-slate-700 pb-3 ">
          <div className="grid sm:grid-cols-3 gap-8 mt-8">
            <div>
              <div className="flex items-center gap-2 mb-3 ">
                <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                    <rect x="3" y="6" width="18" height="12" rx="3"/>
                    <circle cx="7.5" cy="18" r="1.5"/>
                    <circle cx="16.5" cy="18" r="1.5"/>
                    <path d="M3 10h18" stroke="white" strokeWidth="1.5" fill="none"/>
                  </svg>
                </div>
                <span className="font-bold text-slate-900">BusGo<span className="text-green-600">LK</span></span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">Sri Lanka's smart bus ticketing platform connecting passengers and operators nationwide.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold text-slate-900 mb-2">Passengers</div>
                {["Find Buses","My Bookings","Wallet","Support"].map((l) => (
                  <a key={l} href="#" className="block text-slate-500 hover:text-green-600 transition-colors py-0.5">{l}</a>
                ))}
              </div>
              <div>
                <div className="font-semibold text-slate-900 mb-2">Operators</div>
                {["Register","Dashboard","Routes","Analytics"].map((l) => (
                  <a key={l} href="#" className="block text-slate-500 hover:text-green-600 transition-colors py-0.5">{l}</a>
                ))}
              </div>
            </div>
            <div className="text-sm">
              <div className="font-semibold text-slate-900 mb-2">Contact</div>
              <p className="text-slate-500">support@busgolk.lk</p>
              <p className="text-slate-500">+94 11 234 5678</p>
              <p className="text-slate-500 mt-2 text-xs">Mon to Sat, 7am to 9pm</p>
            </div>
          </div>
          <div className="mt-8 pt-6 text-xs text-slate-400 text-center">
            2025 BusGoLK. All rights reserved.
          </div>
        </div>
      </footer>

  )
}
