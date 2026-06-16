import React from 'react';

export default function Footer(){
  return (
    <footer className="bg-gray-900 text-gray-200 mt-8">
      <div className="max-w-6xl mx-auto py-8 px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="font-bold text-lg">Smart Bus</h4>
          <p className="text-sm text-gray-400 mt-2">Modern bus ticketing and reservation system.</p>
          <p className="text-xs text-gray-500 mt-3">© {new Date().getFullYear()} Smart Bus. All rights reserved.</p>
        </div>

        <div>
          <h4 className="font-bold text-lg">Contact</h4>
          <p className="text-sm text-gray-400 mt-2">Email: support@smartbus.example</p>
          <p className="text-sm text-gray-400">Phone: +94 11 123 4567</p>
          <p className="text-sm text-gray-400 mt-2">Office: 123 Bus St, Colombo</p>
        </div>

        <div>
          <h4 className="font-bold text-lg">Developer</h4>
          <p className="text-sm text-gray-400 mt-2">Developed by: Your Dev Team</p>
          <p className="text-sm text-gray-400">GitHub: github.com/yourdev</p>
          <p className="text-sm text-gray-400 mt-2">For partnerships and API access contact the developer email above.</p>
        </div>
      </div>
    </footer>
  )
}
