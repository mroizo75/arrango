import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const updateOrganizerProfile = mutation({
  args: {
    organizerName: v.optional(v.string()),
    organizerWebsite: v.optional(v.string()),
    organizerLogoStorageId: v.optional(v.id("_storage")),
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

    // Update organizer profile
    await ctx.db.patch(user._id, {
      organizerName: args.organizerName,
      organizerWebsite: args.organizerWebsite,
      organizerLogoStorageId: args.organizerLogoStorageId,
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
      organizerName: user.organizerName ?? user.name,
      organizerWebsite: user.organizerWebsite,
      organizerLogoStorageId: user.organizerLogoStorageId,
    };
  },
});
