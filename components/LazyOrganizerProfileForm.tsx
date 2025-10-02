"use client";

import dynamic from 'next/dynamic';

// Lazy load the heavy OrganizerProfileForm component
const OrganizerProfileForm = dynamic(
  () => import('./OrganizerProfileForm').then(mod => ({ default: mod.OrganizerProfileForm })),
  {
    loading: () => (
      <div className="space-y-4 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    ),
    ssr: false // Disable SSR for this component to improve initial load
  }
);

export default function LazyOrganizerProfileForm() {
  return <OrganizerProfileForm />;
}
