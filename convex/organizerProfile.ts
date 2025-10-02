import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const updateOrganizerProfile = mutation({
  args: {
    organizerName: v.optional(v.string()),
    organizerWebsite: v.optional(v.string()),
    organizerLogoStorageId: v.optional(v.id("_storage")),
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
    organizerSlug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    console.log("Identity in mutation:", identity);
    
    if (!identity) {
      throw new Error("Ikke autentisert - ingen brukeridentitet funnet");
    }

    const userId = identity.subject;
    const email = identity.email ?? "";
    const name = identity.name ?? identity.email ?? "Unknown";
    
    console.log("User info:", { userId, email, name });

    let user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    // If user doesn't exist in database, create them first (this happens for new users)
    if (!user) {
      const existingUserByEmail = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", email))
        .first();

      if (existingUserByEmail) {
        // Update existing user's userId
        await ctx.db.patch(existingUserByEmail._id, { userId });
        user = existingUserByEmail;
      } else {
        // Create new user
        const newUserId = await ctx.db.insert("users", {
          email,
          name,
          userId,
        });
        user = await ctx.db.get(newUserId);
        if (!user) throw new Error("Kunne ikke opprette bruker");
      }
    }

    // Generate unique slug if name provided and no slug exists
    let slug = args.organizerSlug || user.organizerSlug;
    if (args.organizerName && !slug) {
      const baseSlug = args.organizerName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim();

      // Ensure unique slug
      let finalSlug = baseSlug;
      let counter = 1;
      while (true) {
        const existingUser = await ctx.db
          .query("users")
          .withIndex("by_organizer_slug", (q) => q.eq("organizerSlug", finalSlug))
          .first();

        if (!existingUser || existingUser._id === user._id) {
          break;
        }
        finalSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      slug = finalSlug;
    }

    // Update organizer profile with all new fields
    await ctx.db.patch(user._id, {
      organizerName: args.organizerName,
      organizerWebsite: args.organizerWebsite,
      organizerLogoStorageId: args.organizerLogoStorageId,
      organizerBio: args.organizerBio,
      organizerDescription: args.organizerDescription,
      organizerPhone: args.organizerPhone,
      organizerAddress: args.organizerAddress,
      organizerCity: args.organizerCity,
      organizerCountry: args.organizerCountry,
      organizerFacebook: args.organizerFacebook,
      organizerInstagram: args.organizerInstagram,
      organizerTwitter: args.organizerTwitter,
      organizerLinkedIn: args.organizerLinkedIn,
      organizerSlug: slug,
    });

    return { success: true };
  },
});

export const getOrganizerProfile = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    
    // Return empty profile if not authenticated (shouldn't happen on protected page)
    if (!identity) {
      return {
        organizerName: undefined,
        organizerWebsite: undefined,
        organizerLogoStorageId: undefined,
      };
    }

    const userId = identity.subject;
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    // Return empty profile if user doesn't exist (they can still fill it in)
    if (!user) {
      return {
        organizerName: undefined,
        organizerWebsite: undefined,
        organizerLogoStorageId: undefined,
      };
    }

    return {
      organizerName: user.organizerName,
      organizerWebsite: user.organizerWebsite,
      organizerLogoStorageId: user.organizerLogoStorageId,
      organizerBio: user.organizerBio,
      organizerDescription: user.organizerDescription,
      organizerPhone: user.organizerPhone,
      organizerAddress: user.organizerAddress,
      organizerCity: user.organizerCity,
      organizerCountry: user.organizerCountry,
      organizerFacebook: user.organizerFacebook,
      organizerInstagram: user.organizerInstagram,
      organizerTwitter: user.organizerTwitter,
      organizerLinkedIn: user.organizerLinkedIn,
      organizerSlug: user.organizerSlug,
      organizerVerified: user.organizerVerified,
      organizerRating: user.organizerRating,
      organizerReviewCount: user.organizerReviewCount,
      organizerEventCount: user.organizerEventCount,
      organizerFollowerCount: user.organizerFollowerCount,
    };
  },
});

