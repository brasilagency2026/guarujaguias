import { NextRequest, NextResponse } from "next/server";

// Simplified middleware — auth protection will be handled client-side
// once ConvexAuthNextjsProvider is properly configured with JWT_PRIVATE_KEY
export default function middleware(request: NextRequest) {
  // Dashboard and admin routes are accessible — client components handle
  // redirect to /login when user is not authenticated via Convex
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
