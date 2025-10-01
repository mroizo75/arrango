import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  events: defineTable({
    name: v.string(),
    description: v.string(),
    location: v.string(),
    eventDate: v.number(),
    price: v.number(),
    totalTickets: v.number(),
    userId: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
    is_cancelled: v.optional(v.boolean()),
  }),
  tickets: defineTable({
    eventId: v.id("events"),
    userId: v.string(),
    purchasedAt: v.number(),
    status: v.union(
      v.literal("valid"),
      v.literal("used"),
      v.literal("refunded"),
      v.literal("cancelled")
    ),
    paymentIntentId: v.optional(v.string()),
    amount: v.optional(v.number()),
    isVip: v.optional(v.boolean()),
    scannedAt: v.optional(v.number()),
    scannedBy: v.optional(v.string()),
  })
    .index("by_event", ["eventId"])
    .index("by_user", ["userId"])
    .index("by_user_event", ["userId", "eventId"])
    .index("by_payment_intent", ["paymentIntentId"]),

  ticketScans: defineTable({
    ticketId: v.id("tickets"),
    eventId: v.id("events"),
    scannedBy: v.string(),
    scannedAt: v.number(),
    scanResult: v.union(
      v.literal("valid"),
      v.literal("already_scanned"),
      v.literal("invalid"),
      v.literal("cancelled")
    ),
  })
    .index("by_ticket", ["ticketId"])
    .index("by_event", ["eventId"])
    .index("by_scanned_by", ["scannedBy"]),

  waitingList: defineTable({
    eventId: v.id("events"),
    userId: v.string(),
    status: v.union(
      v.literal("waiting"),
      v.literal("offered"),
      v.literal("purchased"),
      v.literal("expired")
    ),
    offerExpiresAt: v.optional(v.number()),
  })
    .index("by_event_status", ["eventId", "status"])
    .index("by_user_event", ["userId", "eventId"])
    .index("by_user", ["userId"]),

  users: defineTable({
    name: v.string(),
    email: v.string(),
    userId: v.string(),
    stripeConnectId: v.optional(v.string()),
    organizerLogoStorageId: v.optional(v.id("_storage")),
    organizerName: v.optional(v.string()),
    organizerWebsite: v.optional(v.string()),
  })
    .index("by_user_id", ["userId"])
    .index("by_email", ["email"]),

  scanners: defineTable({
    eventId: v.id("events"),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    accessCode: v.string(), // Unik kode for å scanne
    isActive: v.boolean(),
    createdBy: v.string(), // Arrangør som opprettet scanneren
    createdAt: v.number(),
    lastUsedAt: v.optional(v.number()),
  })
    .index("by_event", ["eventId"])
    .index("by_access_code", ["accessCode"])
    .index("by_created_by", ["createdBy"]),
});
