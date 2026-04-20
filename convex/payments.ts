import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Called from MercadoPago webhook via HTTP action
export const handleSubscriptionUpdate = mutation({
  args: {
    mpSubscriptionId: v.string(),
    mpStatus: v.string(),
    nextBillingDate: v.optional(v.number()),
    externalReference: v.string(),
  },
  handler: async (ctx, args) => {
    const businessId = args.externalReference.replace("business_", "") as any;

    // Find existing subscription
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_mp_subscription", (q) => q.eq("mpSubscriptionId", args.mpSubscriptionId))
      .unique();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        mpStatus: args.mpStatus,
        nextBillingAt: args.nextBillingDate,
        cancelledAt: args.mpStatus === "cancelled" ? now : undefined,
        updatedAt: now,
      });
    } else {
      // New subscription — find the business to get ownerId
      const business = await ctx.db.get(businessId);
      if (!business) return;

      await ctx.db.insert("subscriptions", {
        businessId,
        ownerId: business.ownerId,
        mpSubscriptionId: args.mpSubscriptionId,
        mpStatus: args.mpStatus,
        plan: "pro",
        priceReais: 50,
        billingCycle: "monthly",
        startedAt: now,
        nextBillingAt: args.nextBillingDate,
        createdAt: now,
        updatedAt: now,
      });
    }

    // Update business plan based on subscription status
    const isActive = args.mpStatus === "authorized";
    const business = await ctx.db.get(businessId);
    if (business) {
      await ctx.db.patch(businessId, {
        plan: isActive ? "pro" : "free",
        hasMiniSite: isActive,
        // Suspend business if subscription is cancelled/failed
        status: !isActive && business.status === "active" ? "suspended" : business.status,
        updatedAt: now,
      });
    }
  },
});

export const recordPayment = mutation({
  args: {
    mpPaymentId: v.string(),
    mpSubscriptionId: v.string(),
    amount: v.number(),
    status: v.string(),
    paidAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Find subscription
    const sub = await ctx.db
      .query("subscriptions")
      .withIndex("by_mp_subscription", (q) => q.eq("mpSubscriptionId", args.mpSubscriptionId))
      .unique();

    if (!sub) return;

    // Check for duplicate payment
    const existing = await ctx.db
      .query("paymentHistory")
      .withIndex("by_subscription", (q) => q.eq("subscriptionId", sub._id))
      .filter((q) => q.eq(q.field("mpPaymentId"), args.mpPaymentId))
      .unique();

    if (existing) return; // idempotent

    await ctx.db.insert("paymentHistory", {
      subscriptionId: sub._id,
      businessId: sub.businessId,
      mpPaymentId: args.mpPaymentId,
      amount: args.amount,
      status: args.status,
      paidAt: args.paidAt,
      createdAt: Date.now(),
    });
  },
});

export const getMySubscription = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const sub = await ctx.db
      .query("subscriptions")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .order("desc")
      .first();

    if (!sub) return null;

    const history = await ctx.db
      .query("paymentHistory")
      .withIndex("by_subscription", (q) => q.eq("subscriptionId", sub._id))
      .order("desc")
      .take(12);

    return { ...sub, history };
  },
});

export const cancelSubscription = mutation({
  args: { subscriptionId: v.id("subscriptions") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Não autenticado");

    const sub = await ctx.db.get(args.subscriptionId);
    if (!sub || sub.ownerId !== userId) throw new Error("Sem permissão");

    // Cancel in MercadoPago via fetch (call from client instead for simplicity)
    await ctx.db.patch(args.subscriptionId, {
      mpStatus: "cancelled",
      cancelledAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Downgrade business
    await ctx.db.patch(sub.businessId, { plan: "free", updatedAt: Date.now() });
  },
});
