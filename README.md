# Stellar White Belt 🌟

A modern, user-friendly Stellar blockchain dApp built with Next.js and React. Connect your wallet, view your assets, and send XLM payments directly from your browser.

---

## 🛠️ Tech Stack

<div>
  <img src="https://img.shields.io/badge/Next.js-16.1-000?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Stellar%20SDK-14.5-1E90FF?logo=stellar" alt="Stellar SDK" />
  <img src="https://img.shields.io/badge/pnpm-9.x-F69220?logo=pnpm" alt="pnpm" />
</div>

---

## 📋 Project Description

**Stellar White Belt** is an educational and functional Stellar blockchain dApp that demonstrates core blockchain interactions including wallet connectivity, asset management, and payment transactions. This project serves as an excellent learning resource for developers looking to build on the Stellar network.

### Key Features

- ✅ **Wallet Connection** - Connect your Stellar wallet using Stellar Wallets Kit
- 🔐 **Secure Authentication** - Safe wallet connection with browser-based signing
- 💰 **View Assets** - Display all assets held in your wallet
- 📤 **Send Payments** - Send XLM to other Stellar accounts with memo support
- 🧮 **Account Details** - View your public key and account information
- 🌐 **Testnet Support** - Built for Stellar Testnet with easy mainnet migration
- 🎨 **Modern UI** - Clean, responsive interface built with TailwindCSS

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:

- **Node.js**: v18.0 or higher ([Download](https://nodejs.org/))
- **pnpm**: v9.x ([Installation Guide](https://pnpm.io/installation))
- **Git**: For cloning the repository

### Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Satya-Sherkar/stellar-white-belt.git
   cd stellar-white-belt
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Run the development server**

   ```bash
   pnpm dev
   ```

4. **Open in your browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - The application will automatically reload on file changes

### Building for Production

```bash
# Build the application
pnpm build

# Start the production server
pnpm start
```

### Linting

```bash
# Run ESLint
pnpm lint
```

---

## 📂 Project Structure

```
stellar-white-belt/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── page.tsx            # Main home page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── connectWalletButton.tsx    # Wallet connection UI
│   │   ├── SendPaymentForm.tsx        # Payment transaction form
│   │   └── WalletDashboard.tsx        # User account dashboard
│   └── lib/
│       └── stellar-wallets-kit.ts     # Stellar SDK initialization
├── package.json                # Project dependencies
├── tsconfig.json               # TypeScript configuration
├── next.config.ts              # Next.js configuration
├── postcss.config.mjs          # TailwindCSS configuration
└── README.md                   # This file
```

---

## 💻 Usage

### Connecting Your Wallet

1. Click the **"Connect Wallet"** button on the home page
2. Select your preferred Stellar wallet from the available options
3. Approve the connection in your wallet extension
4. Your public key and assets will display on the dashboard

### Sending Payments

1. Once connected, navigate to the **Send Payment** section
2. Enter the recipient's Stellar public address (must start with 'G')
3. Specify the amount of XLM to send
4. Optionally add a memo for the transaction
5. Click **Send** and approve the transaction in your wallet

### Viewing Account Information

- The **Wallet Dashboard** displays:
  - Your public key
  - List of asset balances
  - Account details and native balance

---

### Screenshots

**Dapp UI and Connect Button**

![Dapp UI and Connect Button](/public/1.png)

**Connect Wallet**
![Connect Wallet](/public/2.png)

**Approve in Wallet to connect**
![Approve in Wallet to connect](/public/3.png)

**Main Dashboard with wallet balance, Paayment form and recent transactions**
![Main Dashboard](/public/4.png)

**Feedback to user after successfull payment**
![Feedback to user](/public/5.png)

## 🔗 Stellar Resources

- [Stellar Developer Docs](https://developers.stellar.org/)
- [Stellar SDK Reference](https://js.stellar.org/)
- [Stellar Wallets Kit](https://github.com/creittech/stellar-wallets-kit)
- [Stellar Testnet](https://testnet.stellar.org/)
- [Friendbot - Testnet Account Funding](https://developers.stellar.org/docs/learn/fundamentals/testnet#create-account)

---

## 📝 Development Notes

### Network Configuration

This dApp is currently configured to use the **Stellar Testnet**:

- Network Passphrase: `Test SDF Network ; September 2015`
- Horizon API: `https://horizon-testnet.stellar.org`

To switch to mainnet, update the network configuration in `src/components/SendPaymentForm.tsx`.

### Creating Test Accounts

1. Visit [Friendbot](https://developers.stellar.org/docs/learn/fundamentals/testnet#create-account)
2. Enter a public key from a wallet you want to fund
3. You'll receive 10,000 test lumens (XLM)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## ⚠️ Disclaimer

This is an educational project. Always test thoroughly on testnet before deploying to mainnet. Never share your private keys or seed phrases. Use this project only for learning purposes.

---

## 🆘 Support & Troubleshooting

### Issue: Wallet connection fails

- Ensure you have a Stellar-compatible wallet extension installed
- Try refreshing the page
- Check browser console for detailed error messages

### Issue: Transaction fails

- Verify the recipient address starts with 'G' (Stellar addresses)
- Ensure you have sufficient balance
- Check network connectivity

### Issue: Dependencies won't install

```bash
# Clear pnpm cache
pnpm store prune

# Reinstall dependencies
pnpm install
```

For more help, check the [Stellar Developer Discord](https://discord.gg/stellar).

---

## 📧 Contact

For questions or suggestions, feel free to open an issue or reach out through GitHub.

**Happy coding! 🚀**
