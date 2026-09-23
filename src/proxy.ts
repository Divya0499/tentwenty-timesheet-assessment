import { withAuth } from "next-auth/middleware";
import type { NextRequestWithAuth } from "next-auth/middleware";
import type { NextFetchEvent, NextRequest } from "next/server";

// Next.js 16 renamed the middleware convention to "proxy" and requires a
// literal named/default function export (a call expression like
// `export default withAuth()` isn't statically recognized, and it also
// isn't how withAuth is meant to be invoked — it expects the request
// itself as its first argument). Any route under /dashboard requires a
// signed-in session; unauthenticated visitors are redirected to /login.
export function proxy(request: NextRequest, event: NextFetchEvent) {
  // withAuth's types expect its own NextRequestWithAuth wrapper (it adds
  // `.nextauth` at runtime, which is why the plain NextRequest Next.js
  // actually hands the proxy is safe to cast here).
  return withAuth(request as NextRequestWithAuth, event);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
