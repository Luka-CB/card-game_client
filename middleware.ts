import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check if the 'sid' cookie exists
  const token = request.cookies.get("sid")?.value;

  // If no token is found, redirect to the home page
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow the request to proceed if the token exists
  return NextResponse.next();
}

// Specify the routes where the middleware should apply
export const config = {
  matcher: ["/games/:path*", "/about-us", "/about-game"], // Apply to all routes except static files and API routes
};
