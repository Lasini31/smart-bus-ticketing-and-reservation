import { useMemo, useState } from 'react'

const INITIAL_TRANSACTIONS = [
  {
    id: 1,
    label: 'Ticket purchase',
    amount: -740.0,
    date: '2026-05-02',
    status: 'Completed'
  },
  {
    id: 2,
    label: 'Top-up',
    amount: 1200.0,
    date: '2026-04-28',
    status: 'Completed'
  },
  {
    id: 3,
    label: 'Refund',
    amount: 350.0,
    date: '2026-04-20',
    status: 'Completed'
  }
]

const TOP_UP_OPTIONS = [500, 1000, 2000, 5000]

export default function Wallet() {
  const [balance, setBalance] = useState(5440.5)
  const [selectedAmount, setSelectedAmount] = useState(1000)
  const [customTopUp, setCustomTopUp] = useState('')
  const [refundAmount, setRefundAmount] = useState('')
  const [refundReason, setRefundReason] = useState('')
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS)

  const availableSpending = useMemo(() => balance.toFixed(2), [balance])

  const lastTopUp = useMemo(() => {
    const topUpTx = transactions.find(tx => tx.label === 'Top-up' && tx.amount > 0)
    return topUpTx ? topUpTx.amount.toFixed(2) : '0.00'
  }, [transactions])

  function handleTopUp() {
    const amount = Number(customTopUp || selectedAmount)
    if (!amount || amount <= 0) return

    setBalance(prev => Number((prev + amount).toFixed(2)))
    setTransactions(prev => [
      {
        id: prev.length + 1,
        label: 'Top-up',
        amount,
        date: new Date().toISOString().slice(0, 10),
        status: 'Completed'
      },
      ...prev
    ])
    setCustomTopUp('')
    setSelectedAmount(amount)
  }

  function handleRefund() {
    const amount = Number(refundAmount)
    if (!amount || amount <= 0) return

    setBalance(prev => Number((prev - amount).toFixed(2)))
    setTransactions(prev => [
      {
        id: prev.length + 1,
        label: refundReason ? `Refund: ${refundReason}` : 'Refund',
        amount: -amount,
        date: new Date().toISOString().slice(0, 10),
        status: 'Pending'
      },
      ...prev
    ])
    setRefundAmount('')
    setRefundReason('')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 pt-20">
      <div className="max-w-6xl mx-auto space-y-8">
        <section className="rounded-lg bg-white p-8 shadow-md border border-gray-200">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-gray-500">Wallet overview</p>
              <h1 className="mt-3 text-3xl font-bold text-gray-800">My Wallet</h1>
              <p className="mt-2 max-w-xl text-sm text-gray-600">
                Manage your bus balance, top up safely, and review recent transactions in one place.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md border border-gray-200">
              <p className="text-xs text-gray-500">Total balance</p>
              <p className="mt-3 text-4xl font-bold text-green-600">Rs. {availableSpending}</p>
              <p className="mt-1 text-xs text-gray-500">Available for ticket bookings and refunds.</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-md border border-gray-200">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-gray-800">Balance details</h2>
                  <p className="mt-2 text-xs text-gray-500">Top up your wallet before booking tickets.</p>
                </div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                  Active
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                  <p className="text-xs text-gray-500">Current balance</p>
                  <p className="mt-2 text-2xl font-bold text-green-600">Rs. {balance.toFixed(2)}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                  <p className="text-xs text-gray-500">Spent this month</p>
                  <p className="mt-2 text-2xl font-bold text-red-600">Rs. 740.00</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                  <p className="text-xs text-gray-500">Last top-up</p>
                  <p className="mt-2 text-2xl font-bold text-green-600">Rs. {lastTopUp}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md border border-gray-200">
              <h2 className="text-base font-bold text-gray-800">Recent transactions</h2>
              <div className="mt-5 space-y-4">
                {transactions.map(tx => (
                  <div key={tx.id} className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{tx.label}</p>
                      <p className="text-xs text-gray-500">{tx.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className={`text-sm font-bold ${tx.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.amount >= 0 ? '+' : '-'}Rs. {Math.abs(tx.amount).toFixed(2)}
                      </p>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-600">{tx.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-md border border-gray-200">
              <h2 className="text-base font-bold text-gray-800">Top up wallet</h2>
              <p className="mt-2 text-xs text-gray-500">Choose an amount or enter a custom value.</p>

              <div className="mt-6 grid gap-3">
                {TOP_UP_OPTIONS.map(amount => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amount)
                      setCustomTopUp('')
                    }}
                    className={`rounded-full border px-4 py-3 text-left transition ${selectedAmount === amount && !customTopUp ? 'border-green-600 bg-green-600 text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-green-300'}`}>
                    <p className="text-sm font-bold">Rs. {amount}</p>
                    <p className={`mt-1 text-xs ${selectedAmount === amount && !customTopUp ? 'text-white' : 'text-gray-500'}`}>Instant credit to wallet</p>
                  </button>
                ))}
              </div>

              <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <label className="block text-xs font-bold text-gray-700">Custom top-up amount</label>
                <div className="mt-3 flex gap-3">
                  <span className="inline-flex items-center rounded-l-lg border border-r-0 border-gray-200 bg-white px-4 text-sm text-gray-500">Rs.</span>
                  <input
                    type="text"
                    value={customTopUp}
                    onChange={event => {
                      const value = event.target.value.replace(/[^0-9]/g, '')
                      setCustomTopUp(value)
                      if (value) {
                        setSelectedAmount(Number(value))
                      }
                    }}
                    placeholder="Enter amount"
                    className="w-full rounded-r-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none ring-0 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleTopUp}
                className="mt-6 w-full rounded-full bg-green-600 hover:bg-green-700 px-5 py-3 text-sm font-bold text-white transition"
              >
                Top up Rs. {customTopUp || selectedAmount}
              </button>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md border border-gray-200">
              <h2 className="text-base font-bold text-gray-800">Refund request</h2>
              <p className="mt-2 text-xs text-gray-500">Request a refund and credit it back to your wallet instantly.</p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700">Refund amount</label>
                  <div className="mt-2 flex rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                    <span className="text-sm text-gray-500">Rs.</span>
                    <input
                      type="text"
                      value={refundAmount}
                      onChange={event => setRefundAmount(event.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="1000"
                      className="ml-3 w-full bg-transparent text-sm text-gray-800 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700">Reason</label>
                  <input
                    type="text"
                    value={refundReason}
                    onChange={event => setRefundReason(event.target.value)}
                    placeholder="e.g. ticket cancelled"
                    className="mt-2 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleRefund}
                  className="w-full rounded-full bg-green-600 hover:bg-green-700 px-5 py-3 text-sm font-bold text-white transition"
                >
                  Credit refund
                </button>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md border border-gray-200">
              <h2 className="text-base font-bold text-gray-800">Wallet tips</h2>
              <ul className="mt-4 space-y-3 text-xs text-gray-500">
                <li>• Keep a minimum balance for faster ticket booking.</li>
                <li>• Your wallet balance is used automatically during checkout.</li>
                <li>• Refund requests are processed within 24-48 hours.</li>
              </ul>
            </div>
          </aside>
        </section>
      </div>
    </div>
  )
}
