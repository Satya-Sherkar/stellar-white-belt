import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stellar DApp",
  description: "Connect your Stellar wallet and explore the decentralized world of Stellar with our DApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
