import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const saveFikenCredentials = mutation({
  args: {
    userId: v.string(),
    companySlug: v.string(),
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
    tokenExpiresAt: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<any> => {
    // Check if credentials already exist
    const existing = await ctx.db
      .query("fikenCredentials")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (existing) {
      // Update existing
      await ctx.db.patch(existing._id, {
        companySlug: args.companySlug,
        accessToken: args.accessToken,
        refreshToken: args.refreshToken,
        tokenExpiresAt: args.tokenExpiresAt,
      });
    } else {
      // Create new
      await ctx.db.insert("fikenCredentials", {
        userId: args.userId,
        companySlug: args.companySlug,
        accessToken: args.accessToken,
        refreshToken: args.refreshToken,
        tokenExpiresAt: args.tokenExpiresAt,
      });
    }

    return { success: true };
  },
});

export const saveFikenInvoice = mutation({
  args: {
    ticketId: v.id("tickets"),
    fikenInvoiceId: v.number(),
    fikenInvoiceNumber: v.number(),
  },
  handler: async (ctx, args): Promise<any> => {
    await ctx.db.insert("fikenInvoices", {
      ticketId: args.ticketId,
      fikenInvoiceId: args.fikenInvoiceId,
      fikenInvoiceNumber: args.fikenInvoiceNumber,
      createdAt: Date.now(),
    });

    return { success: true };
  },
});
