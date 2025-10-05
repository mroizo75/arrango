"use client";

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Footer from './Footer';

// Dynamically import client components to avoid SSR issues
const CookieConsent = dynamic(() => import('@/components/CookieConsent'), {
  ssr: false,
});
const GoogleAnalytics = dynamic(() => import('@/components/GoogleAnalytics'), {
  ssr: false,
});

interface ClientWrapperProps {
  children: ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  return (
    <>
      {children}
      {!isDashboard && <Footer />}
      <CookieConsent />
      <GoogleAnalytics />
    </>
  );
}
