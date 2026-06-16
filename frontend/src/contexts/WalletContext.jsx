import React, { createContext, useContext, useMemo, useState } from 'react';

const WalletContext = createContext(null);

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
];

export function WalletProvider({ children }) {
  const [balance, setBalance] = useState(5440.5);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);

  const topUp = (amount) => {
    setBalance(prev => Number((prev + amount).toFixed(2)));
    setTransactions(prev => [
      {
        id: prev.length + 1,
        label: 'Top-up',
        amount,
        date: new Date().toISOString().slice(0, 10),
        status: 'Completed'
      },
      ...prev
    ]);
  };

  const deduct = (amount, label) => {
    if (amount > balance) {
      return false;
    }
    setBalance(prev => Number((prev - amount).toFixed(2)));
    setTransactions(prev => [
      {
        id: prev.length + 1,
        label,
        amount: -amount,
        date: new Date().toISOString().slice(0, 10),
        status: 'Completed'
      },
      ...prev
    ]);
    return true;
  };

  const refund = (amount, reason) => {
    if (amount <= 0) {
      return false;
    }
    setBalance(prev => Number((prev + amount).toFixed(2)));
    setTransactions(prev => [
      {
        id: prev.length + 1,
        label: reason ? `Refund: ${reason}` : 'Refund',
        amount,
        date: new Date().toISOString().slice(0, 10),
        status: 'Completed'
      },
      ...prev
    ]);
    return true;
  };

  const value = useMemo(() => ({
    balance,
    transactions,
    topUp,
    deduct
    ,
    refund
  }), [balance, transactions]);

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
