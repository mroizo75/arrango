"use server";

import { getConvexClient } from "@/lib/convex";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { auth } from "@clerk/nextjs/server";

export async function createDirectPurchase({
  eventId,
  tickets,
  userId,
}: {
  eventId: Id<"events">;
  tickets: Array<{
    ticketTypeId: Id<"ticketTypes">;
    recipientName: string;
    recipientEmail: string;
    id: string;
  }>;
  userId: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { userId: authenticatedUserId } = await auth();
    if (!authenticatedUserId || authenticatedUserId !== userId) {
      throw new Error("Not authenticated");
    }

    const convex = getConvexClient();

    // Get event details
    const event = await convex.query(api.events.getById, { eventId });
    if (!event) throw new Error("Event not found");

    // Create a temporary waiting list entry for the purchase
    const waitingListId = await convex.mutation(api.waitingList.createTemporaryOffer, {
      eventId,
      userId,
    });

    // Calculate total amount (should be 0 for free tickets)
    let totalAmount = 0;
    for (const ticket of tickets) {
      const ticketType = await convex.query(api.ticketTypes.getTicketTypeWithAvailability, {
        ticketTypeId: ticket.ticketTypeId,
      });
      if (!ticketType) {
        throw new Error(`Ticket type not found: ${ticket.ticketTypeId}`);
      }
      totalAmount += ticketType.price;
    }

    if (totalAmount > 0) {
      throw new Error("Direct purchase only allowed for free tickets");
    }

    // Create the tickets directly
    const paymentInfo = {
      paymentIntentId: `free-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      amount: 0,
      tickets: tickets,
    };

    await convex.mutation(api.events.purchaseTicket, {
      eventId,
      userId,
      waitingListId,
      paymentInfo,
    });

    return { success: true };
  } catch (error) {
    console.error("Direct purchase error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}
