import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

async function requireAuth(ctx: any): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Não autenticado");
  return identity.subject;
}

export const handleSubscriptionUpdate = mutation({
  args: {
    mpSubscriptionId: v.string(),
    mpStatus: v.string(),
    nextBillingDate: v.optional(v.number()),
    externalReference: v.string(),
  },
  handler: async (ctx, args) => {
    const businessId = args.externalReference.replace("business_", "") as any;

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
      const business = await ctx.db
        .query("businesses")
        .filter((q) => q.eq(q.field("_id"), businessId))
        .unique();

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

    const isActive = args.mpStatus === "authorized";
    const business = await ctx.db
      .query("businesses")
      .filter((q) => q.eq(q.field("_id"), businessId))
      .unique();

    if (business) {
      await ctx.db.patch(businessId, {
        plan: isActive ? "pro" : "free",
        hasMiniSite: isActive,
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
    const sub = await ctx.db
      .query("subscriptions")
      .withIndex("by_mp_subscription", (q) => q.eq("mpSubscriptionId", args.mpSubscriptionId))
      .unique();
    if (!sub) return;

    const existing = await ctx.db
      .query("paymentHistory")
      .withIndex("by_subscription", (q) => q.eq("subscriptionId", sub._id))
      .filter((q) => q.eq(q.field("mpPaymentId"), args.mpPaymentId))
      .unique();
    if (existing) return;

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
    const clerkId = await requireAuth(ctx);

    const sub = await ctx.db
      .query("subscriptions")
      .withIndex("by_owner", (q) => q.eq("ownerId", clerkId))
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
    const clerkId = await requireAuth(ctx);

    const sub = await ctx.db
      .query("subscriptions")
      .filter((q) => q.eq(q.field("_id"), args.subscriptionId))
      .unique();
    if (!sub || sub.ownerId !== clerkId) throw new Error("Sem permissão");

    await ctx.db.patch(args.subscriptionId, {
      mpStatus: "cancelled",
      cancelledAt: Date.now(),
      updatedAt: Date.now(),
    });
    await ctx.db.patch(sub.businessId, { plan: "free", updatedAt: Date.now() });
  },
});
