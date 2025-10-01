import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SellerTicketsClientWrapper } from "@/components/SellerTicketsClientWrapper";

export default async function SellerTicketsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  return <SellerTicketsClientWrapper />;
}