import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// ─── GUARD ─────────────────────────────────────────────────────────────────

async function requireSuperAdmin(ctx: any) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Não autenticado");

  const profile = await ctx.db
    .query("userProfiles")
    .withIndex("by_user", (q: any) => q.eq("userId", userId))
    .unique();

  if (!profile || !["admin", "superadmin"].includes(profile.role)) {
    throw new Error("Acesso negado: requer privilégios de administrador");
  }
  return { userId, role: profile.role };
}

// ─── ADMIN QUERIES ─────────────────────────────────────────────────────────

export const listAllBusinesses = query({
  args: {
    status: v.optional(v.string()),
    plan: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireSuperAdmin(ctx);

    let businesses = await ctx.db.query("businesses").collect();

    if (args.status) businesses = businesses.filter((b) => b.status === args.status);
    if (args.plan) businesses = businesses.filter((b) => b.plan === args.plan);

    // Enrich with owner info
    const enriched = await Promise.all(
      businesses.map(async (b) => {
        const profile = await ctx.db
          .query("userProfiles")
          .withIndex("by_user", (q: any) => q.eq("userId", b.ownerId))
          .unique();
        return { ...b, ownerProfile: profile };
      })
    );

    return enriched.sort((a, b) => b.createdAt - a.createdAt).slice(0, args.limit ?? 200);
  },
});

export const getAdminStats = query({
  args: {},
  handler: async (ctx) => {
    await requireSuperAdmin(ctx);

    const businesses = await ctx.db.query("businesses").collect();
    const subscriptions = await ctx.db.query("subscriptions").collect();
    const reviews = await ctx.db.query("reviews").collect();
    const users = await ctx.db.query("userProfiles").collect();

    return {
      businesses: {
        total: businesses.length,
        active: businesses.filter((b) => b.status === "active").length,
        pending: businesses.filter((b) => b.status === "pending").length,
        paused: businesses.filter((b) => b.status === "paused").length,
        suspended: businesses.filter((b) => b.status === "suspended").length,
        pro: businesses.filter((b) => b.plan === "pro").length,
        withMiniSite: businesses.filter((b) => b.hasMiniSite).length,
      },
      subscriptions: {
        total: subscriptions.length,
        active: subscriptions.filter((s) => s.mpStatus === "authorized").length,
        monthlyRevenue:
          subscriptions.filter((s) => s.mpStatus === "authorized").length * 50,
      },
      reviews: {
        total: reviews.length,
        pending: reviews.filter((r) => r.status === "pending").length,
      },
      users: {
        total: users.length,
        businessOwners: users.filter((u) => u.role === "business_owner").length,
      },
    };
  },
});

export const getAdminLogs = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await requireSuperAdmin(ctx);
    const logs = await ctx.db
      .query("adminLogs")
      .order("desc")
      .take(args.limit ?? 50);
    return logs;
  },
});

// ─── STATUS MUTATIONS ──────────────────────────────────────────────────────

export const approveBusiness = mutation({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const { userId } = await requireSuperAdmin(ctx);
    await ctx.db.patch(args.businessId, { status: "active", updatedAt: Date.now() });
    await ctx.db.insert("adminLogs", {
      adminId: userId,
      action: "approve_business",
      targetType: "business",
      targetId: args.businessId,
      createdAt: Date.now(),
    });
  },
});

export const pauseBusiness = mutation({
  args: { businessId: v.id("businesses"), reason: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const { userId } = await requireSuperAdmin(ctx);
    await ctx.db.patch(args.businessId, { status: "paused", updatedAt: Date.now() });
    await ctx.db.insert("adminLogs", {
      adminId: userId,
      action: "pause_business",
      targetType: "business",
      targetId: args.businessId,
      details: args.reason,
      createdAt: Date.now(),
    });
  },
});

export const suspendBusiness = mutation({
  args: { businessId: v.id("businesses"), reason: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const { userId } = await requireSuperAdmin(ctx);
    await ctx.db.patch(args.businessId, { status: "suspended", updatedAt: Date.now() });
    await ctx.db.insert("adminLogs", {
      adminId: userId,
      action: "suspend_business",
      targetType: "business",
      targetId: args.businessId,
      details: args.reason,
      createdAt: Date.now(),
    });
  },
});

export const reactivateBusiness = mutation({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const { userId } = await requireSuperAdmin(ctx);
    await ctx.db.patch(args.businessId, { status: "active", updatedAt: Date.now() });
    await ctx.db.insert("adminLogs", {
      adminId: userId,
      action: "reactivate_business",
      targetType: "business",
      targetId: args.businessId,
      createdAt: Date.now(),
    });
  },
});

export const deleteBusiness = mutation({
  args: { businessId: v.id("businesses"), reason: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const { userId } = await requireSuperAdmin(ctx);
    // Soft delete
    await ctx.db.patch(args.businessId, { status: "deleted", updatedAt: Date.now() });
    await ctx.db.insert("adminLogs", {
      adminId: userId,
      action: "delete_business",
      targetType: "business",
      targetId: args.businessId,
      details: args.reason,
      createdAt: Date.now(),
    });
  },
});

export const editBusinessAdmin = mutation({
  args: {
    businessId: v.id("businesses"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    plan: v.optional(v.union(v.literal("free"), v.literal("pro"))),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireSuperAdmin(ctx);
    const { businessId, ...updates } = args;
    await ctx.db.patch(businessId, { ...updates as any, updatedAt: Date.now() });
    await ctx.db.insert("adminLogs", {
      adminId: userId,
      action: "edit_business",
      targetType: "business",
      targetId: businessId,
      details: JSON.stringify(updates),
      createdAt: Date.now(),
    });
  },
});

// ─── REVIEW MODERATION ─────────────────────────────────────────────────────

export const approveReview = mutation({
  args: { reviewId: v.id("reviews") },
  handler: async (ctx, args) => {
    const { userId } = await requireSuperAdmin(ctx);
    await ctx.db.patch(args.reviewId, { status: "approved" });
    await ctx.db.insert("adminLogs", {
      adminId: userId,
      action: "approve_review",
      targetType: "review",
      targetId: args.reviewId,
      createdAt: Date.now(),
    });
  },
});

export const rejectReview = mutation({
  args: { reviewId: v.id("reviews") },
  handler: async (ctx, args) => {
    const { userId } = await requireSuperAdmin(ctx);
    await ctx.db.patch(args.reviewId, { status: "rejected" });
    await ctx.db.insert("adminLogs", {
      adminId: userId,
      action: "reject_review",
      targetType: "review",
      targetId: args.reviewId,
      createdAt: Date.now(),
    });
  },
});

// ─── USER MANAGEMENT ───────────────────────────────────────────────────────

export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    await requireSuperAdmin(ctx);
    return ctx.db.query("userProfiles").collect();
  },
});

export const setUserRole = mutation({
  args: {
    profileId: v.id("userProfiles"),
    role: v.union(v.literal("user"), v.literal("business_owner"), v.literal("admin"), v.literal("superadmin")),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireSuperAdmin(ctx);
    await ctx.db.patch(args.profileId, { role: args.role });
    await ctx.db.insert("adminLogs", {
      adminId: userId,
      action: "set_user_role",
      targetType: "user",
      targetId: args.profileId,
      details: args.role,
      createdAt: Date.now(),
    });
  },
});
