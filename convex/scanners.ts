import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Generate a random 6-character access code
function generateAccessCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Exclude confusing chars
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Create a new scanner for an event
export const createScanner = mutation({
  args: {
    eventId: v.id("events"),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Ikke autentisert");
    }

    const userId = identity.subject;

    // Verify user is the event organizer
    const event = await ctx.db.get(args.eventId);
    if (!event || event.userId !== userId) {
      throw new Error("Du har ikke tilgang til å opprette scannere for dette eventet");
    }

    // Generate unique access code
    let accessCode = generateAccessCode();
    let existingScanner = await ctx.db
      .query("scanners")
      .withIndex("by_access_code", (q) => q.eq("accessCode", accessCode))
      .first();

    // Keep generating until we get a unique code
    while (existingScanner) {
      accessCode = generateAccessCode();
      existingScanner = await ctx.db
        .query("scanners")
        .withIndex("by_access_code", (q) => q.eq("accessCode", accessCode))
        .first();
    }

    const scannerId = await ctx.db.insert("scanners", {
      eventId: args.eventId,
      name: args.name,
      email: args.email,
      phone: args.phone,
      accessCode,
      isActive: true,
      createdBy: userId,
      createdAt: Date.now(),
    });

    return scannerId;
  },
});

// Get all scanners for an event
export const getEventScanners = query({
  args: {
    eventId: v.id("events"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const userId = identity.subject;

    // Verify user is the event organizer
    const event = await ctx.db.get(args.eventId);
    if (!event || event.userId !== userId) {
      return [];
    }

    const scanners = await ctx.db
      .query("scanners")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    return scanners;
  },
});

// Get all scanners created by the current user
export const getMyScanners = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const userId = identity.subject;

    const scanners = await ctx.db
      .query("scanners")
      .withIndex("by_created_by", (q) => q.eq("createdBy", userId))
      .collect();

    // Enrich with event data
    const enrichedScanners = await Promise.all(
      scanners.map(async (scanner) => {
        const event = await ctx.db.get(scanner.eventId);
        return {
          ...scanner,
          event,
        };
      })
    );

    return enrichedScanners;
  },
});

// Toggle scanner active status
export const toggleScannerStatus = mutation({
  args: {
    scannerId: v.id("scanners"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Ikke autentisert");
    }

    const userId = identity.subject;

    const scanner = await ctx.db.get(args.scannerId);
    if (!scanner) {
      throw new Error("Scanner ikke funnet");
    }

    // Verify user is the creator
    if (scanner.createdBy !== userId) {
      throw new Error("Du har ikke tilgang til å endre denne scanneren");
    }

    await ctx.db.patch(args.scannerId, {
      isActive: !scanner.isActive,
    });

    return !scanner.isActive;
  },
});

// Delete a scanner
export const deleteScanner = mutation({
  args: {
    scannerId: v.id("scanners"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Ikke autentisert");
    }

    const userId = identity.subject;

    const scanner = await ctx.db.get(args.scannerId);
    if (!scanner) {
      throw new Error("Scanner ikke funnet");
    }

    // Verify user is the creator
    if (scanner.createdBy !== userId) {
      throw new Error("Du har ikke tilgang til å slette denne scanneren");
    }

    await ctx.db.delete(args.scannerId);
  },
});

// Verify access code (for public scanner page)
export const verifyAccessCode = query({
  args: {
    accessCode: v.string(),
  },
  handler: async (ctx, args) => {
    const scanner = await ctx.db
      .query("scanners")
      .withIndex("by_access_code", (q) => q.eq("accessCode", args.accessCode))
      .first();

    if (!scanner || !scanner.isActive) {
      return null;
    }

    const event = await ctx.db.get(scanner.eventId);
    if (!event) {
      return null;
    }

    return {
      scanner: {
        _id: scanner._id,
        name: scanner.name,
        eventId: scanner.eventId,
      },
      event: {
        _id: event._id,
        name: event.name,
        eventDate: event.eventDate,
        location: event.location,
      },
    };
  },
});

