// import { NextResponse } from "next/server";

// export function proxy(request) {
//   const token = request.cookies.get("userData")?.value;
//   const partnerApprovalStatus = request.cookies.get("partnerApproval")?.value;
//   console.log(partnerApprovalStatus, "partnerApprovalStatus");

//   const { pathname } = request.nextUrl;

//   const publicRoutes = [
//     "/auth/login",
//     "/auth/signup",
//     "/auth/otp-verification",
//   ];

//   const isPublicRoute = publicRoutes.includes(pathname);

//   if (!token && !isPublicRoute) {
//     return NextResponse.redirect(new URL("/auth/login", request.url));
//   }

//   if (token && isPublicRoute) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   if (token && pathname === "/") {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   return NextResponse.next();
// }
// export const config = {
//   matcher: ["/((?!_next|api|favicon.ico).*)"],
// };
import { NextResponse } from "next/server";

const readCookie = (request, name) => {
  const raw = request.cookies.get(name)?.value;
  if (!raw) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
};

export function proxy(request) {
  const token = request.cookies.get("userData")?.value;
  const partnerApprovalStatus = readCookie(request, "partnerApproval");
  const { pathname } = request.nextUrl;

  const authRoutes = ["/auth/login", "/auth/signup", "/auth/otp-verification"];
  const approvalRoute = "/partner-approval-request";

  const isAuthRoute = authRoutes.includes(pathname);
  const isApprovalRoute = pathname === approvalRoute;

  if (!token) {
    return isAuthRoute
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // if (isAuthRoute) {
  //   const target =
  //     partnerApprovalStatus === "approved" ? "/dashboard" : approvalRoute;
  //   return NextResponse.redirect(new URL(target, request.url));
  // }

  // if (partnerApprovalStatus !== "approved") {
  //   return isApprovalRoute
  //     ? NextResponse.next()
  //     : NextResponse.redirect(new URL(approvalRoute, request.url));
  // }
  if (authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
