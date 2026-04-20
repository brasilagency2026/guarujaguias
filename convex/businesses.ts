import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { generateSlug } from "./lib/slug";

// ─── PUBLIC QUERIES ────────────────────────────────────────────────────────

export const listActive = query({
  args: {
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db
      .query("businesses")
      .withIndex("by_status", (q) => q.eq("status", "active"));

    const businesses = await q.collect();

    const filtered = args.category
      ? businesses.filter((b) => b.category === args.category)
      : businesses;

    return filtered.slice(0, args.limit ?? 50);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const business = await ctx.db
      .query("businesses")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!business || business.status === "deleted") return null;

    // Load minisite config if exists
    let miniSiteConfig = null;
    if (business.miniSiteConfig) {
      miniSiteConfig = await ctx.db.get(business.miniSiteConfig);
    }

    // Load reviews
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_business", (q) => q.eq("businessId", business._id))
      .filter((q) => q.eq(q.field("status"), "approved"))
      .collect();

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        : null;

    return { ...business, miniSiteConfig, reviews, avgRating };
  },
});

export const search = query({
  args: { query: v.string(), category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.query.trim()) return [];
    const results = await ctx.db
      .query("businesses")
      .withSearchIndex("search_businesses", (q) => {
        let s = q.search("name", args.query);
        if (args.category) s = s.eq("category", args.category as any);
        return s;
      })
      .filter((q) => q.eq(q.field("status"), "active"))
      .take(20);
    return results;
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
    // Simple bounding box filter (Convex doesn't have geo queries natively)
    const latDelta = radius / 111;
    const lngDelta = radius / (111 * Math.cos((args.lat * Math.PI) / 180));

    const businesses = await ctx.db
      .query("businesses")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    return businesses
      .filter((b) => {
        if (args.category && b.category !== args.category) return false;
        return (
          b.lat >= args.lat - latDelta &&
          b.lat <= args.lat + latDelta &&
          b.lng >= args.lng - lngDelta &&
          b.lng <= args.lng + lngDelta
        );
      })
      .map((b) => ({
        ...b,
        distanceKm: haversine(args.lat, args.lng, b.lat, b.lng),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm);
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
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Usuário não autenticado");

    // Generate unique slug
    let slug = generateSlug(args.name);
    const existing = await ctx.db
      .query("businesses")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    const now = Date.now();

    const businessId = await ctx.db.insert("businesses", {
      name: args.name,
      slug,
      ownerId: userId,
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

    // Update user role
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!profile) {
      await ctx.db.insert("userProfiles", {
        userId,
        role: "business_owner",
        createdAt: now,
      });
    } else if (profile.role === "user") {
      await ctx.db.patch(profile._id, { role: "business_owner" });
    }

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

// ─── OWNER MUTATIONS ───────────────────────────────────────────────────────

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
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Não autenticado");

    const business = await ctx.db.get(args.businessId);
    if (!business || business.ownerId !== userId)
      throw new Error("Sem permissão");

    const { businessId, ...updates } = args;
    await ctx.db.patch(businessId, { ...updates, updatedAt: Date.now() });
  },
});
