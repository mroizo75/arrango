"use client";

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

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
  return (
    <>
      {children}
      <CookieConsent />
      <GoogleAnalytics />
    </>
  );
}
