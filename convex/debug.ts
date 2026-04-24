import { query } from "./_generated/server";

// Debug helper: returns basic caller identity (null if unauthenticated)
export const whoami = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { isAuthenticated: false };
    return {
      isAuthenticated: true,
      subject: identity.subject,
      issuer: identity.issuer,
      tokenIdentifier: identity.tokenIdentifier,
      email: identity.email ?? null,
      name: identity.name ?? null,
    };
  },
});
