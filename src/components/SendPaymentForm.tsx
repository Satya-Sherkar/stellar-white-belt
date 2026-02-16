"use client";

import { useState } from "react";
import { StellarWalletsKit } from "@creit-tech/stellar-wallets-kit";
import * as StellarSdk from "@stellar/stellar-sdk";
import {
  Send,
  User,
  Coins,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  AtSign,
} from "lucide-react";

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
      <div className="flex items-center gap-2 mb-6">
        <Send className="text-purple-400" size={22} />
        <h3 className="text-xl font-bold text-white">Send Payment</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-white/80 mb-2">
            <User size={16} className="text-purple-400" />
            Recipient Stellar Address
          </label>

          <div className="relative">
            <AtSign
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
            />
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="G..."
              className="w-full bg-white/10 border border-white/20 rounded-lg pl-9 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 transition-colors"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-white/80 mb-2">
            <Coins size={16} className="text-purple-400" />
            Amount (XLM)
          </label>

          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.0000001"
              min="0"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 pr-14 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 transition-colors"
              disabled={loading}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 text-sm font-semibold">
              XLM
            </span>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-white/80 mb-2">
            <FileText size={16} className="text-purple-400" />
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
            {message.type === "success" ? (
              <CheckCircle2
                className="text-green-400 mt-0.5 shrink-0"
                size={20}
              />
            ) : (
              <AlertCircle className="text-red-400 mt-0.5 shrink-0" size={20} />
            )}

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
                  <span className="flex items-center gap-1">
                    View on Stellar Expert <ExternalLink size={12} />
                  </span>
                </a>
              )}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Sending...
            </>
          ) : (
            <>
              <Send size={18} />
              Send Payment
            </>
          )}
        </button>
      </form>
    </div>
  );
}
