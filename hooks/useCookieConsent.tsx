"use client";

import { useState, useEffect, createContext, useContext } from 'react';

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieConsentContextType {
  consentGiven: boolean;
  preferences: CookiePreferences;
  showBanner: boolean;
  showPreferences: boolean;
  setConsent: (given: boolean) => void;
  updatePreferences: (prefs: CookiePreferences) => void;
  hideBanner: () => void;
  setShowPreferences: (show: boolean) => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
}

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [consentGiven, setConsentGiven] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  // Load consent and preferences from localStorage on mount
  useEffect(() => {
    const storedConsent = localStorage.getItem('cookie-consent');
    const storedPreferences = localStorage.getItem('cookie-preferences');

    if (storedConsent === 'true') {
      setConsentGiven(true);
      if (storedPreferences) {
        try {
          const parsedPrefs = JSON.parse(storedPreferences);
          setPreferences(parsedPrefs);
        } catch (error) {
          console.error('Error parsing stored cookie preferences:', error);
        }
      }
    } else {
      // Show banner if no consent has been given
      setShowBanner(true);
    }
  }, []);

  const setConsent = (given: boolean) => {
    setConsentGiven(given);
    localStorage.setItem('cookie-consent', given.toString());
  };

  const updatePreferences = (newPreferences: CookiePreferences) => {
    setPreferences(newPreferences);
    localStorage.setItem('cookie-preferences', JSON.stringify(newPreferences));
  };

  const hideBanner = () => {
    setShowBanner(false);
  };

  // Google Analytics is handled by the GoogleAnalytics component

  const value: CookieConsentContextType = {
    consentGiven,
    preferences,
    showBanner,
    showPreferences,
    setConsent,
    updatePreferences,
    hideBanner,
    setShowPreferences,
  };

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}

// Declare global gtag function for TypeScript
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}
