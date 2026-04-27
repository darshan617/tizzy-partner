import { NextResponse } from "next/server";

export function proxy(request) {
  const token = request.cookies.get("userData")?.value;
  console.log(token, "token");

  const { pathname } = request.nextUrl;

  const isProtectedRoute = pathname.startsWith("/dashboard");
  const isHomeRoute = pathname === "/";
  const isLoginAuthRoute = pathname === "/auth/login";
  const isSignupAuthRoute = pathname === "/auth/signup";

  if (!token && isHomeRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (token && isLoginAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (token && isSignupAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // matcher: ["/dashboard/:path*", "/login"],
  matcher: ["/", "/auth/login", "/auth/signup"],
};
