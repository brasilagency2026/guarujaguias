import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/admin(.*)"]);

export default convexAuthNextjsMiddleware(async (request) => {
  if (isProtectedRoute(request) && !(await isAuthenticatedNextjs())) {
    return nextjsMiddlewareRedirect(
      request,
      "/login?redirect=" + encodeURIComponent(request.nextUrl.pathname)
    );
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
