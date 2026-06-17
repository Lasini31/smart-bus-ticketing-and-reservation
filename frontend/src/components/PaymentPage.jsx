import { useState } from "react";
import PersonalDetailsForm from '../components/payment/PersonalDetailsForm'
import CardDetailsForm from '../components/payment/CardDetailsForm'
import PaymentMethodSelector from "../components/payment/PaymentMethodSelector";
import { Lock, CreditCard, Wallet} from 'lucide-react'
import { useNavigate } from "react-router-dom";
import DOMPurify from 'dompurify'

export default function PaymentPage() {
    const navigate = useNavigate()

    {/*Personal details state*/}
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [postalCode, setPostalCode] = useState('')

    {/*Payment state*/}
    const [selectedMethod, setSelectedMethod] = useState('visa')
    const [cardName, setCardName] = useState('')
    const [cardNumber, setCardNumber] = useState('')
    const [expiry, setExpiry] = useState('')
    const [cvc, setCvc] = useState('')

    {/*Top-up amount*/}
    const [amount, setAmount] = useState('')

    {/*UI state*/}
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [showPopup, setShowPopup] = useState(false)
    const [popupMessage, setPopupMessage] = useState({success: true, text: ''})
    const [isRateLimited, setIsRateLimited] = useState(false)

    {/*
    //Wallet balance
    // DUMMY wallet balance — replace with real Supabase query when DB is ready
    // TODO: Replace with:
    // const { data } = await supabase
    //   .from('payment')           <- from SRS ER diagram
    //   .select('prepaid_balance') <- column name from SRS ER diagram
    //   .eq('passenger_id', user.id)
    //   .single() */}

    const [walletBalance, setWalletBalance] = useState(2500.00)

    const handleAmountChange = (e) => {
        const value = e.target.value
        if (/^\d*\.?\d{0,2}$/.test(value)){
            setAmount(value)
        }
    }

    // const validate = () => {
    // const e = {};

    // // Personal details
    // if (!address || address.length < 5) e.address = 'Enter a valid address';
    // if (!city) e.city = 'Required';
    // if (!state) e.state = 'Required';
    // if (!/^\d{4,10}$/.test(postalCode)) e.postalCode = 'Invalid postal code';

    // // Amount
    // if (!amount || parseFloat(amount) <= 0) e.amount = 'Please enter a valid amount';
    // else if (parseFloat(amount) < 100) e.amount = 'Minimum top-up amount is LKR 100';
    // else if (parseFloat(amount) > 50000) e.amount = 'Maximum top-up amount is LKR 50,000';

    // // Card details
    // if (!cardName) e.cardName = 'Required';
    // if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) e.cardNumber = 'Enter a valid 16-digit card number';
    // if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) e.expiry = 'Use MM/YY';
    // if (!/^\d{3,4}$/.test(cvc)) e.cvc = 'Invalid CVC';

    // setErrors(e);
    // return Object.keys(e).length === 0;
    // };

    // const handleNext = async () => {
    // if (!validate()) return;

    // setIsRateLimited(true);
    // setTimeout(() => setIsRateLimited(false), 5000);

    // setIsLoading(true);

    // const success = Math.random() > 0.2;

    // if (success) {
    //     setWalletBalance(prev => prev + parseFloat(amount));
    //     setPopupMessage({ success: true, text: `LKR ${parseFloat(amount).toFixed(2)} added to your wallet!` });
    // } else {
    //     setPopupMessage({ success: false, text: 'Payment failed. Please check your card details and try again.' });
    // }

    // setIsLoading(false);
    // setCvc('');
    // setShowPopup(true);
    // };

    const handleNext = async () => {
        // TODO: Replace this entire block with real validation + API call
        // Steps when DB is ready:
        // 1. Run full form validation (address, card details, amount)
        // 2. Call endpoint or Supabase to process payment
        // 3. On success, update wallet balance in 'payment' table (prepaid_balance column)
        // 4. Show success popup
        // 5. On failure, show error popup

        //Dummy validation - Checking amounts
        if (!amount || parseFloat(amount) <= 0) {
            setErrors({ amount: 'Please enter a valid amount' })
            return
        }

        if (parseFloat(amount) < 100) {
            setErrors({ amount: 'Minimum top-up amount is LKR 100' })
            return
        }

        if (parseFloat(amount) > 50000) {
            setErrors({ amount: 'Maximum top-up amount is LKR 50,000' })
            return
        }

        // Rate limiting
        setIsRateLimited(true)
        setTimeout(() => setIsRateLimited(false), 5000)

        setErrors({})
        setIsLoading(true)

        //Dummy success 
        const success = Math.random() > 0.2

        //Change this part too
        if (success) {
            // TODO: Remove dummy balance update
            setWalletBalance(prev => prev + parseFloat(amount))
            setPopupMessage({ success: true, text: `LKR ${parseFloat(amount).toFixed(2)} added to your wallet!` })
            } else {
            setPopupMessage({ success: false, text: 'Payment failed. Please check your card details and try again.' })
        }

        setIsLoading(false)
        setCvc('')
        setShowPopup(true)
    }

    const handlePopupClose = () => {
        setShowPopup(false)
        if (popupMessage.success){
            navigate('/wallet')
        }
    }

    return (
        <div className="flex min-h-screen">

            {/* Left Panel */}
            <div className="hidden lg:block relative w-2/5 min-h-screen">
                <svg viewBox="0 0 400 800" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <path d="M0,0 L320,0 Q400,400 320,800 L0,800 Z" fill="#22c55e"/>
                </svg>

                <div className="relative z-10 flex flex-col items-center justify-center h-full text-white gap-6 px-10">
                <Lock size={48} />
                <p className="text-3xl font-semibold">Secure</p>
                <p className="text-5xl font-extrabold">Payment</p>

                {/* Wallet balance display */}
                <div className="mt-8 bg-white/20 backdrop-blur-sm rounded-2xl px-8 py-6 text-center w-full max-w-[220px]">
                    <Wallet size={28} className="mx-auto mb-2" />
                    <p className="text-sm font-medium opacity-80">Current Balance</p>
                    {/* TODO: Replace walletBalance with real value from Supabase */}
                    <p className="text-3xl font-extrabold mt-1">
                    LKR {walletBalance.toFixed(2)}
                    </p>
                </div>

                <p className="text-sm opacity-70 text-center mt-4">
                    Top up your wallet to book your next journey
                </p>
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex-1 px-6 sm:px-10 py-10 max-w-2xl mx-auto w-full">
                <h2 className="text-2xl font-bold mb-2">Top Up Wallet</h2>
                <p className="text-gray-500 text-sm mb-8">Enter your payment details to add funds</p>

                {/* Mobile balance display — only shows on mobile */}
                <div className="lg:hidden flex items-center gap-3 bg-green-50 border border-green-200
                                rounded-xl px-4 py-3 mb-6">
                <Wallet size={20} className="text-green-600" />
                <div>
                    <p className="text-xs text-gray-500">Current Balance</p>
                    {/* TODO: Replace with real balance */}
                    <p className="text-lg font-bold text-green-700">LKR {walletBalance.toFixed(2)}</p>
                </div>
                </div>

                {/* Top-up amount input */}
                <div className="mb-8">
                <label className="text-sm font-semibold text-gray-700">Top-up Amount (LKR)</label>
                <input
                    type="text"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="Enter amount (min. 100)"
                    className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-3
                            focus:outline-none focus:ring-2 focus:ring-green-500 text-lg font-semibold"
                />
                {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                <p className="text-xs text-gray-400 mt-1">Min: LKR 100 &nbsp;|&nbsp; Max: LKR 50,000</p>
                </div>
                        
                <PersonalDetailsForm
                    address={address} setAddress={setAddress}
                    city={city} setCity={setCity}
                    state={state} setState={setState}
                    postalCode={postalCode} setPostalCode={setPostalCode}
                    errors={errors}
                />

                
                <div className="my-6">
                    <PaymentMethodSelector
                        selected={selectedMethod}
                        setSelectedMethod={setSelectedMethod}
                        errors={errors}
                    />
                </div>

                
                <CardDetailsForm
                    cardName={cardName} setCardName={setCardName}
                    cardNumber={cardNumber} setCardNumber={setCardNumber}
                    expiry={expiry} setExpiry={setExpiry}
                    cvc={cvc} setCvc={setCvc}
                    errors={errors}
                />
                
                <button
                    onClick={handleNext}
                    disabled={isLoading || isRateLimited}
                    className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg
                                font-semibold hover:bg-green-700 disabled:opacity-50 transition">
                    {isLoading ? 'Processing...' : 'Top Up'}
                </button>
            </div>

            {/* Confirmation popup */}
            {showPopup && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl px-8 py-8 max-w-sm w-full mx-4 text-center shadow-xl">

                    {/* Success or failure icon */}
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4
                                    ${popupMessage.success ? 'bg-green-100' : 'bg-red-100'}`}>
                    {popupMessage.success
                        ? <span className="text-3xl">✓</span>
                        : <span className="text-3xl">✕</span>
                    }
                    </div>

                    <h3 className={`text-xl font-bold mb-2 
                                ${popupMessage.success ? 'text-green-600' : 'text-red-500'}`}>
                    {popupMessage.success ? 'Payment Confirmed!' : 'Payment Failed'}
                    </h3>

                    <p className="text-gray-500 text-sm mb-6">{popupMessage.text}</p>

                    {/* Show updated balance on success */}
                    {popupMessage.success && (
                    <div className="bg-green-50 rounded-xl px-4 py-3 mb-6">
                        <p className="text-xs text-gray-500">New Balance</p>
                        {/* TODO: Fetch updated balance from Supabase instead of using local state */}
                        <p className="text-2xl font-extrabold text-green-700">
                        LKR {walletBalance.toFixed(2)}
                        </p>
                    </div>
                    )}

                    <button
                    onClick={handlePopupClose}
                    className={`w-full py-3 rounded-lg font-semibold text-white transition
                                ${popupMessage.success
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-red-500 hover:bg-red-600'}`}>
                    {popupMessage.success ? 'Done' : 'Try Again'}
                    </button>

                </div>
                </div>
            )}
        </div>
    )
}