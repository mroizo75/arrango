'use client'

import { usePathname } from "next/navigation";
import Header from "@/components/Header";

export function ConditionalHeader() {
  const pathname = usePathname();
  
  // Skjul Header på alle /seller-sider
  if (pathname?.startsWith("/seller")) {
    return null;
  }
  
  return <Header />;
}
