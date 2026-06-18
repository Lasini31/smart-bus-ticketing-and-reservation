// src/pages/Wallet.jsx
import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../contexts/WalletContext.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'

const TOP_UP_OPTIONS = [500, 1000, 2000, 5000]

export default function Wallet() {
  const { 
    balance, 
    transactions, 
    refund, 
    cancelBooking, 
    loading, 
    error,
    refreshWallet 
  } = useWallet()
  const { 
    isAuthenticated, 
    userId, 
    token,
    loading: authLoading,
    user 
  } = useAuth()
  const navigate = useNavigate()

  const [selectedAmount, setSelectedAmount] = useState(1000)
  const [customTopUp, setCustomTopUp] = useState('')
  const [refundAmount, setRefundAmount] = useState('')
  const [refundReason, setRefundReason] = useState('')
  const [visibleCount, setVisibleCount] = useState(20)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // Check authentication and redirect
  useEffect(() => {
    // Wait for auth to load
    if (!authLoading) {
      setIsCheckingAuth(false)
      if (!isAuthenticated) {
        navigate('/login', { state: { redirectTo: '/wallet' } })
      }
    }
  }, [isAuthenticated, authLoading, navigate])

  // Refresh wallet data when authenticated
  useEffect(() => {
    if (isAuthenticated && userId && token && !authLoading) {
      refreshWallet()
    }
  }, [isAuthenticated, userId, token, authLoading, refreshWallet])

  const availableSpending = useMemo(() => balance.toFixed(2), [balance])

  const lastTopUp = useMemo(() => {
    const topUpTx = transactions.find(tx => tx.label === 'Top-up' && tx.amount > 0)
    return topUpTx ? topUpTx.amount.toFixed(2) : '0.00'
  }, [transactions])

  const spentThisMonth = useMemo(() => {
    const now = new Date()
    const month = now.getMonth()
    const year = now.getFullYear()

    return transactions.reduce((sum, tx) => {
      if (tx.amount >= 0 || tx.status === 'Cancelled') return sum
      const txDate = new Date(tx.date)
      if (txDate.getMonth() !== month || txDate.getFullYear() !== year) return sum
      return sum + Math.abs(tx.amount)
    }, 0)
  }, [transactions])

  // Get current visible history chunk
  const visibleTransactions = useMemo(() => {
    return transactions.slice(0, visibleCount)
  }, [transactions, visibleCount])

  function handleTopUp() {
    const amount = Number(customTopUp || selectedAmount)
    if (!amount || amount <= 0) return

    setCustomTopUp('')
    setSelectedAmount(amount)
    navigate('/payment', { state: { amount } })
  }

  async function handleRefund() {
    const amount = Number(refundAmount)
    if (!amount || amount <= 0) {
      alert('Please enter a valid refund amount')
      return
    }

    if (amount > balance) {
      alert('Refund amount cannot exceed current balance')
      return
    }

    setIsProcessing(true)
    try {
      await refund(amount, refundReason || 'Manual refund')
      setRefundAmount('')
      setRefundReason('')
      alert('Refund processed successfully!')
    } catch (err) {
      alert(err.message || 'Failed to process refund')
    } finally {
      setIsProcessing(false)
    }
  }

  async function handleCancelBooking() {
    if (!cancelReason.trim()) {
      alert('Please enter a cancellation reason')
      return
    }

    if (selectedTransaction) {
      setIsProcessing(true)
      try {
        await cancelBooking(selectedTransaction.id, cancelReason)
        alert('Booking cancelled and refund processed successfully!')
        setShowCancelModal(false)
        setCancelReason('')
        setSelectedTransaction(null)
      } catch (err) {
        alert(err.message || 'Failed to cancel booking')
      } finally {
        setIsProcessing(false)
      }
    }
  }

  // Show loading while checking auth
  if (isCheckingAuth || authLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, show nothing (will redirect)
  if (!isAuthenticated) {
    return null
  }

  // Show wallet loading state
  if (loading && transactions.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading wallet data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* FIXED POSITION OVERVIEW HEADER */}
        <header className="rounded-2xl bg-white p-6 lg:p-8 shadow-sm border border-gray-100">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Active Account
              </span>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">My Digital Wallet</h1>
              <p className="mt-2 text-sm text-gray-500 max-w-xl">
                Manage balances, configure secure top-ups, and keep track of your direct ticket bookings natively.
              </p>
            </div>
            <div className="rounded-xl bg-white text-gray-800 p-6 shadow-md border border-gray-200 min-w-[280px]">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Available Balance</p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-green-600">Rs. {availableSpending}</p>
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>Secure Gateway Active</span>
                <svg className="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944a11.954 11.954 0 007.834 3.056c.11.653.166 1.322.166 2.00 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.678.056-1.347.166-2zm9.834 4.001a1 1 0 10-2 0v3a1 1 0 102 0v-3z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN DASHBOARD CONTAINER */}
        <main className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] items-start">
          
          {/* LEFT SECTION: FIXED METRICS & SEPARATELY SCROLLABLE HISTORY */}
          <div className="space-y-6">
            
            {/* FIXED METRICS BAR */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Balance Breakdown</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                  <p className="text-xs font-medium text-gray-500">Net Wallet Value</p>
                  <p className="mt-1.5 text-xl font-bold text-gray-800">Rs. {balance.toFixed(2)}</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                  <p className="text-xs font-medium text-gray-500">Spent This Month</p>
                  <p className="mt-1.5 text-xl font-bold text-red-600">Rs. {spentThisMonth.toFixed(2)}</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                  <p className="text-xs font-medium text-gray-500">Last Registered Top-Up</p>
                  <p className="mt-1.5 text-xl font-bold text-green-600">Rs. {lastTopUp}</p>
                </div>
              </div>
            </div>

            {/* SEPARATELY SCROLLABLE RECENT TRANSACTIONS PANEL */}
            <div className="rounded-2xl bg-white shadow-sm border border-gray-100 flex flex-col overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Transaction Ledger</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Showing past logs and adjustments</p>
                </div>
                <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">
                  {transactions.length} Total Logs
                </span>
              </div>

              {/* INDEPENDENT INTERNAL SCROLL BOX */}
              <div
                className="
                  overflow-y-auto
                  max-h-[700px]
                  p-5
                  space-y-3
                  bg-gray-50/30
                  scrollbar-thin
                  scrollbar-thumb-gray-400
                  scrollbar-track-gray-100
                "
              >
                {visibleTransactions.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 text-sm">
                    No transactions captured yet.
                  </div>
                ) : (
                  visibleTransactions.map(tx => (
                    <div 
                      key={tx.id} 
                      className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between hover:border-gray-200 transition-colors shadow-2xs"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`p-2.5 rounded-xl ${tx.amount >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                          {tx.amount >= 0 ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25"/></svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"/></svg>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{tx.label}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{tx.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4 flex-wrap border-t sm:border-0 pt-3 sm:pt-0 border-gray-100">
                        <p className={`text-sm font-bold tracking-tight ${tx.amount >= 0 ? 'text-green-600' : 'text-gray-900'}`}>
                          {tx.amount >= 0 ? '+' : '-'} Rs. {Math.abs(tx.amount).toFixed(2)}
                        </p>
                        {!(
                          tx.label.toLowerCase().includes('bus') ||
                          tx.label.toLowerCase().includes('ticket') ||
                          tx.label.toLowerCase().includes('booking')
                        ) && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tx.status === 'Completed' ? 'bg-gray-100 text-gray-700' : 'bg-amber-50 text-amber-700'}`}>
                            {tx.status}
                          </span>
                        )}
                        {(
                          tx.label.toLowerCase().includes('bus') ||
                          tx.label.toLowerCase().includes('ticket') ||
                          tx.label.toLowerCase().includes('booking')
                        ) && (
                          tx.status === 'Cancelled' ? (
                            <span
                              className="
                                px-3 py-1.5
                                rounded-lg
                                text-xs
                                font-semibold
                                bg-gray-100
                                text-gray-500
                                border
                                border-gray-200
                                cursor-not-allowed
                              "
                            >
                              Booking Cancelled
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedTransaction(tx)
                                setShowCancelModal(true)
                              }}
                              disabled={isProcessing}
                              className="
                                px-3 py-1.5
                                rounded-lg
                                text-xs
                                font-semibold
                                bg-red-50
                                text-red-600
                                border
                                border-red-200
                                hover:bg-red-100
                                transition
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                              "
                            >
                              Cancel Booking
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  ))
                )}

                {/* PAGINATION SEE MORE ACTION */}
                {transactions.length > visibleCount && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setVisibleCount(prev => prev + 20)}
                      className="w-full py-3 rounded-xl border border-dashed border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <span>Load More History</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR: COMPLETELY FIXED ON DESKTOP VIEWPORTS */}
          <aside className="lg:sticky lg:top-24 space-y-6">
            
            {/* SECURE TOP UP MODULE */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900">Secure Top-Up</h2>
                <div className="flex items-center gap-1 text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                  <span>256-Bit SSL</span>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-400">Select preset credit or input specialized limits below.</p>

              <div className="mt-5 grid grid-cols-2 gap-2.5">
                {TOP_UP_OPTIONS.map(amount => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amount)
                      setCustomTopUp('')
                    }}
                    className={`rounded-xl border p-3 text-left transition-all ${selectedAmount === amount ? 'border-green-600 bg-green-600 text-white shadow-md shadow-green-600/10' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'}`}
                    disabled={isProcessing}
                  >
                    <p className="text-sm font-bold">Rs. {amount}</p>
                    <p className={`text-[10px] mt-0.5 ${selectedAmount === amount ? 'text-gray-300' : 'text-gray-400'}`}>Instant Load</p>
                  </button>
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-3.5">
                <label className="block text-xs font-semibold text-gray-600">Custom Allocation Amount</label>
                <div className="mt-2 flex shadow-2xs rounded-lg overflow-hidden border border-gray-200 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/10 transition-all bg-white">
                  <span className="inline-flex items-center bg-gray-50 px-3.5 text-sm font-medium text-gray-400 border-r border-gray-200">Rs.</span>
                  <input
                    type="text"
                    value={customTopUp}
                    onChange={event => {
                      const value = event.target.value
                      if (/^\d*\.?\d{0,2}$/.test(value)) {
                        setCustomTopUp(value)
                        if (value && value !== '.') {
                          setSelectedAmount(Number(value))
                        } else {
                          setSelectedAmount(TOP_UP_OPTIONS[0])
                        }
                      }
                    }}
                    placeholder="Enter Custom Value"
                    className="w-full bg-transparent px-3 py-2.5 text-sm text-gray-800 outline-none"
                    disabled={isProcessing}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleTopUp}
                disabled={isProcessing}
                className="mt-5 w-full rounded-xl bg-green-600 hover:bg-green-700 px-4 py-3 text-sm font-semibold text-white transition shadow-sm shadow-green-600/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Authorize Top-Up · Rs. {customTopUp || selectedAmount}</span>
              </button>
            </div>

            {/* ENHANCED SECURE REFUND FLOW */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900">Refund Processing</h2>
                <div className="flex items-center gap-1 text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded">
                  <span>Protected</span>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-400">Initiate internal dynamic refund procedures instantly.</p>

              <div className="mt-5 space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-600">Refund Aggregate Target</label>
                  <div className="mt-2 flex shadow-2xs rounded-lg overflow-hidden border border-gray-200 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/10 transition-all bg-white">
                    <span className="inline-flex items-center bg-gray-50 px-3.5 text-sm font-medium text-gray-400 border-r border-gray-200">Rs.</span>
                    <input
                      type="text"
                      value={refundAmount}
                      onChange={event => {
                        const value = event.target.value;
                        if (/^\d*\.?\d{0,2}$/.test(value)) {
                          setRefundAmount(value);
                        }
                      }}
                      placeholder="e.g. 1000"
                      className="w-full bg-transparent px-3 py-2.5 text-sm text-gray-800 outline-none"
                      disabled={isProcessing}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600">Audit Reason / Order Reference</label>
                  <input
                    type="text"
                    value={refundReason}
                    onChange={event => setRefundReason(event.target.value)}
                    placeholder="e.g. Booking Cancellation"
                    className="mt-2 w-full rounded-lg border border-gray-200 shadow-2xs px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 transition-all bg-white"
                    disabled={isProcessing}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleRefund}
                  disabled={isProcessing}
                  className="w-full rounded-xl bg-green-600 hover:bg-green-700 px-4 py-3 text-sm font-semibold text-white transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                  <span>Credit Verified Refund</span>
                </button>
              </div>
            </div>

            {/* SYSTEM DOCUMENTATION NOTICE */}
            <div className="rounded-2xl bg-white border border-gray-200 p-5 text-gray-800 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Compliance & Guardrails</h3>
              <ul className="mt-3.5 space-y-2.5 text-xs text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold">•</span>
                  <span>Wallets balance configuration auto-deducts during active checkouts.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold">•</span>
                  <span>Refund audits complete securely across standard payment channels within 24-48 hrs.</span>
                </li>
              </ul>
            </div>
          </aside>
        </main>
      </div>

      {/* Cancel Booking Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                Cancel Booking
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Please provide a reason for cancellation.
              </p>
            </div>

            <div className="p-6">
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Type cancellation reason..."
                rows={4}
                className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                disabled={isProcessing}
              />
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button
                onClick={() => {
                  setShowCancelModal(false)
                  setCancelReason('')
                  setSelectedTransaction(null)
                }}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                disabled={isProcessing}
              >
                Close
              </button>

              <button
                onClick={handleCancelBooking}
                disabled={isProcessing}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Confirm Cancellation'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}