'use client';

import { usePathname } from "next/navigation";
import HeaderWrapper from "@/components/HeaderWrapper";

function ConditionalHeaderInner() {
  const pathname = usePathname();

  // Skjul Header på alle /seller-sider
  if (pathname?.startsWith("/seller")) {
    return null;
  }

  return <HeaderWrapper />;
}

export function ConditionalHeader() {
  return <ConditionalHeaderInner />;
}
