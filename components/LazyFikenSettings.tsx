"use client";

import dynamic from 'next/dynamic';

// Lazy load the FikenSettings component
const FikenSettings = dynamic(
  () => import('./FikenSettings').then(mod => ({ default: mod.default })),
  {
    loading: () => (
      <div className="animate-pulse space-y-4 p-4">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    ),
    ssr: false
  }
);

export default function LazyFikenSettings() {
  return <FikenSettings />;
}
