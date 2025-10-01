import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Scan a ticket
export const scanTicket = mutation({
  args: {
    ticketId: v.id("tickets"),
    accessCode: v.optional(v.string()), // For scanner-tilgang
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    let scannerId: string;
    let scannerName: string;
    let isOrganizer = false;
    let organizerUserId: string | undefined;

    // Check if scanning with access code (vaktpersonell)
    if (args.accessCode && args.accessCode.trim()) {
      const scanner = await ctx.db
        .query("scanners")
        .withIndex("by_access_code", (q) => q.eq("accessCode", args.accessCode as string))
        .first();

      if (!scanner || !scanner.isActive) {
        return {
          success: false,
          result: "invalid" as const,
          message: "Ugyldig tilgangskode",
          ticket: null,
        };
      }

      // Update last used time
      await ctx.db.patch(scanner._id, {
        lastUsedAt: Date.now(),
      });

      scannerId = scanner._id;
      scannerName = scanner.name;
    } else {
      // Scanning as organizer
      if (!identity) {
        throw new Error("Ikke autentisert");
      }
      scannerId = identity.subject;
      scannerName = identity.name ?? identity.email ?? "Arrangør";
      isOrganizer = true;
      organizerUserId = identity.subject;
    }

    // Get the ticket
    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket) {
      // Log failed scan attempt
      return {
        success: false,
        result: "invalid" as const,
        message: "Billett ikke funnet",
        ticket: null,
      };
    }

    // Get the event
    const event = await ctx.db.get(ticket.eventId);
    if (!event) {
      return {
        success: false,
        result: "invalid" as const,
        message: "Event ikke funnet",
        ticket: null,
      };
    }

    // Check access rights
    if (isOrganizer && organizerUserId && event.userId !== organizerUserId) {
      return {
        success: false,
        result: "invalid" as const,
        message: "Du har ikke tilgang til å scanne billetter for dette eventet",
        ticket: null,
      };
    }

    // Check if event is cancelled
    if (event.is_cancelled) {
      await ctx.db.insert("ticketScans", {
        ticketId: args.ticketId,
        eventId: ticket.eventId,
        scannedBy: userId,
        scannedAt: Date.now(),
        scanResult: "cancelled",
      });

      return {
        success: false,
        result: "cancelled" as const,
        message: "Dette eventet er kansellert",
        ticket: {
          ...ticket,
          event,
        },
      };
    }

    // Check ticket status
    if (ticket.status === "refunded") {
      await ctx.db.insert("ticketScans", {
        ticketId: args.ticketId,
        eventId: ticket.eventId,
        scannedBy: scannerId,
        scannedAt: Date.now(),
        scanResult: "invalid",
      });

      return {
        success: false,
        result: "invalid" as const,
        message: "Billett er refundert",
        ticket: {
          ...ticket,
          event,
        },
      };
    }

    if (ticket.status === "cancelled") {
      await ctx.db.insert("ticketScans", {
        ticketId: args.ticketId,
        eventId: ticket.eventId,
        scannedBy: scannerId,
        scannedAt: Date.now(),
        scanResult: "cancelled",
      });

      return {
        success: false,
        result: "cancelled" as const,
        message: "Billett er kansellert",
        ticket: {
          ...ticket,
          event,
        },
      };
    }

    // Check if already scanned
    if (ticket.status === "used") {
      await ctx.db.insert("ticketScans", {
        ticketId: args.ticketId,
        eventId: ticket.eventId,
        scannedBy: scannerId,
        scannedAt: Date.now(),
        scanResult: "already_scanned",
      });

      return {
        success: false,
        result: "already_scanned" as const,
        message: `Billett allerede scannet ${ticket.scannedAt ? `på ${new Date(ticket.scannedAt).toLocaleString("nb-NO")}` : ""}`,
        ticket: {
          ...ticket,
          event,
        },
      };
    }

    // Valid ticket - mark as used
    await ctx.db.patch(args.ticketId, {
      status: "used",
      scannedAt: Date.now(),
      scannedBy: scannerId,
    });

    // Log successful scan
    await ctx.db.insert("ticketScans", {
      ticketId: args.ticketId,
      eventId: ticket.eventId,
      scannedBy: scannerId,
      scannedAt: Date.now(),
      scanResult: "valid",
    });

    // Get user info for the ticket holder
    const ticketHolder = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", ticket.userId))
      .first();

    return {
      success: true,
      result: "valid" as const,
      message: "Billett gyldig! Inngang godkjent ✓",
      ticket: {
        ...ticket,
        event,
        holder: ticketHolder,
      },
    };
  },
});

