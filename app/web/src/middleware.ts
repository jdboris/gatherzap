import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { COMING_SOON_MODE } from "./utils/feature-flags";

export default function customMiddleware(
  req: NextRequest,
  event: NextFetchEvent
) {
  if (COMING_SOON_MODE) {
    const url = new URL(req.url);
    if (url.pathname !== "/") {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return clerkMiddleware()(req, event);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
