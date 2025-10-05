import { requireAuth } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import { SellerTicketsClientWrapper } from "@/components/SellerTicketsClientWrapper";

export default async function SellerTicketsPage() {
  const user = await requireAuth().catch(() => redirect("/sign-in"));
  if (!user) redirect("/sign-in");

  return <SellerTicketsClientWrapper />;
}