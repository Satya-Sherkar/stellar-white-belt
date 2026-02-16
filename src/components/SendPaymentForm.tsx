"use client";

import { useState } from "react";
import { StellarWalletsKit } from "@creit-tech/stellar-wallets-kit";
import * as StellarSdk from "@stellar/stellar-sdk";

const TESTNET_NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";

export default function SendPaymentForm({ publicKey }: { publicKey: string }) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!recipient.trim() || !amount.trim()) {
      setMessage({ type: "error", text: "Please fill in all fields" });
      return;
    }

    // Validate Stellar address
    if (!recipient.match(/^G[A-Z0-9]{55}$/)) {
      setMessage({ type: "error", text: "Invalid Stellar address" });
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setMessage({ type: "error", text: "Invalid amount" });
      return;
    }

    try {
      setLoading(true);
      const server = new StellarSdk.Horizon.Server(
        "https://horizon-testnet.stellar.org",
      );

      // Get the sender's account
      const sourceAccount = await server.loadAccount(publicKey);

      // Build the transaction
      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: TESTNET_NETWORK_PASSPHRASE,
      }).addOperation(
        StellarSdk.Operation.payment({
          destination: recipient,
          asset: StellarSdk.Asset.native(),
          amount: amount,
        }),
      );

      if (memo.trim()) {
        transaction.addMemo(StellarSdk.Memo.text(memo));
      }

      const builtTransaction = transaction.setTimeout(30).build();

      // Convert to XDR for signing
      const xdr = builtTransaction.toXDR();

      // Sign the transaction with wallet
      const signedTxData = await StellarWalletsKit.signTransaction(xdr, {
        networkPassphrase: TESTNET_NETWORK_PASSPHRASE,
      });

      // Rebuild signed transaction
      const signedTransaction = new StellarSdk.Transaction(
        signedTxData.signedTxXdr,
        TESTNET_NETWORK_PASSPHRASE,
      );

      // Submit to Horizon
      const result = await server.submitTransaction(signedTransaction);

      setMessage({
        type: "success",
        text: `Transaction successful! Hash: ${result.hash.substring(0, 16)}...`,
      });

      // Reset form
      setRecipient("");
      setAmount("");
      setMemo("");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send payment";
      setMessage({ type: "error", text: errorMessage });
      console.error("Error sending payment:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-3xl p-8 border border-white/10">
      <h3 className="text-xl font-bold mb-6 text-white">Send Payment</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Recipient Stellar Address
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="G..."
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 transition-colors"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Amount (XLM)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.0000001"
            min="0"
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 transition-colors"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Memo (Optional)
          </label>
          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="Add a memo for this transaction..."
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 transition-colors"
            disabled={loading}
            maxLength={28}
          />
          <p className="text-xs text-white/40 mt-1">
            {memo.length}/28 characters
          </p>
        </div>

        {message && (
          <div
            className={`animate-in fade-in slide-in-from-top-2 duration-300 p-4 rounded-xl border-l-4 flex items-start gap-3 ${
              message.type === "success"
                ? "bg-linear-to-r from-green-500/10 to-emerald-500/5 border-l-green-400 text-green-300"
                : "bg-linear-to-r from-red-500/10 to-rose-500/5 border-l-red-400 text-red-300"
            }`}
          >
            <span className="text-lg mt-0.5 shrink-0">
              {message.type === "success" ? "✓" : "✕"}
            </span>
            <div className="flex-1">
              <p className="font-medium text-sm">
                {message.type === "success" ? "Success" : "Error"}
              </p>
              <p className="text-xs opacity-90 mt-0.5">{message.text}</p>
              {message.type === "success" && message.text.includes("Hash:") && (
                <a
                  href={`https://stellar.expert/explorer/testnet/tx/${message.text.split("Hash: ")[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs mt-2 inline-block underline hover:opacity-75 transition-opacity truncate"
                >
                  View on Stellar Expert →
                </a>
              )}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {loading ? "Sending..." : "Send Payment"}
        </button>
      </form>
    </div>
  );
}
