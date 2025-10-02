import type { Metadata } from "next";
import { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { getConvexClient } from "@/lib/convex";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export const metadata: Metadata = {
  title: "Arrango Dashboard",
};

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  // Check if user has any events (is a seller)
  const convex = getConvexClient();
  const events = await convex.query(api.events.getSellerEvents, { userId });

  if (events.length === 0) {
    // User is not a seller, redirect to home
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <DashboardSidebar />
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
