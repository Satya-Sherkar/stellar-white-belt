"use client";

import { useState } from "react";
import { connectFreighter } from "@/lib/freighter";

export default function ConnectWalletButton() {
  const [wallet, setWallet] = useState<{
    publicKey: string;
    network: string;
  } | null>(null);

  const handleConnect = async () => {
    try {
      const data = await connectFreighter();
      setWallet(data);
    } catch (err) {
      alert("Connection failed");
    }
  };

  return (
    <div>
      {!wallet ? (
        <button onClick={handleConnect}>Connect Freighter</button>
      ) : (
        <div>
          <p>Connected: {wallet.publicKey}</p>
          <p>Network: {wallet.network}</p>
        </div>
      )}
    </div>
  );
}
