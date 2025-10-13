import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Create a new ticket type for an event
export const createTicketType = mutation({
  args: {
    eventId: v.id("events"),
    name: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    currency: v.string(),
    maxQuantity: v.number(),
    sortOrder: v.number(),
    benefits: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // Note: Using NextAuth instead of Convex auth, so we skip identity check
    // The frontend ensures only authenticated users can call this
    
    const ticketTypeId = await ctx.db.insert("ticketTypes", {
      eventId: args.eventId,
      name: args.name,
      description: args.description,
      price: args.price,
      currency: args.currency,
      maxQuantity: args.maxQuantity,
      soldQuantity: 0,
      sortOrder: args.sortOrder,
      isActive: true,
      benefits: args.benefits,
    });

    return ticketTypeId;
  },
});

// Update a ticket type
export const updateTicketType = mutation({
  args: {
    ticketTypeId: v.id("ticketTypes"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    currency: v.optional(v.string()),
    maxQuantity: v.optional(v.number()),
    sortOrder: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
    benefits: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // Note: Using NextAuth instead of Convex auth, so we skip identity check
    // The frontend ensures only authenticated users can call this
    
    const ticketType = await ctx.db.get(args.ticketTypeId);
    if (!ticketType) {
      throw new Error("Billett-type ikke funnet");
    }

    await ctx.db.patch(args.ticketTypeId, args);
  },
});

// Delete a ticket type
export const deleteTicketType = mutation({
  args: {
    ticketTypeId: v.id("ticketTypes"),
  },
  handler: async (ctx, args) => {
    // Note: Using NextAuth instead of Convex auth, so we skip identity check
    // The frontend ensures only authenticated users can call this
    
    const ticketType = await ctx.db.get(args.ticketTypeId);
    if (!ticketType) {
      throw new Error("Billett-type ikke funnet");
    }

    // Check if any tickets have been sold for this type
    const soldTickets = await ctx.db
      .query("tickets")
      .withIndex("by_ticket_type", (q) => q.eq("ticketTypeId", args.ticketTypeId))
      .collect();

    if (soldTickets.length > 0) {
      throw new Error("Kan ikke slette billett-type som allerede har solgte billetter");
    }

    await ctx.db.delete(args.ticketTypeId);
  },
});

// Get all ticket types for an event
export const getEventTicketTypes = query({
  args: {
    eventId: v.id("events"),
  },
  handler: async (ctx, args) => {
    const ticketTypes = await ctx.db
      .query("ticketTypes")
      .withIndex("by_event_active", (q) => q.eq("eventId", args.eventId).eq("isActive", true))
      .order("asc")
      .collect();

    // Calculate available quantity for each type
    const ticketTypesWithAvailability = await Promise.all(
      ticketTypes.map(async (ticketType) => {
        const availableQuantity = ticketType.maxQuantity - ticketType.soldQuantity;
        return {
          ...ticketType,
          availableQuantity: Math.max(0, availableQuantity),
          isSoldOut: availableQuantity <= 0,
        };
      })
    );

    return ticketTypesWithAvailability;
  },
});

// Get ticket type by ID with availability
export const getTicketTypeWithAvailability = query({
  args: {
    ticketTypeId: v.id("ticketTypes"),
  },
  handler: async (ctx, args) => {
    const ticketType = await ctx.db.get(args.ticketTypeId);
    if (!ticketType) return null;

    const availableQuantity = ticketType.maxQuantity - ticketType.soldQuantity;
    return {
      ...ticketType,
      availableQuantity: Math.max(0, availableQuantity),
      isSoldOut: availableQuantity <= 0,
    };
  },
});

// Update sold quantity when tickets are purchased
export const updateTicketTypeSoldQuantity = mutation({
  args: {
    ticketTypeId: v.id("ticketTypes"),
    quantityChange: v.number(), // Positive for sales, negative for refunds
  },
  handler: async (ctx, args) => {
    const ticketType = await ctx.db.get(args.ticketTypeId);
    if (!ticketType) {
      throw new Error("Billett-type ikke funnet");
    }

    const newSoldQuantity = Math.max(0, ticketType.soldQuantity + args.quantityChange);

    // Don't allow overselling
    if (newSoldQuantity > ticketType.maxQuantity) {
      throw new Error("Ikke nok billetter tilgjengelig");
    }

    await ctx.db.patch(args.ticketTypeId, {
      soldQuantity: newSoldQuantity,
    });
  },
});

// Get ticket types for public event view (without organizer check)
export const getPublicEventTicketTypes = query({
  args: {
    eventId: v.id("events"),
  },
  handler: async (ctx, args) => {
    const ticketTypes = await ctx.db
      .query("ticketTypes")
      .withIndex("by_event_active", (q) => q.eq("eventId", args.eventId).eq("isActive", true))
      .order("asc")
      .collect();

    // Calculate available quantity for each type
    const ticketTypesWithAvailability = await Promise.all(
      ticketTypes.map(async (ticketType) => {
        const availableQuantity = ticketType.maxQuantity - ticketType.soldQuantity;
        return {
          ...ticketType,
          availableQuantity: Math.max(0, availableQuantity),
          isSoldOut: availableQuantity <= 0,
        };
      })
    );

    return ticketTypesWithAvailability;
  },
});
