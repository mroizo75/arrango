import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Set user as organizer after they complete onboarding
export const setUserAsOrganizer = mutation({
  args: {
    userId: v.string(),
    organizationNumber: v.string(),
    organizerName: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (!existingUser) {
      throw new Error("User not found");
    }

    // Update user to be an organizer
    await ctx.db.patch(existingUser._id, {
      isOrganizer: true,
      organizationNumber: args.organizationNumber,
      organizerName: args.organizerName,
    });

    return { success: true };
  },
});

// Check if user has completed organizer onboarding
export const hasCompletedOrganizerOnboarding = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (!user) {
      return false;
    }

    // User has completed onboarding if they have organization number and are marked as organizer
    return !!(user.isOrganizer && user.organizationNumber);
  },
});

// Get organizer profile by userId
export const getOrganizerProfileByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (!user || !user.isOrganizer) {
      return null;
    }

    return user;
  },
});

// Get organizer profile by slug
export const getOrganizerProfileBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_organizer_slug", (q) => q.eq("organizerSlug", args.slug))
      .first();

    if (!user || !user.isOrganizer) {
      return null;
    }

    return user;
  },
});

// Get featured organizers (for homepage)
export const getFeaturedOrganizers = query({
  args: {},
  handler: async (ctx) => {
    const organizers = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("isOrganizer"), true))
      .filter((q) => q.neq(q.field("organizerSlug"), undefined))
      .take(6);

    // Get event count and latest image for each organizer
    const organizersWithDetails = await Promise.all(
      organizers.map(async (organizer) => {
        const events = await ctx.db
          .query("events")
          .filter((q) => q.eq(q.field("userId"), organizer.userId))
          .filter((q) => q.eq(q.field("is_cancelled"), false))
          .collect();

        const latestEvent = events.sort((a, b) => b.eventDate - a.eventDate)[0];

        return {
          userId: organizer.userId,
          organizerName: organizer.organizerName || null,
          organizerSlug: organizer.organizerSlug || null,
          eventCount: events.length,
          latestEventImage: latestEvent?.imageStorageId || null,
        };
      })
    );

    return organizersWithDetails;
  },
});

// Get events by organizer
export const getOrganizerEvents = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const events = await ctx.db
      .query("events")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.eq(q.field("is_cancelled"), false))
      .collect();

    return events;
  },
});

// Get organizer profile (for OrganizerProfileForm)
export const getOrganizerProfile = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .first();

    return user;
  },
});

// Update organizer profile
export const updateOrganizerProfile = mutation({
  args: {
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
    organizerSlug: v.optional(v.string()),
    organizerLogoStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Update user with organizer profile data
    await ctx.db.patch(user._id, args);

    return { success: true };
  },
});