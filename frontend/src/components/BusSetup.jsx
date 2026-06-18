import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function BusSetup() {
  const navigate = useNavigate()
  const [busName, setBusName] = useState('')
  const [busNumber, setBusNumber] = useState('')
  const [route, setRoute] = useState('')
  const [time, setTime] = useState('')
  const [driverName, setDriverName] = useState('')
  const [driverPhone, setDriverPhone] = useState('')
  const [conductorName, setConductorName] = useState('')
  const [conductorPhone, setConductorPhone] = useState('')

  const [rows, setRows] = useState(5)
  const [cols, setCols] = useState(4)
  const [seatMap, setSeatMap] = useState(() => createSeatMap(5, 4))

  const [buses, setBuses] = useState([])
  const [message, setMessage] = useState('')

  function createSeatMap(r, c) {
    return Array.from({ length: r }, () => Array.from({ length: c }, () => true))
  }

  function updateSeatMap(r, c) {
    setRows(r)
    setCols(c)
    setSeatMap(createSeatMap(r, c))
  }

  function toggleSeat(rIdx, cIdx) {
    setSeatMap(prev => {
      const copy = prev.map(row => row.slice())
      copy[rIdx][cIdx] = !copy[rIdx][cIdx]
      return copy
    })
  }

  function resetForm() {
    setBusName('')
    setBusNumber('')
    setRoute('')
    setTime('')
    setDriverName('')
    setDriverPhone('')
    setConductorName('')
    setConductorPhone('')
    setRows(5)
    setCols(4)
    setSeatMap(createSeatMap(5, 4))
  }

  function addBus() {
    if (!busName || !busNumber) {
      setMessage('Please provide at least bus name and number')
      return
    }

    const newBus = {
      busName,
      busNumber,
      route,
      time,
      driverName,
      driverPhone,
      conductorName,
      conductorPhone,
      seatMap,
    }

    setBuses(prev => [...prev, newBus])
    setMessage('Bus added to the list')
    resetForm()
  }

  async function saveAll() {
    // send to backend - endpoint depends on backend design
    try {
      const response = await fetch('http://localhost:8081/api/owner/buses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buses }),
      })

      if (response.ok) {
        setMessage('All buses saved successfully')
        navigate('/profile')
      } else {
        const data = await response.json()
        setMessage(data.message || 'Failed to save buses')
      }
    } catch (err) {
      console.error(err)
      setMessage('Server error while saving buses')
    }
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white shadow rounded p-6">
        <h2 className="text-2xl font-bold mb-4">Bus Setup</h2>
        <p className="text-sm text-gray-600 mb-4">Add your buses and configure seat positions, driver and conductor details.</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Bus Name</label>
            <input value={busName} onChange={e => setBusName(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />

            <label className="block text-sm font-medium text-gray-700 mt-3">Bus Number</label>
            <input value={busNumber} onChange={e => setBusNumber(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />

            <label className="block text-sm font-medium text-gray-700 mt-3">Route</label>
            <input value={route} onChange={e => setRoute(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />

            <label className="block text-sm font-medium text-gray-700 mt-3">Time</label>
            <input value={time} onChange={e => setTime(e.target.value)} placeholder="08:00 AM" className="mt-1 block w-full border rounded px-3 py-2" />

            <label className="block text-sm font-medium text-gray-700 mt-3">Driver Name</label>
            <input value={driverName} onChange={e => setDriverName(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />

            <label className="block text-sm font-medium text-gray-700 mt-3">Driver Phone</label>
            <input value={driverPhone} onChange={e => setDriverPhone(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />

            <label className="block text-sm font-medium text-gray-700 mt-3">Conductor Name</label>
            <input value={conductorName} onChange={e => setConductorName(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />

            <label className="block text-sm font-medium text-gray-700 mt-3">Conductor Phone</label>
            <input value={conductorPhone} onChange={e => setConductorPhone(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
          </div>

          <div>
            <div className="flex items-center gap-3 mb-3">
              <label className="text-sm font-medium">Rows</label>
              <input type="number" min={1} value={rows} onChange={e => updateSeatMap(Number(e.target.value || 1), cols)} className="w-20 px-2 py-1 border rounded" />
              <label className="text-sm font-medium">Cols</label>
              <input type="number" min={1} value={cols} onChange={e => updateSeatMap(rows, Number(e.target.value || 1))} className="w-20 px-2 py-1 border rounded" />
            </div>

            <div className="space-y-2">
              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                {seatMap.map((row, rIdx) => (
                  row.map((seat, cIdx) => (
                    <button key={`${rIdx}-${cIdx}`} onClick={() => toggleSeat(rIdx, cIdx)} className={`p-3 border rounded ${seat ? 'bg-green-100' : 'bg-gray-200'}`}>
                      {seat ? 'Seat' : 'X'}
                    </button>
                  ))
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={addBus} className="px-4 py-2 bg-emerald-600 text-white rounded">Add Bus</button>
          <button onClick={saveAll} className="px-4 py-2 border rounded">Save All & Finish</button>
          <button onClick={() => navigate('/profile')} className="px-4 py-2 text-gray-600">Cancel</button>
        </div>

        {message && <div className="mt-4 text-sm text-green-600">{message}</div>}

        {buses.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold">Added buses</h3>
            <ul className="mt-2 space-y-2">
              {buses.map((b, i) => (
                <li key={i} className="p-3 border rounded bg-gray-50">
                  <div className="font-medium">{b.busName} — {b.busNumber}</div>
                  <div className="text-sm text-gray-600">{b.route} • {b.time}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
