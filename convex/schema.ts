import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  // ─── BUSINESSES ────────────────────────────────────────────────
  businesses: defineTable({
    // Identity
    name: v.string(),
    slug: v.string(),           // SEO-friendly slug: "cantinho-do-pescador"
    ownerId: v.id("users"),

    // Category & Type
    category: v.union(
      v.literal("restaurante"),
      v.literal("hospedagem"),
      v.literal("beleza"),
      v.literal("turismo"),
      v.literal("loja"),
      v.literal("saude"),
      v.literal("cultura"),
      v.literal("servicos"),
      v.literal("eventos")
    ),
    subcategory: v.optional(v.string()),

    // Location
    address: v.string(),
    neighborhood: v.string(),
    city: v.literal("Guarujá"),
    state: v.literal("SP"),
    zipCode: v.optional(v.string()),
    lat: v.number(),
    lng: v.number(),

    // Contact
    whatsapp: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    website: v.optional(v.string()),     // external URL if they have one

    // Social
    instagram: v.optional(v.string()),
    facebook: v.optional(v.string()),
    tiktok: v.optional(v.string()),

    // Content
    description: v.string(),
    shortDescription: v.string(),        // max 120 chars for cards
    tags: v.array(v.string()),

    // Media (Cloudflare Images IDs)
    logoImageId: v.optional(v.string()),
    coverImageId: v.optional(v.string()),
    galleryImageIds: v.array(v.string()),

    // Hours
    openingHours: v.optional(v.object({
      monday:    v.optional(v.object({ open: v.string(), close: v.string(), closed: v.boolean() })),
      tuesday:   v.optional(v.object({ open: v.string(), close: v.string(), closed: v.boolean() })),
      wednesday: v.optional(v.object({ open: v.string(), close: v.string(), closed: v.boolean() })),
      thursday:  v.optional(v.object({ open: v.string(), close: v.string(), closed: v.boolean() })),
      friday:    v.optional(v.object({ open: v.string(), close: v.string(), closed: v.boolean() })),
      saturday:  v.optional(v.object({ open: v.string(), close: v.string(), closed: v.boolean() })),
      sunday:    v.optional(v.object({ open: v.string(), close: v.string(), closed: v.boolean() })),
    })),

    // Mini-site
    hasMiniSite: v.boolean(),
    miniSiteConfig: v.optional(v.id("miniSiteConfigs")),

    // Status
    status: v.union(
      v.literal("pending"),      // awaiting admin approval
      v.literal("active"),       // live on portal
      v.literal("paused"),       // temporarily hidden
      v.literal("suspended"),    // payment issue
      v.literal("deleted")       // soft delete
    ),

    // Plan
    plan: v.union(v.literal("free"), v.literal("pro")),
    planExpiresAt: v.optional(v.number()),  // timestamp

    // Stats
    viewCount: v.number(),
    clickWhatsapp: v.number(),
    clickWebsite: v.number(),

    // SEO
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_owner", ["ownerId"])
    .index("by_status", ["status"])
    .index("by_category", ["category"])
    .index("by_plan", ["plan"])
    .searchIndex("search_businesses", {
      searchField: "name",
      filterFields: ["category", "status", "plan"],
    }),

  // ─── MINI-SITE CONFIGS ─────────────────────────────────────────
  miniSiteConfigs: defineTable({
    businessId: v.id("businesses"),

    // Design
    template: v.union(
      v.literal("restaurante"),
      v.literal("hospedagem"),
      v.literal("beleza"),
      v.literal("turismo"),
      v.literal("loja"),
      v.literal("servicos")
    ),
    primaryColor: v.string(),   // hex
    secondaryColor: v.string(), // hex
    fontStyle: v.union(v.literal("modern"), v.literal("elegant"), v.literal("bold")),

    // Features enabled
    features: v.object({
      scheduling: v.boolean(),
      whatsappButton: v.boolean(),
      photoCarousel: v.boolean(),
      serviceList: v.boolean(),
      map: v.boolean(),
      socialLinks: v.boolean(),
      reviews: v.boolean(),
      promotions: v.boolean(),
      menu: v.boolean(),         // for restaurants
      roomTypes: v.boolean(),    // for hotels
    }),

    // Services / Menu items
    services: v.array(v.object({
      id: v.string(),
      name: v.string(),
      description: v.optional(v.string()),
      price: v.optional(v.number()),
      priceNote: v.optional(v.string()),  // "a partir de", "por pessoa"
      imageId: v.optional(v.string()),
      category: v.optional(v.string()),
    })),

    // Promotions
    promotions: v.optional(v.array(v.object({
      title: v.string(),
      description: v.string(),
      discount: v.optional(v.string()),
      validUntil: v.optional(v.number()),
      imageId: v.optional(v.string()),
    }))),

    // Custom sections
    customHtml: v.optional(v.string()),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_business", ["businessId"]),

  // ─── SCHEDULING ────────────────────────────────────────────────
  appointments: defineTable({
    businessId: v.id("businesses"),
    serviceId: v.optional(v.string()),

    // Customer
    customerName: v.string(),
    customerPhone: v.string(),
    customerEmail: v.optional(v.string()),

    // Time
    date: v.string(),         // "2024-06-15"
    timeSlot: v.string(),     // "14:00"
    durationMinutes: v.number(),

    notes: v.optional(v.string()),

    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("cancelled"),
      v.literal("completed")
    ),

    createdAt: v.number(),
  })
    .index("by_business", ["businessId"])
    .index("by_business_date", ["businessId", "date"]),

  // ─── REVIEWS ───────────────────────────────────────────────────
  reviews: defineTable({
    businessId: v.id("businesses"),
    authorName: v.string(),
    rating: v.number(),          // 1-5
    comment: v.optional(v.string()),
    verified: v.boolean(),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
    createdAt: v.number(),
  })
    .index("by_business", ["businessId"])
    .index("by_status", ["status"]),

  // ─── EVENTS ────────────────────────────────────────────────────
  events: defineTable({
    businessId: v.optional(v.id("businesses")),
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    category: v.string(),
    coverImageId: v.optional(v.string()),
    lat: v.optional(v.number()),
    lng: v.optional(v.number()),
    address: v.optional(v.string()),
    startDate: v.number(),
    endDate: v.number(),
    price: v.optional(v.number()),
    isFree: v.boolean(),
    ticketUrl: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("cancelled"), v.literal("past")),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_start", ["startDate"]),

  // ─── PAYMENTS / SUBSCRIPTIONS ──────────────────────────────────
  subscriptions: defineTable({
    businessId: v.id("businesses"),
    ownerId: v.id("users"),

    // MercadoPago
    mpSubscriptionId: v.string(),      // preapproval_id from MP
    mpPayerId: v.optional(v.string()),
    mpStatus: v.string(),              // authorized, paused, cancelled, pending

    plan: v.literal("pro"),
    priceReais: v.number(),            // 50.00
    billingCycle: v.literal("monthly"),

    startedAt: v.number(),
    nextBillingAt: v.optional(v.number()),
    cancelledAt: v.optional(v.number()),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_business", ["businessId"])
    .index("by_owner", ["ownerId"])
    .index("by_mp_subscription", ["mpSubscriptionId"]),

  // ─── PAYMENT HISTORY ───────────────────────────────────────────
  paymentHistory: defineTable({
    subscriptionId: v.id("subscriptions"),
    businessId: v.id("businesses"),
    mpPaymentId: v.string(),
    amount: v.number(),
    status: v.string(),        // approved, rejected, pending
    paidAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_subscription", ["subscriptionId"])
    .index("by_business", ["businessId"]),

  // ─── ADMIN LOGS ────────────────────────────────────────────────
  adminLogs: defineTable({
    adminId: v.id("users"),
    action: v.string(),       // "approve_business", "delete_business", etc.
    targetType: v.string(),   // "business", "user", "review"
    targetId: v.string(),
    details: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_admin", ["adminId"])
    .index("by_target", ["targetType", "targetId"]),

  // ─── USER PROFILES ─────────────────────────────────────────────
  userProfiles: defineTable({
    userId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("business_owner"), v.literal("admin"), v.literal("superadmin")),
    displayName: v.optional(v.string()),
    phone: v.optional(v.string()),
    avatarImageId: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_role", ["role"]),
});
