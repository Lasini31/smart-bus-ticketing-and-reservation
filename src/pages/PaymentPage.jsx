import { useState } from "react";
import PersonalDetailsForm from '../components/payment/PersonalDetailsForm'
import PaymentMethodSelector from '../components/payment/PaymentMethodSelector'
import CardDetailsForm from '../components/payment/CardDetailsForm'
import { Lock, CreditCard } from 'lucide-react'

export default function PaymentPage() {
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [selectedMethod, setSelectedMethod] = useState('visa')
    const [cardName, setCardName] = useState('')
    const [cardNumber, setCardNumber] = useState('')
    const [expiry, setExpiry] = useState('')
    const [cvc, setCvc] = useState('')
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const handleNext = async () => {

    }

    return (
        <div className="flex min-h-screen">

            {/* Left panel */}
            <div className="hidden lg:block relative w-2/5">
                <svg viewBox="0 0 400 800" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                    <path d="M0,0 L320,0 Q400,400 320,800 L0,800 Z" fill="#22c55e"/>
                </svg>
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-white gap-6">
                    <Lock size={52} />
                    <CreditCard size={52} />
                    <p className="text-3xl font-semibold">Secure</p>
                    <p className="text-5xl font-extrabold">Payment</p>
                </div>
            </div>

            {/* Right panel */}
            <div className="flex-1 px-6 sm:px-10 py-10 max-w-2xl mx-auto w-full">
                <h2 className="text-2xl font-bold mb-8">Complete registration payment</h2>
                
                <PersonalDetailsForm
                    address={address} setAddress={setAddress}
                    city={city} setCity={setCity}
                    state={state} setState={setState}
                    postalCode={postalCode} setPostalCode={setPostalCode}
                    errors={errors}
                />
                
                <PaymentMethodSelector
                    selected={selectedMethod}
                    onSelect={setSelectedMethod}
                />

                <CardDetailsForm
                    cardName={cardName} setCardName={setCardName}
                    cardNumber={cardNumber} setCardNumber={setCardNumber}
                    expiry={expiry} setExpiry={setExpiry}
                    cvc={cvc} setCvc={setCvc}
                    errors={errors}
                />
                
                <button
                    onClick={handleNext}
                    disabled={isLoading}
                    className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg
                                font-semibold hover:bg-green-700 disabled:opacity-50 transition">
                    {isLoading ? 'Processing...' : 'Next'}
                </button>
            </div>
        </div>
    )
}