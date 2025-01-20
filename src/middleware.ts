import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const loginPageUrl = "/login";
  const notFoundPageUrl = "/notfound";
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // Fetch the authentication token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! });

  if (!token) {
    if (pathname === loginPageUrl) {
      return NextResponse.next();
    }

    url.pathname = loginPageUrl;
    return NextResponse.redirect(url);
  }

  const role = token.role;

  if (role === "user") {
    if (pathname.startsWith("/dashboard")) {
      url.pathname = notFoundPageUrl;
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/user-dashboard")) {
      return NextResponse.next();
    }
  } else if (role === "admin") {
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*","/user-dashboard/:path*"]
};
