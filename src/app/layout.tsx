import type { Metadata } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { IntroOfferProvider } from "@/context/IntroOfferContext";
import { IntroOfferModal } from "@/components/IntroOfferModal";
import { ToastProvider } from "@/context/ToastContext";

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
          <ToastProvider>
            <CurrencyProvider>
              <IntroOfferProvider>
                {children}
                <IntroOfferModal />
              </IntroOfferProvider>
            </CurrencyProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
