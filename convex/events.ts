import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { generateSlug } from "./lib/slug";

async function requireAuth(ctx: any): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Não autenticado");
  return identity.subject;
}

export const listUpcoming = query({
  args: { category: v.optional(v.string()), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const now = Date.now();
    const events = await ctx.db
      .query("events")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .filter((q) => q.gte(q.field("endDate"), now))
      .order("asc")
      .take(args.limit ?? 50);
    return args.category ? events.filter((e) => e.category === args.category) : events;
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return ctx.db.query("events").withIndex("by_slug", (q) => q.eq("slug", args.slug)).unique();
  },
});

export const createEvent = mutation({
  args: {
    title: v.string(), description: v.string(), category: v.string(),
    address: v.optional(v.string()), lat: v.optional(v.number()), lng: v.optional(v.number()),
    startDate: v.number(), endDate: v.number(), price: v.optional(v.number()),
    isFree: v.boolean(), ticketUrl: v.optional(v.string()),
    businessId: v.optional(v.id("businesses")),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    let slug = generateSlug(args.title);
    const existing = await ctx.db.query("events").withIndex("by_slug", (q) => q.eq("slug", slug)).unique();
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    return ctx.db.insert("events", { ...args, slug, status: "active", createdAt: Date.now() });
  },
});