// Get scan history for an event
export const getEventScans = query({
  args: {
    eventId: v.id("events"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const userId = identity.subject;

    // Check if user is the organizer
    const event = await ctx.db.get(args.eventId);
    if (!event || event.userId !== userId) {
      return [];
    }

    // Get all scans for this event
    const scans = await ctx.db
      .query("ticketScans")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .order("desc")
      .collect();

    // Enrich with ticket and user data
    const enrichedScans = await Promise.all(
      scans.map(async (scan) => {
        const ticket = await ctx.db.get(scan.ticketId);
        if (!ticket) return null;

        const ticketHolder = await ctx.db
          .query("users")
          .withIndex("by_user_id", (q) => q.eq("userId", ticket.userId))
          .first();

        return {
          ...scan,
          ticket,
          ticketHolder,
        };
      })
    );

    return enrichedScans.filter((scan) => scan !== null);
  },
});

// Get scan statistics for an event
export const getEventScanStats = query({
  args: {
    eventId: v.id("events"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const userId = identity.subject;

    // Check if user is the organizer
    const event = await ctx.db.get(args.eventId);
    if (!event || event.userId !== userId) {
      return null;
    }

    // Get all tickets for this event
    const allTickets = await ctx.db
      .query("tickets")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    const validTickets = allTickets.filter(
      (t) => t.status === "valid" || t.status === "used"
    );
    const scannedTickets = allTickets.filter((t) => t.status === "used");
    const refundedTickets = allTickets.filter((t) => t.status === "refunded");

    // Get scan attempts
    const scans = await ctx.db
      .query("ticketScans")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    const validScans = scans.filter((s) => s.scanResult === "valid");
    const invalidScans = scans.filter(
      (s) => s.scanResult === "invalid" || s.scanResult === "cancelled"
    );
    const alreadyScannedAttempts = scans.filter(
      (s) => s.scanResult === "already_scanned"
    );

    return {
      totalTickets: allTickets.length,
      validTickets: validTickets.length,
      scannedTickets: scannedTickets.length,
      unscannedTickets: validTickets.length - scannedTickets.length,
      refundedTickets: refundedTickets.length,
      totalScanAttempts: scans.length,
      validScans: validScans.length,
      invalidScans: invalidScans.length,
      alreadyScannedAttempts: alreadyScannedAttempts.length,
    };
  },
});

// Get all events that the organizer can scan for
export const getScannableEvents = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const userId = identity.subject;

    // Get all events for this organizer
    const events = await ctx.db
      .query("events")
      .filter((q) => q.eq(q.field("userId"), userId))
      .order("desc")
      .collect();

    // Get ticket counts for each event
    const eventsWithStats = await Promise.all(
      events.map(async (event) => {
        const tickets = await ctx.db
          .query("tickets")
          .withIndex("by_event", (q) => q.eq("eventId", event._id))
          .collect();

        const scannedCount = tickets.filter((t) => t.status === "used").length;
        const validCount = tickets.filter(
          (t) => t.status === "valid" || t.status === "used"
        ).length;

        return {
          ...event,
          totalTickets: tickets.length,
          scannedCount,
          validCount,
          unscannedCount: validCount - scannedCount,
        };
      })
    );

    return eventsWithStats;
  },
});

