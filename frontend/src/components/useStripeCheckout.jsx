
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

export function useStripeCheckout(sessionToken, onPaymentSuccess) {
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isPolling, setIsPolling] = useState(false);
    const [error, setError] = useState(null);

    // Monitor URL redirect triggers
    useEffect(() => {
        const stripeStatus = searchParams.get('stripe_status');
        const sessionId = searchParams.get('session_id');

        if (stripeStatus === 'cancelled') {
            setError('Payment was cancelled. No money was charged.');
        } else if (stripeStatus === 'success' && sessionId) {
            setIsPolling(true);
            checkPaymentStatus(sessionId);
        }
    }, [searchParams]);

    // Background server check loop
    async function checkPaymentStatus(sessionId, attempt = 1) {
        try {
            const response = await fetch(`${BASE_URL}/payments/topups/sessions/${sessionId}`, {
                headers: { "Authorization": `Bearer ${sessionToken}` }
            });
            if (!response.ok) throw new Error();

            const data = await response.json();
            if (data.status === 'completed') {
                setIsPolling(false);
                onPaymentSuccess(data.walletBalance, data.amount);
            } else if (data.status === 'pending' && attempt < 5) {
                setTimeout(() => checkPaymentStatus(sessionId, attempt + 1), 2000);
            } else {
                setError('Payment verification timed out.');
                setIsPolling(false);
            }
        } catch {
            setError('Network fault encountered while verifying payment status.');
            setIsPolling(false);
        }
    }

    // Trigger redirection handoff
    const redirectToCheckout = async (amount) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${BASE_URL}/payments/topups/checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionToken}`
                },
                body: JSON.stringify({ amount: parseFloat(amount) })
            });
            if (!response.ok) throw new Error('Failed to initialize session.');
            const data = await response.json();
            window.location.href = data.checkoutUrl;
        } catch (err) {
            setError(err.message || 'Communication failure.');
            setIsLoading(false);
        }
    };

    return { redirectToCheckout, isLoading, isPolling, error, setError };
}