import type { Metadata } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { IntroOfferProvider } from "@/context/IntroOfferContext";
import { IntroOfferModal } from "@/components/IntroOfferModal";
import { ToastProvider } from "@/context/ToastContext";
import { GoogleAnalytics } from '@next/third-parties/google';
import { AnalyticsProviders } from "@/components/AnalyticsProviders";
import MetaPixel from "@/components/MetaPixel";
import GoogleAnalyticsHandler from "@/components/GoogleAnalyticsHandler";
import AdSense from "@/components/AdSense";
import { Suspense } from "react";
import { CookieBanner } from "@/components/ui/CookieBanner";

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
  verification: {
    google: process.env.NEXT_PUBLIC_SEARCH_CONSOLE_VERIFICATION || "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${baloo.variable} ${nunito.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <GoogleAnalytics gaId="G-JK7E9ELJNE" />
        <GoogleAnalyticsHandler />
        <AdSense />
        <Suspense fallback={null}>
          <MetaPixel />
        </Suspense>
        
        <AnalyticsProviders>
          <AuthProvider>
            <ToastProvider>
              <CurrencyProvider>
                <IntroOfferProvider>
                  {children}
                  <IntroOfferModal />
                  <CookieBanner />
                </IntroOfferProvider>
              </CurrencyProvider>
            </ToastProvider>
          </AuthProvider>
        </AnalyticsProviders>
      </body>
    </html>
  );
}
