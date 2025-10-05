import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  events: defineTable({
    name: v.string(),
    description: v.string(),
    location: v.string(),
    eventDate: v.number(),
    price: v.number(),
    currency: v.optional(v.string()), // ISO currency code: "NOK", "GBP", "USD", etc.
    totalTickets: v.number(),
    userId: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
    is_cancelled: v.optional(v.boolean()),
    // Event details that organizers can customize
    checkInTime: v.optional(v.string()), // "30 minutes before"
    refundPolicy: v.optional(v.string()), // "Non-refundable", "Refundable up to 24h before", etc.
    ageRestriction: v.optional(v.string()), // "18+", "All ages", "16+", etc.
    dressCode: v.optional(v.string()), // "Smart casual", "Formal", etc.
    parkingInfo: v.optional(v.string()), // "Free parking available", "Paid parking nearby", etc.
    additionalInfo: v.optional(v.array(v.string())), // Array of additional information points
    venueDetails: v.optional(v.string()), // Additional venue information
  }),
  tickets: defineTable({
    eventId: v.id("events"),
    ticketTypeId: v.optional(v.id("ticketTypes")), // Reference to ticket type (optional for backward compatibility)
    userId: v.string(),
    purchasedAt: v.number(),
    status: v.union(
      v.literal("valid"),
      v.literal("used"),
      v.literal("refunded"),
      v.literal("cancelled")
    ),
    paymentIntentId: v.optional(v.string()),
    amount: v.number(), // Price at time of purchase (in øre)
    currency: v.optional(v.string()), // Currency at time of purchase (optional for backward compatibility)
    scannedAt: v.optional(v.number()),
    scannedBy: v.optional(v.string()),
    recipientName: v.optional(v.string()), // Name of the person the ticket is for
    recipientEmail: v.optional(v.string()), // Email of the person the ticket is for
  })
    .index("by_event", ["eventId"])
    .index("by_ticket_type", ["ticketTypeId"])
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

  ticketTypes: defineTable({
    eventId: v.id("events"),
    name: v.string(), // "VIP", "Early Bird", "Standing", "Seated", etc.
    description: v.optional(v.string()),
    price: v.number(), // Price in øre (cents)
    currency: v.string(), // ISO currency code
    maxQuantity: v.number(), // Maximum tickets available for this type
    soldQuantity: v.number(), // How many have been sold (default 0)
    sortOrder: v.number(), // For ordering in UI (lower numbers first)
    isActive: v.boolean(), // Can be deactivated
    benefits: v.optional(v.array(v.string())), // ["VIP access", "Free drink", etc.]
  })
    .index("by_event", ["eventId"])
    .index("by_event_active", ["eventId", "isActive"]),

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
    hashedPassword: v.optional(v.string()), // For NextAuth credentials
    stripeConnectId: v.optional(v.string()),
    isOrganizer: v.optional(v.boolean()), // True if user is an organizer
    organizationNumber: v.optional(v.string()), // Norske organisasjonsnummer for faktura
    organizerLogoStorageId: v.optional(v.id("_storage")),
    organizerName: v.optional(v.string()),
    organizerWebsite: v.optional(v.string()),
    organizerBio: v.optional(v.string()),
    organizerDescription: v.optional(v.string()),
    organizerPhone: v.optional(v.string()),
    organizerAddress: v.optional(v.string()),
    organizerCity: v.optional(v.string()),
    organizerCountry: v.optional(v.string()),
    organizerFacebook: v.optional(v.string()),
    organizerInstagram: v.optional(v.string()),
    organizerTwitter: v.optional(v.string()),
    organizerLinkedIn: v.optional(v.string()),
    organizerSlug: v.optional(v.string()), // Unique slug for public profile URL
    organizerVerified: v.optional(v.boolean()), // Verified organizer badge
    organizerRating: v.optional(v.number()), // Average rating 1-5
    organizerReviewCount: v.optional(v.number()), // Number of reviews
    organizerEventCount: v.optional(v.number()), // Total events created
    organizerFollowerCount: v.optional(v.number()), // Social proof
  })
    .index("by_user_id", ["userId"])
    .index("by_email", ["email"])
    .index("by_organizer_slug", ["organizerSlug"]),

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

  fikenCredentials: defineTable({
    userId: v.string(),
    companySlug: v.string(),
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
    tokenExpiresAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"]),

  fikenInvoices: defineTable({
    ticketId: v.id("tickets"),
    fikenInvoiceId: v.number(),
    fikenInvoiceNumber: v.number(),
    createdAt: v.number(),
  })
    .index("by_ticket", ["ticketId"]),
});
