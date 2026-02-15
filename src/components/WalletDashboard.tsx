"use client";

import { useState, useEffect } from "react";
import { Horizon } from "@stellar/stellar-sdk";

interface Transaction {
  id: string;
  type: string;
  amount: string;
  sourceAccount: string;
  timestamp: string;
  memo?: string;
}

interface BalanceInfo {
  balance: string;
  asset: string;
}

export default function WalletDashboard({ publicKey }: { publicKey: string }) {
  const [balance, setBalance] = useState<BalanceInfo | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        setLoading(true);
        setError(null);

        const server = new Horizon.Server("https://horizon-testnet.stellar.org");

        // Fetch account details
        const account = await server.accounts().accountId(publicKey).call();
        
        // Get native balance
        const nativeBalance = account.balances.find(b => b.asset_type === "native");
        if (nativeBalance) {
          setBalance({
            balance: nativeBalance.balance,
            asset: "XLM",
          });
        }

        // Fetch recent transactions
        const txList = await server
          .transactions()
          .forAccount(publicKey)
          .order("desc")
          .limit(5)
          .call();

        const formattedTransactions: Transaction[] = txList.records.map((tx: any) => {
          const operation = tx.operations[0];
          return {
            id: tx.id,
            type: operation?.type || "unknown",
            amount: operation?.amount || "0",
            sourceAccount: operation?.source_account || tx.source_account,
            timestamp: tx.created_at,
            memo: tx.memo || undefined,
          };
        });

        setTransactions(formattedTransactions);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch account data");
        console.error("Error fetching account data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, [publicKey]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass rounded-2xl p-6 border border-red-500/50 bg-red-500/10">
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      {balance && (
        <div className="glass rounded-3xl p-8 border border-white/10">
          <p className="text-white/60 text-sm mb-2">Wallet Balance</p>
          <div className="flex items-baseline gap-3">
            <h2 className="text-5xl font-bold text-white">{balance.balance}</h2>
            <span className="text-2xl text-purple-400 font-semibold">{balance.asset}</span>
          </div>
          <p className="text-white/40 text-xs mt-4">Account: {publicKey.slice(0, 8)}...{publicKey.slice(-8)}</p>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="glass rounded-3xl p-8 border border-white/10">
        <h3 className="text-xl font-bold mb-6 text-white">Recent Transactions</h3>
        
        {transactions.length === 0 ? (
          <p className="text-white/60 text-center py-8">No transactions yet</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-semibold text-white capitalize">{tx.type}</p>
                  <p className="text-xs text-white/50 mt-1">
                    {new Date(tx.timestamp).toLocaleString()}
                  </p>
                  {tx.memo && (
                    <p className="text-xs text-white/40 mt-1">Memo: {tx.memo}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">{tx.amount}</p>
                  <p className="text-xs text-white/50">XLM</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