export const getOrganizerProfileByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (!user) return null;

    return {
      userId: user.userId,
      organizerName: user.organizerName ?? user.name,
      organizerWebsite: user.organizerWebsite,
      organizerLogoStorageId: user.organizerLogoStorageId,
      organizerBio: user.organizerBio,
      organizerDescription: user.organizerDescription,
      organizerPhone: user.organizerPhone,
      organizerAddress: user.organizerAddress,
      organizerCity: user.organizerCity,
      organizerCountry: user.organizerCountry,
      organizerFacebook: user.organizerFacebook,
      organizerInstagram: user.organizerInstagram,
      organizerTwitter: user.organizerTwitter,
      organizerLinkedIn: user.organizerLinkedIn,
      organizerSlug: user.organizerSlug,
      organizerVerified: user.organizerVerified,
      organizerRating: user.organizerRating,
      organizerReviewCount: user.organizerReviewCount,
      organizerEventCount: user.organizerEventCount,
      organizerFollowerCount: user.organizerFollowerCount,
    };
  },
});

export const getOrganizerProfileBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_organizer_slug", (q) => q.eq("organizerSlug", args.slug))
      .first();

    if (!user) return null;

    return {
      userId: user.userId,
      organizerName: user.organizerName ?? user.name,
      organizerWebsite: user.organizerWebsite,
      organizerLogoStorageId: user.organizerLogoStorageId,
      organizerBio: user.organizerBio,
      organizerDescription: user.organizerDescription,
      organizerPhone: user.organizerPhone,
      organizerAddress: user.organizerAddress,
      organizerCity: user.organizerCity,
      organizerCountry: user.organizerCountry,
      organizerFacebook: user.organizerFacebook,
      organizerInstagram: user.organizerInstagram,
      organizerTwitter: user.organizerTwitter,
      organizerLinkedIn: user.organizerLinkedIn,
      organizerSlug: user.organizerSlug,
      organizerVerified: user.organizerVerified,
      organizerRating: user.organizerRating,
      organizerReviewCount: user.organizerReviewCount,
      organizerEventCount: user.organizerEventCount,
      organizerFollowerCount: user.organizerFollowerCount,
    };
  },
});

export const getOrganizerEvents = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // Get all events for this organizer
    const events = await ctx.db
      .query("events")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    // Sort by date (upcoming first)
    const now = Date.now();
    const sortedEvents = events.sort((a, b) => {
      const aDate = a.eventDate;
      const bDate = b.eventDate;

      // Both upcoming: sort by date ascending
      if (aDate >= now && bDate >= now) {
        return aDate - bDate;
      }
      // Both past: sort by date descending
      if (aDate < now && bDate < now) {
        return bDate - aDate;
      }
      // One upcoming, one past: upcoming first
      return aDate >= now ? -1 : 1;
    });

    // Add availability info for each event
    const eventsWithAvailability = await Promise.all(
      sortedEvents.map(async (event) => {
        const tickets = await ctx.db
          .query("tickets")
          .withIndex("by_event", (q) => q.eq("eventId", event._id))
          .collect();

        const purchasedCount = tickets.filter(t => t.status === "valid" || t.status === "used").length;

        return {
          ...event,
          availability: {
            totalTickets: event.totalTickets,
            purchasedCount,
            availableCount: event.totalTickets - purchasedCount,
            isSoldOut: purchasedCount >= event.totalTickets,
          },
        };
      })
    );

    return eventsWithAvailability;
  },
});

export const getFeaturedOrganizers = query({
  handler: async (ctx) => {
    // Get all users who have organizer profiles and events
    const users = await ctx.db.query("users").collect();

    const organizersWithEvents = [];

    for (const user of users) {
      // Check if user has events
      const events = await ctx.db
        .query("events")
        .filter((q) => q.eq(q.field("userId"), user.userId))
        .collect();

      if (events.length > 0) {
        // Find the most recent event with an image
        const eventsWithImages = events
          .filter(event => event.imageStorageId)
          .sort((a, b) => b.eventDate - a.eventDate); // Sort by date descending

        const latestEventImage = eventsWithImages.length > 0 ? eventsWithImages[0].imageStorageId : null;

        organizersWithEvents.push({
          userId: user.userId,
          organizerName: user.organizerName || null,
          organizerSlug: user.organizerSlug || null,
          eventCount: events.length,
          latestEventImage: latestEventImage,
        });
      }
    }

    // Shuffle the array to randomize featured organizers
    const shuffled = [...organizersWithEvents];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  },
});
