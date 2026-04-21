import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

async function requireAuth(ctx: any): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Não autenticado");
  return identity.subject;
}

export const upsert = mutation({
  args: {
    businessId: v.id("businesses"),
    template: v.union(
      v.literal("restaurante"), v.literal("hospedagem"), v.literal("beleza"),
      v.literal("turismo"), v.literal("loja"), v.literal("servicos")
    ),
    primaryColor: v.string(),
    secondaryColor: v.string(),
    fontStyle: v.union(v.literal("modern"), v.literal("elegant"), v.literal("bold")),
    features: v.object({
      scheduling: v.boolean(), whatsappButton: v.boolean(), photoCarousel: v.boolean(),
      serviceList: v.boolean(), map: v.boolean(), socialLinks: v.boolean(),
      reviews: v.boolean(), promotions: v.boolean(), menu: v.boolean(), roomTypes: v.boolean(),
    }),
    services: v.array(v.object({
      id: v.string(), name: v.string(),
      description: v.optional(v.string()), price: v.optional(v.number()),
      priceNote: v.optional(v.string()), imageId: v.optional(v.string()),
      category: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const clerkId = await requireAuth(ctx);

    const business = await ctx.db.get(args.businessId);
    if (!business || business.ownerId !== clerkId) throw new Error("Sem permissão");
    if (business.plan !== "pro") throw new Error("Plano Pro necessário para mini-site");

    const now = Date.now();
    const { businessId, ...configData } = args;

    const existing = business.miniSiteConfig
      ? await ctx.db.get(business.miniSiteConfig)
      : null;

    if (existing) {
      await ctx.db.patch(existing._id, { ...configData, updatedAt: now });
      return existing._id;
    } else {
      const configId = await ctx.db.insert("miniSiteConfigs", {
        businessId,
        ...configData,
        promotions: [],
        createdAt: now,
        updatedAt: now,
      });
      await ctx.db.patch(businessId, { hasMiniSite: true, miniSiteConfig: configId, updatedAt: now });
      return configId;
    }
  },
});

export const getByBusiness = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("miniSiteConfigs")
      .withIndex("by_business", (q) => q.eq("businessId", args.businessId))
      .unique();
  },
});
