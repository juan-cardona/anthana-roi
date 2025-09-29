import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const isProtected = url.pathname.startsWith("/app");
  if (!isProtected) return NextResponse.next();

  // Supabase stores a 'sb-access-token' cookie in browser; presence check (MVP)
  const hasSession = req.cookies.get("sb-access-token") || req.cookies.get("sb:token");
  if (!hasSession) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirectedFrom", url.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}
export const config = { matcher: ["/app/:path*"] };
