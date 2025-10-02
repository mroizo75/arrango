'use client';

import { usePathname } from "next/navigation";
import HeaderWrapper from "@/components/HeaderWrapper";

function ConditionalHeaderInner() {
  const pathname = usePathname();

      // Skjul Header på alle /dashboard-sider
      if (pathname?.startsWith("/dashboard")) {
        return null;
      }

  return <HeaderWrapper />;
}

export function ConditionalHeader() {
  return <ConditionalHeaderInner />;
}
