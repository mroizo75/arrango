import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { ConditionalHeader } from "@/components/ConditionalHeader";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";
import SyncUserWithConvex from "@/components/SyncUserWithConvex";
import { CookieConsentProvider } from "@/hooks/useCookieConsent";
import ClientWrapper from "@/components/ClientWrapper";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "Arrango - Billetter til arrangementer | Finn og kjøp billetter",
    template: "%s | Arrango"
  },
  description: "Finn og kjøp billetter til konserter, festivaler, teater og arrangementer over hele verden. Sikker billettkjøp med Stripe. Støtter flere valutaer. Gratis for arrangører - start ditt arrangement i dag!",
  keywords: [
    "billetter",
    "arrangementer",
    "konserter",
    "festivaler",
    "teater",
    "events",
    "tickets",
    "kjøp billetter",
    "billettkjøp",
    "arrangør",
    "event management",
    "ticket sales",
    "live events",
    "kulturarrangementer",
    "underholdning",
    "internasjonale arrangementer",
    "worldwide events"
  ],
  authors: [{ name: "Arrango" }],
  creator: "Arrango",
  publisher: "Arrango",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://arrango.no"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/android-chrome-512x512.png",
      },
      {
        rel: "manifest",
        url: "/manifest.json",
      },
    ],
  },
  openGraph: {
    title: "Arrango - Billetter til arrangementer verden over",
    description: "Finn og kjøp billetter til de beste arrangementene over hele verden. Sikker billettkjøp med Stripe. Støtter flere valutaer. Gratis for arrangører!",
    url: "https://arrango.no",
    siteName: "Arrango",
    locale: "nb_NO",
    type: "website",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Arrango - Internasjonal billettplattform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arrango - Billetter til arrangementer verden over",
    description: "Finn og kjøp billetter til de beste arrangementene over hele verden. Sikker billettkjøp med Stripe.",
    images: ["/images/logo.png"],
    creator: "@arrango",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "7dVVHDDUQGxCY9Q9x643uiUrybWB5GcRmRL6yYGVPhM",
    other: {
      "google-site-verification": "7dVVHDDUQGxCY9Q9x643uiUrybWB5GcRmRL6yYGVPhM",
    },
  },
  other: {
    "cache-control": "public, max-age=3600, s-maxage=3600",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nb">
      <head>
        {/* Essential preconnects */}
        <link rel="preconnect" href="https://ceaseless-tapir-769.convex.cloud" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://js.stripe.com" crossOrigin="anonymous" />

        {/* Prevent layout shift for web fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/fonts/GeistVF.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />

        {/* Critical CSS for font loading */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @font-face {
              font-family: 'Geist';
              font-style: normal;
              font-weight: 100 900;
              font-display: swap;
              src: url('/fonts/GeistVF.woff') format('woff');
            }
          `
        }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CookieConsentProvider>
          <ClerkProvider>
            <ConvexClientProvider>
              <ConditionalHeader />
              <SyncUserWithConvex />
              <ClientWrapper>
                {children}
                <Footer />
                <Toaster />
              </ClientWrapper>
            </ConvexClientProvider>
          </ClerkProvider>
        </CookieConsentProvider>
      </body>
    </html>
  );
}
