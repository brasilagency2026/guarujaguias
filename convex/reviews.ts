import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const submit = mutation({
  args: {
    businessId: v.id("businesses"),
    authorName: v.string(),
    rating: v.number(),
    comment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.rating < 1 || args.rating > 5) throw new Error("Avaliação inválida");
    if (args.authorName.trim().length < 2) throw new Error("Nome muito curto");

    return await ctx.db.insert("reviews", {
      businessId: args.businessId,
      authorName: args.authorName.trim(),
      rating: Math.round(args.rating),
      comment: args.comment?.trim(),
      verified: false,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const listApproved = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("reviews")
      .withIndex("by_business", (q) => q.eq("businessId", args.businessId))
      .filter((q) => q.eq(q.field("status"), "approved"))
      .order("desc")
      .take(20);
  },
});

export const listPending = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db
      .query("reviews")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .order("desc")
      .take(50);
  },
});
