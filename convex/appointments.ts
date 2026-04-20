import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// ─── PUBLIC: book appointment from mini-site ───────────────────────────────

export const book = mutation({
  args: {
    businessId: v.id("businesses"),
    serviceId: v.optional(v.string()),
    customerName: v.string(),
    customerPhone: v.string(),
    customerEmail: v.optional(v.string()),
    date: v.string(),       // "2025-06-15"
    timeSlot: v.string(),   // "14:00"
    durationMinutes: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check slot is not already taken
    const existing = await ctx.db
      .query("appointments")
      .withIndex("by_business_date", (q) =>
        q.eq("businessId", args.businessId).eq("date", args.date)
      )
      .filter((q) =>
        q.and(
          q.eq(q.field("timeSlot"), args.timeSlot),
          q.neq(q.field("status"), "cancelled")
        )
      )
      .unique();

    if (existing) throw new Error("Horário já reservado. Escolha outro.");

    return await ctx.db.insert("appointments", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

// ─── OWNER: list appointments ──────────────────────────────────────────────

export const listByBusiness = query({
  args: {
    businessId: v.id("businesses"),
    date: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Não autenticado");

    const business = await ctx.db.get(args.businessId);
    if (!business || business.ownerId !== userId) throw new Error("Sem permissão");

    let q = ctx.db
      .query("appointments")
      .withIndex("by_business", (q) => q.eq("businessId", args.businessId));

    const results = await q.collect();

    return results
      .filter((a) => !args.date   || a.date === args.date)
      .filter((a) => !args.status || a.status === args.status)
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.timeSlot.localeCompare(b.timeSlot);
      });
  },
});

export const getAvailableSlots = query({
  args: {
    businessId: v.id("businesses"),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const ALL_SLOTS = [
      "08:00", "09:00", "10:00", "11:00",
      "13:00", "14:00", "15:00", "16:00", "17:00",
    ];

    const booked = await ctx.db
      .query("appointments")
      .withIndex("by_business_date", (q) =>
        q.eq("businessId", args.businessId).eq("date", args.date)
      )
      .filter((q) => q.neq(q.field("status"), "cancelled"))
      .collect();

    const bookedSlots = new Set(booked.map((a) => a.timeSlot));

    return ALL_SLOTS.map((slot) => ({
      slot,
      available: !bookedSlots.has(slot),
    }));
  },
});

export const updateStatus = mutation({
  args: {
    appointmentId: v.id("appointments"),
    status: v.union(
      v.literal("confirmed"),
      v.literal("cancelled"),
      v.literal("completed")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Não autenticado");

    const apt = await ctx.db.get(args.appointmentId);
    if (!apt) throw new Error("Agendamento não encontrado");

    const business = await ctx.db.get(apt.businessId);
    if (!business || business.ownerId !== userId) throw new Error("Sem permissão");

    await ctx.db.patch(args.appointmentId, { status: args.status });
  },
});
