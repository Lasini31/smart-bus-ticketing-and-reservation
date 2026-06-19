import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Lock, Wallet } from "lucide-react"
import { useWallet } from '../contexts/WalletContext.jsx'
import { useStripeCheckout } from "./useStripeCheckout"

export default function PaymentPage() {
    const navigate = useNavigate()
    const { state: locationState } = useLocation()
    const { balance, setBalanceFromServer } = useWallet()
    
    const [amount, setAmount] = useState(locationState?.amount ? String(locationState.amount) : '')
    const [errors, setErrors] = useState({})
    const [showPopup, setShowPopup] = useState(false)
    const [popupMessage, setPopupMessage] = useState({ success: false, text: '' })
    const [newBalance, setNewBalance] = useState(null)

    const handleSuccessCallback = (updatedBalance, topUpAmount) => {
        setBalanceFromServer(updatedBalance, topUpAmount)
        setNewBalance(updatedBalance)
        setPopupMessage({
            success: true,
            text: `LKR ${Number(topUpAmount).toFixed(2)} has been added to your wallet!`,
        })
        setShowPopup(true)
    }

    const { redirectToCheckout, isLoading, isPolling, error, setError } = 
        useStripeCheckout(handleSuccessCallback)

    useEffect(() => {
        if (error) {
            setPopupMessage({ success: false, text: error })
            setShowPopup(true)
        }
    }, [error])

    const handleAmountChange = (e) => {
        const value = e.target.value
        if (/^\d*\.?\d{0,2}$/.test(value)) {
            setAmount(value)
        }
    }

    const handleFormSubmit = () => {
        const parsedAmount = parseFloat(amount)

        if (!amount || parsedAmount <= 0) {
            setErrors({ amount: 'Please enter a valid amount' })
            return
        }
        if (parsedAmount < 100) {
            setErrors({ amount: 'Minimum top-up amount is LKR 100' })
            return
        }
        if (parsedAmount > 50000) {
            setErrors({ amount: 'Maximum top-up amount is LKR 50,000' })
            return
        }

        setErrors({})
        redirectToCheckout(amount)
    }

    const handlePopupClose = () => {
        setShowPopup(false)
        setError(null)
        navigate('/wallet')
    }

    if (isPolling) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Verifying your payment...</h2>
                    <p className="text-sm text-gray-500">Please wait. Do not close this page.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen">
            {/* Left Panel — desktop only */}
            <div className="hidden lg:block relative w-2/5 min-h-screen">
                <svg viewBox="0 0 400 800" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                    <path d="M0,0 L320,0 Q400,400 320,800 L0,800 Z" fill="#22c55e"/>
                </svg>
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-white gap-6 px-10">
                    <Lock size={48}/>
                    <p className="text-3xl font-semibold">Secure</p>
                    <p className="text-5xl font-extrabold">Payment</p>

                    {/* Wallet balance card */}
                    <div className="mt-8 bg-white/20 backdrop-blur-sm rounded-2xl px-8 py-6 text-center w-full max-w-[220px]">
                        <Wallet size={28} className="mx-auto mb-2"/>
                        <p className="text-sm font-medium opacity-80">Current Balance</p>
                        <p className="text-3xl font-extrabold mt-1">
                            LKR {balance.toFixed(2)}
                        </p>
                    </div>

                    <p className="text-sm opacity-70 text-center mt-4">
                        Top up your wallet to book your next journey
                    </p>
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex-1 px-6 sm:px-10 py-10 max-w-2xl mx-auto w-full flex flex-col justify-center">
                <h2 className="text-2xl font-bold mb-2">Top Up Wallet</h2>
                <p className="text-gray-500 text-sm mb-8">
                    Enter an amount and you'll be securely redirected to Stripe to complete the payment.
                </p>

                {/* Mobile responsive balance helper banner */}
                <div className="lg:hidden flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-6">
                    <Wallet size={20} className="text-green-600" />
                    <div>
                        <p className="text-xs text-gray-500">Current Balance</p>
                        <p className="text-lg font-bold text-green-700">LKR {balance.toFixed(2)}</p>
                    </div>
                </div>

                {/* Amount Input layout */}
                <div className="mb-8">
                    <label className="text-sm font-semibold text-gray-700">Top-up Amount (LKR)</label>
                    <input
                        type="text"
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder="Enter amount (min. 100)"
                        className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg font-semibold"
                    />
                    {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                    <p className="text-xs text-gray-400 mt-1">Min: LKR 100 &nbsp;|&nbsp; Max: LKR 50,000</p>
                </div>

                {/* Stripe Information Card Banner */}
                <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                    </svg>
                    <p className="text-xs text-blue-700">
                        After clicking "Proceed to Payment", you'll be redirected to Stripe's secure checkout page to enter your card details. We never store your card information.
                    </p>
                </div>

                <button
                    onClick={handleFormSubmit}
                    disabled={isLoading}
                    className="w-full mt-2 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Creating session...
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                            </svg>
                            Proceed to Payment · LKR {amount || '0'}
                        </>
                    )}
                </button>
            </div>

            {/* Unified Outcome Dialog Popup */}
            {showPopup && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl px-8 py-8 max-w-sm w-full mx-4 text-center shadow-xl">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${popupMessage.success ? 'bg-green-100' : 'bg-red-100'}`}>
                            {popupMessage.success ? <span className="text-3xl text-green-600">✓</span> : <span className="text-3xl text-red-500">✕</span>}
                        </div>

                        <h3 className={`text-xl font-bold mb-2 ${popupMessage.success ? 'text-green-600' : 'text-red-500'}`}>
                            {popupMessage.success ? 'Payment Successful!' : 'Payment Failed'}
                        </h3>
                        <p className="text-gray-500 text-sm mb-6">{popupMessage.text}</p>

                        {popupMessage.success && newBalance !== null && (
                            <div className="bg-green-50 rounded-xl px-4 py-3 mb-6">
                                <p className="text-xs text-gray-500">New Wallet Balance</p>
                                <p className="text-2xl font-extrabold text-green-700">LKR {Number(newBalance).toFixed(2)}</p>
                            </div>
                        )}

                        <button
                            onClick={handlePopupClose}
                            className={`w-full py-3 rounded-lg font-semibold text-white transition ${popupMessage.success ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 hover:bg-red-600'}`}
                        >
                            {popupMessage.success ? 'Go to Wallet' : 'Back to Wallet'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}