import type { Metadata } from "next";
import { ReactNode } from "react";
import { requireAuth } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { getConvexClient } from "@/lib/convex";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export const metadata: Metadata = {
  title: "Arrango Dashboard",
};

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await requireAuth().catch(() => redirect("/sign-in"));
  if (!user) redirect("/sign-in");
  const userId = user.id;

  // Check if user is an organizer
  const convex = getConvexClient();
  const organizerProfile = await convex.query(api.organizerProfile.getOrganizerProfileByUserId, { userId });

  if (!organizerProfile || !organizerProfile.isOrganizer) {
    // User is not an organizer, redirect to home
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
