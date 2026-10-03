import { useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const ROUTE_PERMISSIONS = {
  "/transactions": "transactions",
  "/renewals": "renewals",
  "/customers": "customers",
  "/reports": "reports",
  "/tickets": "tickets",
  "/services": "subscriptions",
  "/subscriptions": "subscriptions",
  "/invoice": "invoices",
  "/credit-notes": "credit_note",
  "/my-account": "my_account",
  "/billing-credit": "billing_credits",
  "/user-management": "user_management",
  "/notifications-settings": "notifications_settings",
  "/help-center": "help_center",
  "/support": "support",
};

export default function PermissionRouteGuard() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    let userData;

    try {
      const userDataCookie = Cookies.get("userData");

      if (userDataCookie) {
        userData = JSON.parse(decodeURIComponent(userDataCookie));
      }
    } catch (error) {
      console.error("userData parse error:", error);
    }

    // Only apply permission restriction to partner_user
    if (userData?.login_as !== "partner_user") {
      return;
    }

    const storedPermissions = localStorage.getItem("UP");

    if (!storedPermissions) {
      router.replace("/dashboard");
      return;
    }

    let permissions = [];

    try {
      permissions = JSON.parse(storedPermissions);
    } catch (error) {
      console.error("UP parse error:", error);
      router.replace("/dashboard");
      return;
    }

    const pathname = router.pathname;

    console.log("Current pathname:", pathname);
    console.log("Permissions:", permissions);

    const matchedRoute = Object.keys(ROUTE_PERMISSIONS).find(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );

    // This route doesn't need permission checking
    if (!matchedRoute) {
      return;
    }

    const requiredPermission = ROUTE_PERMISSIONS[matchedRoute];

    console.log("Required permission:", requiredPermission);

    const permission = permissions.find(
      (item) => item?.module_key === requiredPermission,
    );

    console.log("Matched permission:", permission);

    // Permission exists but can_view is false
    if (!permission?.can_view) {
      console.log(`No view permission for ${requiredPermission}`);

      router.replace("/dashboard");
    }
  }, [router.isReady, router.pathname]);

  return null;
}
