import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { TICKET_STATUS } from "./constants";
import type { Doc, Id } from "./_generated/dataModel";

const PAGE_SIZE = 20;

type EventDoc = Doc<"events">;
type TicketDoc = Doc<"tickets">;
type UserDoc = Doc<"users">;

async function getSellerEvents(ctx: any, userId: string): Promise<EventDoc[]> {
  return await ctx.db
    .query("events")
    .filter((q: any) => q.eq(q.field("userId"), userId))
    .collect();
}

async function getTicketsForEvents(
  ctx: any,
  events: EventDoc[]
): Promise<Map<Id<"events">, TicketDoc[]>> {
  const map = new Map<Id<"events">, TicketDoc[]>();
  for (const event of events) {
    const tickets = await ctx.db
      .query("tickets")
      .withIndex("by_event", (q: any) => q.eq("eventId", event._id))
      .collect();
    map.set(event._id, tickets);
  }
  return map;
}

function isPaidTicket(ticket: TicketDoc) {
  return (
    ticket.status === TICKET_STATUS.VALID ||
    ticket.status === TICKET_STATUS.USED
  );
}

export const getOverview = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const events = await getSellerEvents(ctx, userId);
    if (events.length === 0) {
      return {
        totalEvents: 0,
        activeEvents: 0,
        upcomingEvents: 0,
        soldTickets: 0,
        refundedTickets: 0,
        revenue: 0,
        averageRevenuePerTicket: 0,
      };
    }

    const ticketMap = await getTicketsForEvents(ctx, events);
    const now = Date.now();
    let soldTickets = 0;
    let refunded = 0;
    let revenue = 0;

    for (const tickets of ticketMap.values()) {
      for (const ticket of tickets) {
        if (ticket.status === TICKET_STATUS.REFUNDED) {
          refunded += 1;
        }
        if (isPaidTicket(ticket)) {
          soldTickets += 1;
          revenue += ticket.amount ?? 0;
        }
      }
    }

    const activeEvents = events.filter(
      (event) => !event.is_cancelled && event.eventDate >= now
    ).length;

    const upcomingEvents = events.filter(
      (event) => !event.is_cancelled && event.eventDate > now
    ).length;

    return {
      totalEvents: events.length,
      activeEvents,
      upcomingEvents,
      soldTickets,
      refundedTickets: refunded,
      revenue,
      averageRevenuePerTicket: soldTickets > 0 ? revenue / soldTickets : 0,
    };
  },
});

export const getCustomers = query({
  args: {
    userId: v.string(),
    page: v.optional(v.number()),
  },
  handler: async (ctx, { userId, page = 1 }) => {
    const events = await getSellerEvents(ctx, userId);
    if (events.length === 0) {
      return {
        data: [],
        page: 1,
        pageSize: PAGE_SIZE,
        totalCount: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    }

    const ticketMap = await getTicketsForEvents(ctx, events);
    const eventLookup = new Map(events.map((event) => [event._id, event]));
    const allTickets: TicketDoc[] = [];
    for (const tickets of ticketMap.values()) {
      allTickets.push(...tickets);
    }

    const filteredTickets = allTickets.filter((ticket) =>
      [
        TICKET_STATUS.VALID,
        TICKET_STATUS.USED,
        TICKET_STATUS.REFUNDED,
      ].includes(ticket.status)
    );

    filteredTickets.sort((a, b) => b.purchasedAt - a.purchasedAt);

    const totalCount = filteredTickets.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
    const currentPage = Math.max(1, Math.min(page, totalPages));
    const start = (currentPage - 1) * PAGE_SIZE;
    const slice = filteredTickets.slice(start, start + PAGE_SIZE);

    const userCache = new Map<string, UserDoc | undefined>();

    const data = await Promise.all(
      slice.map(async (ticket) => {
        if (!userCache.has(ticket.userId)) {
          const user = await ctx.db
            .query("users")
            .withIndex("by_user_id", (q: any) => q.eq("userId", ticket.userId))
            .first();
          userCache.set(ticket.userId, user ?? undefined);
        }

        const user = userCache.get(ticket.userId);
        const event = eventLookup.get(ticket.eventId) as EventDoc;

        return {
          ticketId: ticket._id,
          customerName: user?.name ?? "Ukjent",
          customerEmail: user?.email ?? "Ukjent",
          eventName: event.name,
          amount: ticket.amount ?? 0,
          status: ticket.status,
          purchasedAt: ticket.purchasedAt,
          isVip: ticket.isVip ?? false,
        };
      })
    );

    return {
      data,
      page: currentPage,
      pageSize: PAGE_SIZE,
      totalCount,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    };
  },
});

export const getCustomersLight = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const events = await getSellerEvents(ctx, userId);
    if (events.length === 0) return [] as const;

    const ticketMap = await getTicketsForEvents(ctx, events);
    const uniqueUsers = new Map<string, UserDoc | undefined>();

    for (const tickets of ticketMap.values()) {
      for (const ticket of tickets) {
        if (!uniqueUsers.has(ticket.userId)) {
          const user = await ctx.db
            .query("users")
            .withIndex("by_user_id", (q: any) => q.eq("userId", ticket.userId))
            .first();
          uniqueUsers.set(ticket.userId, user ?? undefined);
        }
      }
    }

    return Array.from(uniqueUsers.entries()).map(([userId, user]) => ({
      userId,
      name: user?.name ?? "Ukjent",
      email: user?.email ?? "Ukjent",
      phone: user && "phone" in user ? (user as any).phone : "-",
    }));
  },
});

export const getSalesTrend = query({
  args: { userId: v.string(), days: v.optional(v.number()) },
  handler: async (ctx, { userId, days = 14 }) => {
    const events = await getSellerEvents(ctx, userId);
    if (events.length === 0) return [] as const;

    const ticketMap = await getTicketsForEvents(ctx, events);
    const startTime = Date.now() - days * 24 * 60 * 60 * 1000;
    const trend = new Map<
      string,
      { date: string; tickets: number; revenue: number }
    >();

    for (const tickets of ticketMap.values()) {
      for (const ticket of tickets) {
        if (!isPaidTicket(ticket)) continue;
        if (ticket.purchasedAt < startTime) continue;

        const dateKey = new Date(ticket.purchasedAt)
          .toISOString()
          .slice(0, 10);

        if (!trend.has(dateKey)) {
          trend.set(dateKey, { date: dateKey, tickets: 0, revenue: 0 });
        }

        const entry = trend.get(dateKey)!;
        entry.tickets += 1;
        entry.revenue += ticket.amount ?? 0;
      }
    }

    return Array.from(trend.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );
  },
});

export const getEventPerformance = query({
  args: { userId: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, { userId, limit = 5 }) => {
    const events = await getSellerEvents(ctx, userId);
    if (events.length === 0) return [] as const;

    const ticketMap = await getTicketsForEvents(ctx, events);

    const performance = events.map((event) => {
      const tickets = ticketMap.get(event._id) ?? [];
      let sold = 0;
      let revenue = 0;

      for (const ticket of tickets) {
        if (isPaidTicket(ticket)) {
          sold += 1;
          revenue += ticket.amount ?? 0;
        }
      }

      return {
        eventId: event._id,
        name: event.name,
        soldTickets: sold,
        revenue,
      };
    });

    return performance
      .sort((a, b) => b.soldTickets - a.soldTickets)
      .slice(0, limit);
  },
});

export const setVipStatus = mutation({
  args: { ticketId: v.id("tickets"), isVip: v.boolean() },
  handler: async (ctx, { ticketId, isVip }) => {
    await ctx.db.patch(ticketId, { isVip });
  },
});

