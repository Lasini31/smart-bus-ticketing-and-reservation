import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Lock, Wallet, Loader2 } from "lucide-react"
import { useStripeCheckout } from "../hooks/useStripeCheckout"

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081"

export default function PaymentPage() {
    const navigate = useNavigate()
    const location = useLocation()
    
    const [amount, setAmount] = useState(location.state?.amount || '')
    const [walletBalance, setWalletBalance] = useState(0.00)
    const [showPopup, setShowPopup] = useState(false)
    const [popupMessage, setPopupMessage] = useState({ success: true, text: '' })

    const currentPassengerId = localStorage.getItem("userId")
    const sessionToken = localStorage.getItem("token")

    const handleSuccessCallback = (newBalance, topUpAmount) => {
        setWalletBalance(newBalance)
        setPopupMessage({
            success: true,
            text: `LKR ${topUpAmount.toFixed(2)} successfully added to your wallet!`,
        })
        setShowPopup(true)
    }

    const { redirectToCheckout, isLoading, isPolling, error, setError } = 
        useStripeCheckout(sessionToken, handleSuccessCallback)

    useEffect(() => {
        if (error) {
            setPopupMessage({ success: false, text: error })
            setShowPopup(true)
        }
    }, [error])

    useEffect(() => {
        if (!currentPassengerId) {
            return
        }
        fetch(`${BASE_URL}/wallet/${currentPassengerId}`, {
            headers: { "Authorization": `Bearer ${sessionToken}` }
        })
        .then(res => res.json())
        .then(data => setWalletBalance(data.balance || 0.00))
        .catch(console.error)
    }, [currentPassengerId, sessionToken])

    const handleFormSubmit = () => {
        if (!amount || parseFloat(amount) < 100) {
            return
        }
        redirectToCheckout(amount)
    }

    return (
        <div className="flex min-h-screen">
            {/* Left Panel */}
            <div className="hidden lg:block relative w-2/5 min-h-screen bg-green-500 text-white flex flex-col items-center justify-center p-10">
                <Lock size={48} className="mb-4" />
                <p className="text-3xl font-semibold">Secure Payment</p>
                <div className="mt-8 bg-white/20 p-6 rounded-2xl text-center w-full max-w-[200px]">
                    <Wallet className="mx-auto mb-2" />
                    <p className="text-sm opacity-80">Balance</p>
                    <p className="text-2xl font-bold">LKR {walletBalance.toFixed(2)}</p>
                </div>
            </div>

            {/*Right Panel */}
            <div className="flex-1 px-6 py-10 max-w-2xl mx-auto w-full flex flex-col justify-center">
                {isPolling ? (
                    <div className="text-center flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
                        <h2 className="text-2xl font-bold">Verifying payment...</h2>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold mb-6">Top Up Wallet</h2>
                        <input
                            type="text"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full border p-3 rounded-lg text-lg mb-6"
                            placeholder="Enter amount"
                        />
                        <button
                            onClick={handleFormSubmit}
                            disabled={isLoading}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">
                            {isLoading ? 'Redirecting to Stripe...' : 'Proceed to Payment'}
                        </button>
                    </>
                )}
            </div>

            {showPopup && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-2xl text-center max-w-sm w-full">
                        <h3 className="text-xl font-bold mb-4">{popupMessage.success ? 'Success!' : 'Failed'}</h3>
                        <p className="text-sm text-gray-500 mb-6">{popupMessage.text}</p>
                        <button onClick={() => { 
                            setShowPopup(false) 
                            setError(null)
                            if(popupMessage.success) {
                                navigate('/wallet')
                            }
                            }} className="w-full bg-green-600 text-white py-2 rounded-lg">Done</button>
                    </div>
                </div>
            )}
        </div>
    )
}