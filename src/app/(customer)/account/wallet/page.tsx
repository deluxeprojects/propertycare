'use client';

import { useEffect, useState } from 'react';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  created_at: string;
}

interface WalletData {
  balance: number;
  transactions: Transaction[];
}

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/v1/customer/wallet')
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load wallet');
        const data = await res.json();
        setWallet(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="px-4 py-12 md:py-16">
        <div className="container mx-auto max-w-2xl">
          <h1 className="mb-6 text-2xl font-bold text-foreground">My Wallet</h1>
          <div className="mb-6 h-24 animate-pulse rounded-xl bg-muted" />
          <div className="h-48 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-12 md:py-16">
        <div className="container mx-auto max-w-2xl">
          <h1 className="mb-6 text-2xl font-bold text-foreground">My Wallet</h1>
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm text-red-700">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-3 text-sm font-medium text-red-700 underline">
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const balance = wallet?.balance ?? 0;
  const transactions = wallet?.transactions ?? [];

  return (
    <div className="px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-foreground">My Wallet</h1>
        <div className="mb-6 rounded-xl border border-border bg-accent p-6 text-center text-accent-foreground">
          <p className="text-sm">Available Balance</p>
          <p className="text-3xl font-bold">AED {balance.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <h2 className="font-semibold text-foreground">Transaction History</h2>
          </div>
          {transactions.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-muted-foreground">
              No transactions yet.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between px-6 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(tx.created_at).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  <span className={`text-sm font-semibold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                    AED {tx.type === 'credit' ? '+' : '-'}{Math.abs(tx.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
