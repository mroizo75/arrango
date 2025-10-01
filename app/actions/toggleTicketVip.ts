'use server';

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { getConvexClient } from "@/lib/convex";

export async function toggleTicketVip({
  ticketId,
  isVip,
}: {
  ticketId: string;
  isVip: boolean;
}) {
  const convex = getConvexClient();
  await convex.mutation(api.sellerDashboard.setVipStatus, {
    ticketId: ticketId as Id<"tickets">,
    isVip,
  });
}
