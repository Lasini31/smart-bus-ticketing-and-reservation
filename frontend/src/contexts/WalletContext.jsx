// src/contexts/WalletContext.jsx
import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext.jsx';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.busmanagement.internal/v1';

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const { user, token, userId, isAuthenticated } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [walletId, setWalletId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch wallet data on auth change
  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchWalletData();
    } else {
      // Reset wallet data when logged out
      setBalance(0);
      setTransactions([]);
      setWalletId(null);
    }
  }, [isAuthenticated, userId]);

  // Fetch wallet data from API
  const fetchWalletData = useCallback(async () => {
    if (!userId || !token) return;

    try {
      setLoading(true);
      setError(null);

      // GET /wallet/{id}
      const response = await fetch(`${API_BASE}/wallet/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch wallet data');
      }

      const data = await response.json();
      setBalance(data.balance);
      setWalletId(data.walletId);

      // Load transactions from localStorage (since API doesn't have transactions endpoint yet)
      loadTransactionsFromStorage();

    } catch (err) {
      console.error('Error fetching wallet:', err);
      setError(err.message);
      // Fallback to localStorage data if API fails
      loadTransactionsFromStorage();
      const savedBalance = localStorage.getItem(`wallet_balance_${userId}`);
      if (savedBalance) {
        setBalance(parseFloat(savedBalance));
      }
    } finally {
      setLoading(false);
    }
  }, [userId, token]);

  // Load transactions from localStorage
  const loadTransactionsFromStorage = () => {
    if (!userId) return;
    try {
      const saved = localStorage.getItem(`transactions_${userId}`);
      if (saved) {
        setTransactions(JSON.parse(saved));
      } else {
        // Initialize with empty array if no saved transactions
        setTransactions([]);
      }
    } catch (err) {
      console.error('Error loading transactions:', err);
      setTransactions([]);
    }
  };

  // Save transactions to localStorage
  const saveTransactionsToStorage = (newTransactions) => {
    if (!userId) return;
    try {
      localStorage.setItem(`transactions_${userId}`, JSON.stringify(newTransactions));
    } catch (err) {
      console.error('Error saving transactions:', err);
    }
  };

  // Save balance to localStorage as backup
  const saveBalanceToStorage = (newBalance) => {
    if (!userId) return;
    try {
      localStorage.setItem(`wallet_balance_${userId}`, String(newBalance));
    } catch (err) {
      console.error('Error saving balance:', err);
    }
  };

  // Top up wallet - POST /wallet/{id}/topup
  const topUp = async (amount, method = 'card') => {
    if (!userId || !token) {
      throw new Error('Please login to top up your wallet');
    }

    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/wallet/${userId}/topup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          method: method // 'card' or 'bank'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Top up failed');
      }

      const data = await response.json();
      
      // Update balance from API response
      setBalance(data.balance);
      saveBalanceToStorage(data.balance);

      // Add transaction record
      const newTransaction = {
        id: `tx_${Date.now()}`,
        label: 'Top-up',
        amount: parseFloat(amount),
        date: new Date().toISOString().slice(0, 10),
        status: 'Completed',
        method: method
      };

      const updatedTransactions = [newTransaction, ...transactions];
      setTransactions(updatedTransactions);
      saveTransactionsToStorage(updatedTransactions);

      return data;

    } catch (err) {
      console.error('Top up error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Deduct from wallet (used for payments)
  const deduct = async (amount, label, paymentId) => {
    if (!userId || !token) {
      throw new Error('Please login to make payments');
    }

    if (amount > balance) {
      throw new Error('Insufficient wallet balance');
    }

    try {
      setLoading(true);
      setError(null);

      // POST /payment/confirm
      const response = await fetch(`${API_BASE}/payment/confirm`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentId: paymentId || `pay_${Date.now()}`,
          passengerId: userId,
          fare: parseFloat(amount)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Payment failed');
      }

      const data = await response.json();
      
      // Update balance from API response
      setBalance(data.balance);
      saveBalanceToStorage(data.balance);

      // Add transaction record
      const newTransaction = {
        id: `tx_${Date.now()}`,
        label: label || 'Ticket purchase',
        amount: -parseFloat(amount),
        date: new Date().toISOString().slice(0, 10),
        status: 'Completed',
        paymentId: paymentId
      };

      const updatedTransactions = [newTransaction, ...transactions];
      setTransactions(updatedTransactions);
      saveTransactionsToStorage(updatedTransactions);

      return data;

    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const setBalanceFromServer = (newBalance, topUpAmount) => {
    setBalance(Number(Number(newBalance).toFixed(2)))
    setTransactions(prev => [
      {
        id: prev.length + 1,
        label: 'Top-up via Stripe',
        amount: Number(topUpAmount),
        date: new Date().toISOString().slice(0, 10),
        status: 'Completed'
      },
      ...prev
    ])
  }

  const refund = (amount, reason) => {
    if (amount <= 0) {
      throw new Error('Refund amount must be greater than 0');
    }

    try {
      setLoading(true);
      setError(null);

      // The contract shows refund endpoint without request body
      // It processes refund based on system logic
      const response = await fetch(`${API_BASE}/wallet/${userId}/refund`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Refund failed');
      }

      const data = await response.json();
      
      // Update balance from API response
      setBalance(data.balance);
      saveBalanceToStorage(data.balance);

      // Add transaction record
      const newTransaction = {
        id: `tx_${Date.now()}`,
        label: reason ? `Refund: ${reason}` : 'Refund',
        amount: parseFloat(amount),
        date: new Date().toISOString().slice(0, 10),
        status: 'Completed',
        reason: reason
      };

      const updatedTransactions = [newTransaction, ...transactions];
      setTransactions(updatedTransactions);
      saveTransactionsToStorage(updatedTransactions);

      return data;

    } catch (err) {
      console.error('Refund error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cancel booking - handles refund via API
  const cancelBooking = async (transactionId, reason) => {
    if (!transactionId) {
      throw new Error('Transaction ID is required');
    }

    try {
      setLoading(true);
      setError(null);

      // Find the transaction
      const transaction = transactions.find(tx => tx.id === transactionId);
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      if (transaction.status === 'Cancelled') {
        throw new Error('Booking is already cancelled');
      }

      // Check if this is a booking transaction (negative amount)
      if (transaction.amount >= 0) {
        throw new Error('Only booking transactions can be cancelled');
      }

      const refundAmount = Math.abs(transaction.amount);
      
      // Process refund via API
      const refundResult = await refund(refundAmount, reason || 'Booking cancelled by user');

      // Update transaction status in local storage
      const updatedTransactions = transactions.map(tx =>
        tx.id === transactionId
          ? {
              ...tx,
              status: 'Cancelled',
              cancelledReason: reason || 'Booking cancelled by user'
            }
          : tx
      );

      setTransactions(updatedTransactions);
      saveTransactionsToStorage(updatedTransactions);

      return refundResult;

    } catch (err) {
      console.error('Cancel booking error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Refresh wallet data
  const refreshWallet = useCallback(async () => {
    await fetchWalletData();
  }, [fetchWalletData]);

  const value = useMemo(() => ({
    balance,
    transactions,
    walletId,
    loading,
    error,
    topUp,
    deduct,
    refund,
    cancelBooking,
    refreshWallet,
    // Helper methods
    hasSufficientBalance: (amount) => amount <= balance,
    getTransaction: (id) => transactions.find(tx => tx.id === id),
  }), [balance, transactions, walletId, loading, error]);

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}