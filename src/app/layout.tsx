import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wallet Key Explorer",
  description: "Offline Bitcoin wallet key, descriptor and multisig exploration tools.",
  applicationName: "Wallet Key Explorer",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
