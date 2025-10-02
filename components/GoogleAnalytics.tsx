"use client";

import { useEffect } from 'react';
import { useCookieConsent } from '@/hooks/useCookieConsent';

export default function GoogleAnalytics() {
  const { consentGiven, preferences } = useCookieConsent();

  useEffect(() => {
    if (consentGiven && preferences.analytics && typeof window !== 'undefined') {
      // Load Google Analytics
      if (!window.gtag) {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag(...args: unknown[]) {
          window.dataLayer.push(args);
        }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', 'GA_MEASUREMENT_ID', {
          anonymize_ip: true,
          allow_google_signals: false,
          allow_ad_personalization_signals: false,
        });
      }
    }
  }, [consentGiven, preferences.analytics]);

  // Only render if analytics cookies are accepted
  if (!consentGiven || !preferences.analytics) {
    return null;
  }

  return (
    <>
      {/* Google Analytics gtag script */}
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID', {
              anonymize_ip: true,
              allow_google_signals: false,
              allow_ad_personalization_signals: false,
            });
          `,
        }}
      />
    </>
  );
}

// Declare global gtag function for TypeScript
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}
