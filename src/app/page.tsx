"use client";

import { useState, useEffect } from "react";
import ConnectWalletButton from "@/components/connectWalletButton";
import WalletDashboard from "@/components/WalletDashboard";
//import SendPaymentForm from "@/components/SendPaymentForm";
import { StellarWalletsKit, KitEventType, KitEventStateUpdated } from "@creit-tech/stellar-wallets-kit";
import { initWalletKit } from "@/lib/stellar-wallets-kit";
import Link from "next/link";

export default function Home() {
  const [publicKey, setPublicKey] = useState<string | null>(null);

  useEffect(() => {
    // Initialize the kit on mount
    initWalletKit();

    // Check initial connection state
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

  function getStarted() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100]';
    modal.innerHTML = `
      <div class="glass rounded-3xl p-8 max-w-md w-full mx-4 border border-white/10">
      <h2 class="text-2xl font-bold mb-3 gradient-text">Welcome to Stellar DApp</h2>
      <p class="text-white/70 mb-6">Connect your wallet to get started and experience the future of finance.</p>
      <button class="btn-primary w-full py-3 rounded-full font-semibold">Got it!</button>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('button')?.addEventListener('click', () => modal.remove());
  }

  return (
    <div className="min-h-screen flex flex-col items-stretch relative">
      {/* Background Blobs */}
      <div className="fixed inset-0 z-[-1] overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 glass px-6 py-4 flex justify-between items-center mx-4 mt-4 rounded-2xl">
        <div className="text-2xl font-bold tracking-tighter">
          <span className="gradient-text">Stellar</span>
          <span className="text-white">DApp</span>
        </div>
        <ConnectWalletButton />
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-20 flex flex-col items-center w-full">
        {publicKey ? (
          // Dashboard for connected wallet
          <div className="w-full space-y-8">
            <div>
              <h2 className="text-4xl font-bold mb-2 text-white">Your Wallet</h2>
              <p className="text-white/60">Manage your funds and send payments on the Stellar network</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <WalletDashboard publicKey={publicKey} />
              </div>
              <div>
                {/*<SendPaymentForm publicKey={publicKey} />*/}
              </div>
            </div>
          </div>
        ) : (
          // Landing page for disconnected wallet
          <>
            {/* Hero Section */}
            <section className="text-center mb-32">
              <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-6 leading-tight">
                The Future of Finance <br />
                <span className="gradient-text">Built on Stellar</span>
              </h1>
              <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
                Experience lightning-fast transactions, low fees, and global reach.
                Join the decentralized revolution with our modern Stellar-powered application.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={getStarted} className="btn-primary text-lg px-10 py-4">
                  Get Started
                </button>
                <Link href="https://stellar.org/" target="_blank">
                  <button className="glass px-10 py-4 rounded-full font-semibold hover:bg-white/10 transition-all cursor-pointer">
                    Learn More
                  </button>
                </Link>
              </div>
            </section>

            {/* Features Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              <div className="glass p-8 rounded-3xl hover:border-white/20 transition-all group">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">Lightning Fast</h3>
                <p className="text-white/50 leading-relaxed">
                  Experience sub-second settlement times and high throughput on the Stellar network.
                </p>
              </div>

              <div className="glass p-8 rounded-3xl hover:border-white/20 transition-all group">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">Low Fees</h3>
                <p className="text-white/50 leading-relaxed">
                  Send money across borders for fractions of a cent. Accessibility at its best.
                </p>
              </div>

              <div className="glass p-8 rounded-3xl hover:border-white/20 transition-all group">
                <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9-3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">Global Reach</h3>
                <p className="text-white/50 leading-relaxed">
                  Connect to a worldwide financial system that never sleeps and works for everyone.
                </p>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="px-6 py-12 text-center text-white/30 text-sm">
        <div className="flex justify-center gap-8 mb-6">
          <a href="#" className="hover:text-white/60 transition-colors">Twitter</a>
          <a href="#" className="hover:text-white/60 transition-colors">GitHub</a>
          <a href="#" className="hover:text-white/60 transition-colors">Discord</a>
        </div>
        <p>© 2026 Stellar DApp. All rights reserved.</p>
      </footer>
    </div>
  );
}
