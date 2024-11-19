import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  // Define the login page URL
  const loginPageUrl = "/login";

  // Check if the user is authenticated
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! });
  // If the user is not authenticated and trying to access a protected route
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = loginPageUrl;
    return NextResponse.redirect(url);
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Specify the paths for middleware to run on
export const config = {
  matcher: ["/user-dashboard"], // Apply middleware to all routes under /protected
};
