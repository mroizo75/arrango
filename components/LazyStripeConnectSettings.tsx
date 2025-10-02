"use client";

import dynamic from 'next/dynamic';

// Lazy load the StripeConnectSettings component
const StripeConnectSettings = dynamic(
  () => import('./StripeConnectSettings').then(mod => ({ default: mod.default })),
  {
    loading: () => (
      <div className="animate-pulse space-y-4 p-4">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    ),
    ssr: false
  }
);

export default function LazyStripeConnectSettings() {
  return <StripeConnectSettings />;
}
