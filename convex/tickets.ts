import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getUserTicketForEvent = query({
  args: {
    eventId: v.id("events"),
    userId: v.string(),
  },
  handler: async (ctx, { eventId, userId }) => {
    const ticket = await ctx.db
      .query("tickets")
      .withIndex("by_user_event", (q) =>
        q.eq("userId", userId).eq("eventId", eventId)
      )
      .first();

    return ticket;
  },
});

export const getTicketWithDetails = query({
  args: { ticketId: v.id("tickets") },
  handler: async (ctx, { ticketId }) => {
    const ticket = await ctx.db.get(ticketId);
    if (!ticket) return null;

    const event = await ctx.db.get(ticket.eventId);

    return {
      ...ticket,
      event,
    };
  },
});

export const getValidTicketsForEvent = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, { eventId }) => {
    return await ctx.db
      .query("tickets")
      .withIndex("by_event", (q) => q.eq("eventId", eventId))
      .filter((q) =>
        q.or(q.eq(q.field("status"), "valid"), q.eq(q.field("status"), "used"))
      )
      .collect();
  },
});

export const updateTicketStatus = mutation({
  args: {
    ticketId: v.id("tickets"),
    status: v.union(
      v.literal("valid"),
      v.literal("used"),
      v.literal("refunded"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, { ticketId, status }) => {
    await ctx.db.patch(ticketId, { status });
  },
});

export const updateVipStatus = mutation({
  args: {
    ticketId: v.id("tickets"),
    isVip: v.boolean(),
  },
  handler: async (ctx, { ticketId, isVip }) => {
    await ctx.db.patch(ticketId, { isVip });
  },
});

export const getSellerTicketsPaginated = query({
  args: {
    page: v.number(),
    pageSize: v.number(),
  },
  handler: async (ctx, { page, pageSize }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return {
        data: [],
        page,
        pageSize,
        totalCount: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    }

    const userId = identity.subject;

    // Get all events for this seller
    const events = await ctx.db
      .query("events")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    const eventIds = events.map((e) => e._id);

    if (eventIds.length === 0) {
      return {
        data: [],
        page,
        pageSize,
        totalCount: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    }

    // Get total count first
    let totalCount = 0;
    for (const eventId of eventIds) {
      const count = await ctx.db
        .query("tickets")
        .withIndex("by_event", (q) => q.eq("eventId", eventId))
        .collect();
      totalCount += count.length;
    }

    const totalPages = Math.ceil(totalCount / pageSize);
    const offset = (page - 1) * pageSize;

    // Get tickets with pagination
    const allTickets = [];
    for (const eventId of eventIds) {
      const tickets = await ctx.db
        .query("tickets")
        .withIndex("by_event", (q) => q.eq("eventId", eventId))
        .collect();

      for (const ticket of tickets) {
        const event = events.find((e) => e._id === ticket.eventId);
        if (event) {
          allTickets.push({
            ticketId: ticket._id,
            userId: ticket.userId,
            eventName: event.name,
            customerName: "Unknown", // We'll get this from user data
            customerEmail: "unknown@example.com",
            amount: ticket.amount ?? 0,
            status: ticket.status,
            purchasedAt: ticket.purchasedAt,
            isVip: ticket.isVip ?? false,
            event,
          });
        }
      }
    }

    // Sort by purchased date (newest first) and paginate
    allTickets.sort((a, b) => b.purchasedAt - a.purchasedAt);
    const paginatedTickets = allTickets.slice(offset, offset + pageSize);

    // Enrich with user data
    const enrichedTickets = await Promise.all(
      paginatedTickets.map(async (ticket) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_user_id", (q) => q.eq("userId", ticket.userId))
          .first();

        return {
          ticketId: ticket.ticketId,
          userId: ticket.userId,
          eventName: ticket.eventName,
          customerName: user?.name || "Unknown User",
          customerEmail: user?.email || ticket.userId,
          amount: new Intl.NumberFormat("nb-NO", {
            style: "currency",
            currency: "NOK",
            minimumFractionDigits: 0,
          }).format((ticket.amount ?? 0) / 100),
          status: ticket.status,
          purchasedAt: ticket.purchasedAt,
          isVip: ticket.isVip,
        };
      })
    );

    return {
      data: enrichedTickets,
      page,
      pageSize,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  },
});