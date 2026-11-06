import Cookies from "js-cookie";
import { apiSlice } from "../apiSlice";

const PENDING_LOGOUT_TOKEN_KEY = "tizzy_pending_logout_token";
const AUTH_TOKEN_BACKUP_KEY = "tizzy_auth_token_backup";

const getLogoutBaseUrl = () =>
  (
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://superadmin.tizzygroup.com/api/v1/partner"
  ).replace(/\/+$/, "");

const parseUserCookie = (rawUserData) => {
  if (!rawUserData || rawUserData === "undefined" || rawUserData === "null") {
    return null;
  }

  try {
    return JSON.parse(rawUserData);
  } catch {
    try {
      return JSON.parse(decodeURIComponent(rawUserData));
    } catch (error) {
      console.error("Invalid userData cookie during logout:", error);
      return null;
    }
  }
};

export const getTokenFromUserCookie = () => {
  return parseUserCookie(Cookies.get("userData"))?.token || null;
};

/** Keep a durable copy of the token while the user is logged in. */
export const syncAuthTokenBackup = () => {
  if (typeof window === "undefined") return;

  const token = getTokenFromUserCookie();
  if (!token) return;

  try {
    localStorage.setItem(AUTH_TOKEN_BACKUP_KEY, token);
  } catch (error) {
    console.error("Failed to sync auth token backup:", error);
  }
};

const getBackupToken = () => {
  if (typeof window === "undefined") return null;

  try {
    return localStorage.getItem(AUTH_TOKEN_BACKUP_KEY);
  } catch {
    return null;
  }
};

const getLogoutToken = () => getTokenFromUserCookie() || getBackupToken();

/** Keep token so we can notify backend after browser close (session cookies are gone). */
export const markLogoutPending = (token = getLogoutToken()) => {
  if (typeof window === "undefined" || !token) return;

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
    localStorage.removeItem(AUTH_TOKEN_BACKUP_KEY);
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
    if (!response.ok && response.status !== 401) {
      throw new Error(`Logout request failed with status ${response.status}`);
    }
  });
};

/**
 * Runs on pagehide and beforeunload. Those events also fire on refresh and
 * when a logged-in user opens /auth/login, so this must not call the logout API.
 * It only stores the token. flushPendingLogout calls the API on the next visit
 * if the session cookie is gone (the browser was closed).
 */
export const handleBrowserCloseLogout = () => {
  const token = getLogoutToken();
  if (!token) return;

  markLogoutPending(token);
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

  // Refresh or another tab still has the session — do not log out backend again
  if (getTokenFromUserCookie()) {
    try {
      localStorage.removeItem(PENDING_LOGOUT_TOKEN_KEY);
    } catch {
      /* ignore */
    }
    syncAuthTokenBackup();
    return;
  }

  try {
    await logoutOnPageExit(token, { keepalive: false });
    clearLogoutPending();
  } catch (error) {
    console.error("Pending logout failed:", error);
  }
};

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
