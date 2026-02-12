"use client";

import { useState, useEffect } from "react";
import { StellarWalletsKit, KitEventType, KitEventStateUpdated } from "@creit-tech/stellar-wallets-kit";
import { initWalletKit } from "@/lib/stellar-wallets-kit";

export default function ConnectWalletButton() {
  const [publicKey, setPublicKey] = useState<string | null>(null);

  useEffect(() => {
    // Initialize the kit on mount
    initWalletKit();

    // Check check initial connection state
    const checkConnection = async () => {
      try {
        const { address } = await StellarWalletsKit.getAddress();
        if (address) {
          setPublicKey(address);
        }
      } catch (e) {
        // Not connected
        setPublicKey(null);
      }
    };
    checkConnection();

    // Listen for state updates
    // @ts-ignore - The types for 'on' might be tricky due to enum/string mismatch
    const unsubscribe = StellarWalletsKit.on(KitEventType.STATE_UPDATED, (event: KitEventStateUpdated) => {
      if (event.payload.address) {
        setPublicKey(event.payload.address);
      } else {
        setPublicKey(null);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleConnect = async () => {
    try {
      const { address } = await StellarWalletsKit.authModal();
      setPublicKey(address);
    } catch (err) {
      console.error("Connection failed", err);
    }
  };

  const handleDisconnect = async () => {
    try {
      // @ts-ignore
      // Explicitly call disconnect if available
      await StellarWalletsKit.disconnect();
      setPublicKey(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      {!publicKey ? (
        <button onClick={handleConnect}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected: {publicKey}</p>
          <button onClick={handleDisconnect}>Disconnect</button>
        </div>
      )}
    </div>
  );
}
