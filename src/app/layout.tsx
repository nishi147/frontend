import type { Metadata } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CurrencyProvider } from "@/context/CurrencyContext";

const baloo = Baloo_2({ 
  subsets: ["latin"],
  variable: '--font-baloo',
  weight: ['400', '500', '600', '700', '800']
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: '--font-nunito',
  weight: ['400', '600', '700']
});

export const metadata: Metadata = {
  title: "RUZANN - Learning is Fun!",
  description: "A playful and colorful EdTech platform for kids",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${baloo.variable} ${nunito.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
          <CurrencyProvider>
            {children}
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
