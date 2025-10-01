import type { Metadata } from "next";
import { ReactNode } from "react";
import { SellerDashboardSidebar } from "@/components/SellerDashboardSidebar";

export const metadata: Metadata = {
  title: "Arrango Seller Dashboard",
};

export default function SellerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <SellerDashboardSidebar />
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
