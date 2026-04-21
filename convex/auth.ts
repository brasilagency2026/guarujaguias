// Clerk handles authentication — Convex reads the JWT from Clerk
// No @convex-dev/auth setup needed.
// 
// To get the current user in Convex functions, use:
//   const identity = await ctx.auth.getUserIdentity();
//   if (!identity) throw new Error("Not authenticated");
//   const clerkId = identity.subject; // e.g. "user_2abc123"
//
// Example usage in a mutation:
//   export const myMutation = mutation({
//     handler: async (ctx) => {
//       const identity = await ctx.auth.getUserIdentity();
//       if (!identity) throw new Error("Unauthenticated");
//       // use identity.subject as the user's unique ID
//     }
//   });
//
// No exports needed from this file — it's documentation only.
export {};
