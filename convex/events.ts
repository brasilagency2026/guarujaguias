import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { generateSlug } from "./lib/slug";

async function requireAuth(ctx: any): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Não autenticado");
  return identity.subject;
}

// ─── PUBLIC QUERIES ────────────────────────────────────────────────────────

// Upcoming events sorted chronologically from today
export const listUpcoming = query({
  args: {
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
    featuredOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const events = await ctx.db
      .query("events")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .filter((q) => q.gte(q.field("endDate"), now))
      .collect();

    let filtered = args.category
      ? events.filter((e) => e.category === args.category)
      : events;

    if (args.featuredOnly) {
      filtered = filtered.filter((e: any) => e.featured === true);
    }

    // Sort chronologically — closest first
    filtered.sort((a, b) => a.startDate - b.startDate);

    return filtered.slice(0, args.limit ?? 50);
  },
});

// Homepage events: featured first, then chronological, max 6
export const listForHomepage = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const events = await ctx.db
      .query("events")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .filter((q) => q.gte(q.field("endDate"), now))
      .collect();

    // Featured (paid R$100) first, then by date
    events.sort((a: any, b: any) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.startDate - b.startDate;
    });

    return events.slice(0, 6);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return ctx.db.query("events").withIndex("by_slug", (q) => q.eq("slug", args.slug)).unique();
  },
});

// Owner: list my events
export const listMyEvents = query({
  args: {},
  handler: async (ctx) => {
    const clerkId = await requireAuth(ctx);
    const events = await ctx.db.query("events").collect();
    return events
      .filter((e: any) => e.ownerId === clerkId)
      .sort((a, b) => b.createdAt - a.createdAt);
  },
});

// ─── MUTATIONS ─────────────────────────────────────────────────────────────

export const createEvent = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.string(),
    address: v.optional(v.string()),
    neighborhood: v.optional(v.string()),
    lat: v.optional(v.number()),
    lng: v.optional(v.number()),
    startDate: v.number(),
    endDate: v.number(),
    price: v.optional(v.number()),
    isFree: v.boolean(),
    ticketUrl: v.optional(v.string()),
    coverImageId: v.optional(v.string()),
    businessId: v.optional(v.id("businesses")),
    whatsapp: v.optional(v.string()),
    instagram: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const clerkId = await requireAuth(ctx);

    let slug = generateSlug(args.title);
    const existing = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    return ctx.db.insert("events", {
      ...args,
      slug,
      ownerId: clerkId,
      featured: false,         // becomes true after payment
      featuredUntil: undefined,
      status: "active",
      viewCount: 0,
      createdAt: Date.now(),
    });
  },
});

export const updateEvent = mutation({
  args: {
    eventId: v.id("events"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    address: v.optional(v.string()),
    neighborhood: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    price: v.optional(v.number()),
    isFree: v.optional(v.boolean()),
    ticketUrl: v.optional(v.string()),
    coverImageId: v.optional(v.string()),
    whatsapp: v.optional(v.string()),
    instagram: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const clerkId = await requireAuth(ctx);
    const event = await ctx.db.get(args.eventId);
    if (!event || (event as any).ownerId !== clerkId) throw new Error("Sem permissão");
    const { eventId, ...updates } = args;
    await ctx.db.patch(eventId, updates as any);
  },
});

export const cancelEvent = mutation({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const clerkId = await requireAuth(ctx);
    const event = await ctx.db.get(args.eventId);
    if (!event || (event as any).ownerId !== clerkId) throw new Error("Sem permissão");
    await ctx.db.patch(args.eventId, { status: "cancelled" });
  },
});

// Called after MercadoPago payment confirmed
export const activateFeatured = mutation({
  args: {
    eventId: v.id("events"),
    mpPaymentId: v.string(),
    durationDays: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.durationDays ?? 30;
    const featuredUntil = Date.now() + days * 24 * 3600 * 1000;
    await ctx.db.patch(args.eventId, {
      featured: true,
      featuredUntil,
      featuredPaymentId: args.mpPaymentId,
    });
  },
});

export const trackEventView = mutation({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const ev = await ctx.db.get(args.eventId);
    if (ev) await ctx.db.patch(args.eventId, { viewCount: ((ev as any).viewCount ?? 0) + 1 });
  },
});
