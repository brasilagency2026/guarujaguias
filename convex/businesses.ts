import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { generateSlug } from "./lib/slug";

// ─── Helper: get Clerk user ID from JWT ───────────────────────────────────
async function requireAuth(ctx: any): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Não autenticado");
  return identity.subject; // Clerk user ID e.g. "user_2abc123"
}

// ─── PUBLIC QUERIES ────────────────────────────────────────────────────────

export const listActive = query({
  args: {
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const businesses = await ctx.db
      .query("businesses")
      .withIndex("by_status", (q: any) => q.eq("status", "active"))
      .collect();

    const filtered = args.category
      ? businesses.filter((b: any) => b.category === args.category)
      : businesses;

    return filtered.slice(0, args.limit ?? 50);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const business = await ctx.db
      .query("businesses")
      .withIndex("by_slug", (q: any) => q.eq("slug", args.slug))
      .unique();

    if (!business || business.status === "deleted") return null;

    let miniSiteConfig = null;
    if (business.miniSiteConfig) {
      miniSiteConfig = await ctx.db.get(business.miniSiteConfig);
    }

    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_business", (q: any) => q.eq("businessId", business._id))
      .filter((q: any) => q.eq(q.field("status"), "approved"))
      .collect();

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length
        : null;

    return { ...business, miniSiteConfig, reviews, avgRating };
  },
});

export const search = query({
  args: { query: v.string(), category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.query.trim()) return [];
    return ctx.db
      .query("businesses")
      .withSearchIndex("search_businesses", (q: any) => {
        let s = q.search("name", args.query);
        if (args.category) s = s.eq("category", args.category);
        return s;
      })
      .filter((q: any) => q.eq(q.field("status"), "active"))
      .take(20);
  },
});

export const getNearby = query({
  args: {
    lat: v.number(),
    lng: v.number(),
    radiusKm: v.optional(v.number()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const radius = args.radiusKm ?? 5;
    const latDelta = radius / 111;
    const lngDelta = radius / (111 * Math.cos((args.lat * Math.PI) / 180));

    const businesses = await ctx.db
      .query("businesses")
      .withIndex("by_status", (q: any) => q.eq("status", "active"))
      .collect();

    return businesses
      .filter((b: any) => {
        if (args.category && b.category !== args.category) return false;
        return (
          b.lat >= args.lat - latDelta &&
          b.lat <= args.lat + latDelta &&
          b.lng >= args.lng - lngDelta &&
          b.lng <= args.lng + lngDelta
        );
      })
      .map((b: any) => ({
        ...b,
        distanceKm: haversine(args.lat, args.lng, b.lat, b.lng),
      }))
      .sort((a: any, b: any) => a.distanceKm - b.distanceKm);
  },
});

function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── MUTATIONS ─────────────────────────────────────────────────────────────

export const register = mutation({
  args: {
    name: v.string(),
    category: v.union(
      v.literal("restaurante"), v.literal("hospedagem"), v.literal("beleza"),
      v.literal("turismo"), v.literal("loja"), v.literal("saude"),
      v.literal("cultura"), v.literal("servicos"), v.literal("eventos")
    ),
    description: v.string(),
    shortDescription: v.string(),
    address: v.string(),
    neighborhood: v.string(),
    lat: v.number(),
    lng: v.number(),
    whatsapp: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    website: v.optional(v.string()),
    instagram: v.optional(v.string()),
    tags: v.array(v.string()),
    wantsMiniSite: v.boolean(),
  },
  handler: async (ctx, args) => {
    const clerkId = await requireAuth(ctx);

    let slug = generateSlug(args.name);
    const existing = await ctx.db
      .query("businesses")
      .withIndex("by_slug", (q: any) => q.eq("slug", slug))
      .unique();
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    const now = Date.now();

    const businessId = await ctx.db.insert("businesses", {
      name: args.name,
      slug,
      ownerId: clerkId as any,
      category: args.category,
      description: args.description,
      shortDescription: args.shortDescription,
      address: args.address,
      neighborhood: args.neighborhood,
      city: "Guarujá",
      state: "SP",
      lat: args.lat,
      lng: args.lng,
      whatsapp: args.whatsapp,
      phone: args.phone,
      email: args.email,
      website: args.website,
      instagram: args.instagram,
      tags: args.tags,
      galleryImageIds: [],
      hasMiniSite: false,
      status: "pending",
      plan: "free",
      viewCount: 0,
      clickWhatsapp: 0,
      clickWebsite: 0,
      createdAt: now,
      updatedAt: now,
    });

    return { businessId, slug };
  },
});

export const trackView = mutation({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const b = await ctx.db.get(args.businessId);
    if (b) await ctx.db.patch(args.businessId, { viewCount: b.viewCount + 1 });
  },
});

export const trackClick = mutation({
  args: {
    businessId: v.id("businesses"),
    type: v.union(v.literal("whatsapp"), v.literal("website")),
  },
  handler: async (ctx, args) => {
    const b = await ctx.db.get(args.businessId);
    if (!b) return;
    if (args.type === "whatsapp")
      await ctx.db.patch(args.businessId, { clickWhatsapp: b.clickWhatsapp + 1 });
    else
      await ctx.db.patch(args.businessId, { clickWebsite: b.clickWebsite + 1 });
  },
});

export const updateBusiness = mutation({
  args: {
    businessId: v.id("businesses"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    shortDescription: v.optional(v.string()),
    whatsapp: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    instagram: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    logoImageId: v.optional(v.string()),
    coverImageId: v.optional(v.string()),
    galleryImageIds: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const clerkId = await requireAuth(ctx);
    const business = await ctx.db.get(args.businessId);
    if (!business || business.ownerId !== clerkId) throw new Error("Sem permissão");
    const { businessId, ...updates } = args;
    await ctx.db.patch(businessId, { ...updates, updatedAt: Date.now() });
  },
});
