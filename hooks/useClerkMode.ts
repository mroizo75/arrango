import { useMemo } from 'react';

export function useClerkMode(): 'modal' | 'redirect' {
  // Since we now have dedicated /sign-in and /sign-up pages,
  // we can safely use redirect mode for all browsers to avoid WebView issues
  return 'redirect';
}
