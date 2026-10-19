import Cookies from "js-cookie";
import { apiSlice } from "../apiSlice";

//cursor code
const PENDING_LOGOUT_TOKEN_KEY = "tizzy_pending_logout_token";

const getLogoutBaseUrl = () =>
  (
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://superadmin.tizzygroup.com/api/v1/partner"
  ).replace(/\/+$/, "");

const getTokenFromUserCookie = () => {
  const rawUserData = Cookies.get("userData");

  if (!rawUserData || rawUserData === "undefined" || rawUserData === "null") {
    return null;
  }

  try {
    return JSON.parse(rawUserData)?.token || null;
  } catch (error) {
    console.error("Invalid userData cookie during logout:", error);
    return null;
  }
};

/** Keep token so we can notify backend after browser close (session cookies are gone). */
export const markLogoutPending = () => {
  if (typeof window === "undefined") return;

  const token = getTokenFromUserCookie();
  if (!token) return;

  try {
    localStorage.setItem(PENDING_LOGOUT_TOKEN_KEY, token);
  } catch (error) {
    console.error("Failed to mark pending logout:", error);
  }
};

export const clearLogoutPending = () => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(PENDING_LOGOUT_TOKEN_KEY);
  } catch (error) {
    console.error("Failed to clear pending logout:", error);
  }
};

/** Call logout API during unload (keepalive) or on next visit. */
export const logoutOnPageExit = (token, { keepalive = true } = {}) => {
  if (!token) {
    return Promise.reject(new Error("Missing auth token for logout"));
  }

  return fetch(`${getLogoutBaseUrl()}/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
    keepalive,
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Logout request failed with status ${response.status}`);
    }
  });
};

/**
 * On next page load: if session cookies are gone but a token was saved on pagehide,
 * the browser was closed — notify backend. If cookies still exist (refresh / other tab), cancel.
 */
export const flushPendingLogout = async () => {
  if (typeof window === "undefined") return;

  let token;
  try {
    token = localStorage.getItem(PENDING_LOGOUT_TOKEN_KEY);
  } catch (error) {
    console.error("Failed to read pending logout:", error);
    return;
  }

  if (!token) return;

  // Refresh or another tab still has the session — do not log out backend
  if (getTokenFromUserCookie()) {
    clearLogoutPending();
    return;
  }

  try {
    await logoutOnPageExit(token, { keepalive: false });
    clearLogoutPending();
  } catch (error) {
    console.error("Pending logout failed:", error);
  }
};

//cursor code
const logoutApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    logout: builder.mutation({
      query: ({ body }) => {
        return {
          url: "/logout",
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["logout"],
    }),
  }),
});

export const { useLogoutMutation } = logoutApi;
