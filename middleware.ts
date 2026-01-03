import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

function getSecret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("Missing AUTH_SECRET");
  return new TextEncoder().encode(s);
}

export async function middleware(req: NextRequest) {
  // TODO: Fix middleware authentication for virtual office
  // const { pathname } = req.nextUrl;
  // // ✅ Ignorar assets / internals
  // if (
  //   pathname.startsWith("/_next") ||
  //   pathname.startsWith("/favicon.ico") ||
  //   pathname.startsWith("/robots.txt") ||
  //   pathname.startsWith("/sitemap.xml")
  // ) {
  //   return NextResponse.next();
  // }
  // // ✅ Dejar pasar login (y opcionalmente logout / auth endpoints)
  // if (
  //   pathname === "/virtual-office/login" ||
  //   pathname.startsWith("/api/auth")
  // ) {
  //   return NextResponse.next();
  // }
  // // ✅ Solo proteger virtual-office
  // if (!pathname.startsWith("/virtual-office")) {
  //   return NextResponse.next();
  // }
  // const cookieName = process.env.AUTH_COOKIE_NAME || "ip_session";
  // const token = req.cookies.get(cookieName)?.value;
  // if (!token) {
  //   const url = req.nextUrl.clone();
  //   url.pathname = "/virtual-office/login";
  //   url.searchParams.set("next", pathname);
  //   return NextResponse.redirect(url);
  // }
  // try {
  //   await jwtVerify(token, getSecret());
  //   return NextResponse.next();
  // } catch {
  //   const url = req.nextUrl.clone();
  //   url.pathname = "/virtual-office/login";
  //   url.searchParams.set("next", pathname);
  //   return NextResponse.redirect(url);
  // }
}

export const config = {
  matcher: ["/virtual-office/:path*"],
};
