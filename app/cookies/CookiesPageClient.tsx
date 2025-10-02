"use client";

import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export default function CookiesPageClient() {
  const handleOpenPreferences = () => {
    const event = new CustomEvent('openCookiePreferences');
    window.dispatchEvent(event);
  };

  return (
    <Button
      variant="outline"
      onClick={handleOpenPreferences}
      className="flex items-center gap-2"
    >
      <Settings className="w-4 h-4" />
      Endre innstillinger
    </Button>
  );
}
