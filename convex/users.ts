import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get user by email (for NextAuth login)
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    return user;
  },
});

// Register new user with password
export const registerUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    hashedPassword: v.string(),
    isOrganizer: v.optional(v.boolean()),
    organizationNumber: v.optional(v.string()),
    organizerName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      throw new Error("En bruker med denne e-postadressen eksisterer allerede");
    }

    // Generate unique userId
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create new user
    const newUserId = await ctx.db.insert("users", {
      userId,
      name: args.name,
      email: args.email,
      hashedPassword: args.hashedPassword,
      isOrganizer: args.isOrganizer ?? false,
      organizationNumber: args.organizationNumber,
      organizerName: args.organizerName,
    });

    return { userId: newUserId, userIdString: userId };
  },
});

export const getUsersStripeConnectId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.neq(q.field("stripeConnectId"), undefined))
      .first();
    return user?.stripeConnectId;
  },
});

export const updateOrCreateUserStripeConnectId = mutation({
  args: { userId: v.string(), stripeConnectId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, { stripeConnectId: args.stripeConnectId });
  },
});

export const updateUser = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    isOrganizer: v.optional(v.boolean()),
  },
  handler: async (ctx, { userId, name, email, isOrganizer }) => {
    // Check if user exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (existingUser) {
      // Update existing user
      const updateData: any = {
        name,
        email,
      };
      
      // Only update isOrganizer if provided
      if (isOrganizer !== undefined) {
        updateData.isOrganizer = isOrganizer;
      }
      
      await ctx.db.patch(existingUser._id, updateData);
      return existingUser._id;
    }

    // Create new user
    const newUserId = await ctx.db.insert("users", {
      userId,
      name,
      email,
      stripeConnectId: undefined,
      isOrganizer: isOrganizer ?? false,
    });

    return newUserId;
  },
});

export const getUserById = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    return user;
  },
});

export const updateUserProfile = mutation({
  args: {
    userId: v.string(),
    organizationNumber: v.optional(v.string()),
    // Kan utvides med flere felter senere
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (existingUser) {
      // Oppdater eksisterende bruker
      await ctx.db.patch(existingUser._id, {
        organizationNumber: args.organizationNumber,
      });
    } else {
      // Dette burde normalt ikke skje, men for sikkerhets skyld
      console.warn("User not found for update:", args.userId);
    }

    return { success: true };
  },
});