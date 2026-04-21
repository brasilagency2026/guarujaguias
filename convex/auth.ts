import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Password,
    // Google OAuth — uncomment when GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET are set
    // Google,
  ],
});
