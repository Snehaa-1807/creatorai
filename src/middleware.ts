import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/ideas/:path*",
    "/hooks/:path*",
    "/scripts/:path*",
    "/trends/:path*",
    "/calendar/:path*",
    "/saved/:path*",
    "/settings/:path*",
    "/billing/:path*",
    "/titles/:path*",
    "/repurpose/:path*",
    "/api/generate/:path*",
    "/api/saved/:path*",
    "/api/user/:path*",
  ],
};
