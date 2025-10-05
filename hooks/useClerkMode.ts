import { useMemo } from 'react';

export function useClerkMode(): 'modal' | 'redirect' {
  return useMemo(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return 'modal';
    }

    const userAgent = navigator.userAgent;

    // Check for Safari (but not Chrome on iOS)
    const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);

    // Safari on iOS has issues with modals, so use redirect
    // Also use redirect for Safari on desktop to be safe
    if (isSafari || isIOS) {
      return 'redirect';
    }

    // Use modal for other browsers
    return 'modal';
  }, []);
}
