import { query } from "./_generated/server";
import { v } from "convex/values";

export const getFikenCredentials = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }): Promise<any> => {
    const credentials = await ctx.db
      .query("fikenCredentials")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    if (!credentials) return null;

    return {
      companySlug: credentials.companySlug,
      accessToken: credentials.accessToken,
      refreshToken: credentials.refreshToken,
      tokenExpiresAt: credentials.tokenExpiresAt,
    };
  },
});
