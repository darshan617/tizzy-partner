import { NextResponse } from "next/server";

export function proxy(request) {
  const token = request.cookies.get("userData")?.value;
  console.log(token, "token");

  const { pathname } = request.nextUrl;

  //   const isProtectedRoute = pathname.startsWith("/dashboard");
  const isHomeRoute = pathname === "/";
  const isDashboardRoute = pathname === "/dashboard";
  const isLoginAuthRoute = pathname === "/auth/login";
  const isSignupAuthRoute = pathname === "/auth/signup";
  const verfiyOtpRoute = pathname === "/auth/otp-verification";

  if (!token && isHomeRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  if (!token && isDashboardRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  if (token && isHomeRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (token && isLoginAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (token && isSignupAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (token && verfiyOtpRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // matcher: ["/dashboard/:path*", "/login"],
  matcher: [
    "/",
    "/auth/login",
    "/auth/signup",
    "/dashboard",
    "/auth/otp-verification",
  ],
};
