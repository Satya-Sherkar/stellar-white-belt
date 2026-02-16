"use client";

import { useState, useEffect } from "react";
import { Horizon } from "@stellar/stellar-sdk";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Copy,
  FileText,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface Transaction {
  id: string;
  type: "sent" | "received";
  amount: string;
  otherParty: string;
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

        const server = new Horizon.Server(
          "https://horizon-testnet.stellar.org",
        );

        /* ---------------- BALANCE ---------------- */

        const account = await server.accounts().accountId(publicKey).call();

        const nativeBalance = account.balances.find(
          (b: any) => b.asset_type === "native",
        );

        if (nativeBalance) {
          setBalance({
            balance: parseFloat(nativeBalance.balance).toFixed(2),
            asset: "XLM",
          });
        }

        /* ---------------- PAYMENTS (REAL TRANSACTIONS) ---------------- */

        const paymentsPage = await server
          .operations()
          .forAccount(publicKey)
          .order("desc")
          .limit(10)
          .call();

        // filter only XLM payments
        const paymentOps = paymentsPage.records.filter(
          (op: any) => op.type === "payment" && op.asset_type === "native",
        );

        const formatted: Transaction[] = await Promise.all(
          paymentOps.slice(0, 5).map(async (op: any) => {
            // get parent transaction to read memo
            let memo: string | undefined = undefined;

            try {
              const tx = await op.transaction();
              if (tx.memo_type !== "none") memo = tx.memo;
            } catch {}

            const isSender = op.from === publicKey;

            return {
              id: op.id,
              type: isSender ? "sent" : "received",
              amount: parseFloat(op.amount).toFixed(2),
              otherParty: isSender ? op.to : op.from,
              timestamp: op.created_at,
              memo,
            };
          }),
        );

        setTransactions(formatted);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch account data",
        );
        console.error("Error fetching account data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, [publicKey]);

  /* ---------------- UI ---------------- */

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-12 w-12 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass rounded-2xl p-6 border border-red-500/50 bg-red-500/10 flex items-center gap-3">
        <AlertCircle className="text-red-400" />
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Balance */}
      {balance && (
        <div className="glass rounded-3xl p-8 border border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="text-purple-400" size={22} />
            <p className="text-white/70 text-sm">Wallet Balance</p>
          </div>

          <div className="flex items-baseline gap-3">
            <h2 className="text-5xl font-bold text-white">{balance.balance}</h2>
            <span className="text-2xl text-purple-400 font-semibold">
              {balance.asset}
            </span>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-white/40 text-xs">
              Account: {publicKey.slice(0, 8)}...{publicKey.slice(-8)}
            </p>

            <Copy
              size={16}
              className="text-white/40 hover:text-purple-400 cursor-pointer transition"
              onClick={() => navigator.clipboard.writeText(publicKey)}
            />
          </div>
        </div>
      )}

      {/* Transactions */}
      <div className="glass rounded-3xl p-8 border border-white/10">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="text-purple-400" size={20} />
          <h3 className="text-xl font-bold text-white">Recent Payments</h3>
        </div>

        {transactions.length === 0 ? (
          <p className="text-white/60 text-center py-8">No payments yet</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-200"
              >
                <div className="flex items-start gap-3 flex-1">
                  {/* ICON */}
                  <div
                    className={`p-2 rounded-xl ${
                      tx.type === "sent"
                        ? "bg-red-500/15 text-red-400"
                        : "bg-green-500/15 text-green-400"
                    }`}
                  >
                    {tx.type === "sent" ? (
                      <ArrowUpRight size={18} />
                    ) : (
                      <ArrowDownLeft size={18} />
                    )}
                  </div>

                  {/* DETAILS */}
                  <div className="flex-1">
                    <p
                      className={`font-semibold ${
                        tx.type === "sent" ? "text-red-400" : "text-green-400"
                      }`}
                    >
                      {tx.type === "sent" ? "Sent" : "Received"}
                    </p>

                    <p className="text-xs text-white/50 mt-1 flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(tx.timestamp).toLocaleString()}
                    </p>

                    <p className="text-xs text-white/40 mt-1">
                      {tx.type === "sent" ? "To: " : "From: "}
                      {tx.otherParty.slice(0, 6)}...{tx.otherParty.slice(-6)}
                    </p>

                    {tx.memo && (
                      <p className="text-xs text-purple-300 mt-1 flex items-center gap-1">
                        <FileText size={12} />
                        {tx.memo}
                      </p>
                    )}
                  </div>
                </div>

                {/* AMOUNT */}
                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      tx.type === "sent" ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    {tx.type === "sent" ? "-" : "+"}
                    {tx.amount} XLM
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
