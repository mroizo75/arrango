import { requireAuth } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import SettingsPageClient from "./SettingsPageClient";
import Spinner from "@/components/Spinner";

export default async function SellerSettingsPage() {
  const user = await requireAuth().catch(() => redirect("/sign-in"));
  if (!user) redirect("/sign-in");

  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Spinner /></div>}>
      <SettingsPageClient />
    </Suspense>
  );
}