export const metadata = { title: 'My Wallet' };

export default function WalletPage() {
  return (
    <div className="px-4 py-12 md:py-16">
      <div className="container mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-foreground">My Wallet</h1>
        <div className="mb-6 rounded-xl border border-border bg-accent p-6 text-center text-accent-foreground">
          <p className="text-sm">Available Balance</p>
          <p className="text-3xl font-bold">AED 150.00</p>
        </div>
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <h2 className="font-semibold text-foreground">Transaction History</h2>
          </div>
          <div className="divide-y divide-border">
            {[
              { desc: 'Referral bonus — John D.', amount: '+50.00', date: '2026-03-20', type: 'credit' },
              { desc: 'Payment — Order LH-2026-00030', amount: '-100.00', date: '2026-03-15', type: 'debit' },
              { desc: 'Welcome credit', amount: '+100.00', date: '2026-03-01', type: 'credit' },
              { desc: 'Refund — Order LH-2026-00025', amount: '+100.00', date: '2026-02-28', type: 'credit' },
            ].map((tx, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{tx.desc}</p>
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                </div>
                <span className={`text-sm font-semibold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                  AED {tx.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
