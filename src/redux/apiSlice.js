import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://superadmin.tizzygroup.com/api/v1/partner",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      headers.set("Accept", "application/json");

      const userData = Cookies.get("userData");

      if (userData) {
        try {
          const parsedData = JSON.parse(userData);

          if (parsedData?.token) {
            headers.set("Authorization", `Bearer ${parsedData.token}`);
          }
        } catch (error) {
          console.error("Invalid userData cookie:", error);
        }
      }

      return headers;
    },
  }),

  tagTypes: [
    "login",
    "signup",
    "customer",
    "services",
    "subscriptions",
    "dashboard",
    "addToCart",
    "invoice",
    "balanceAndCart",
    "transactions",
    "partnerApprovalRequest",
    "notification",
    "renewals",
    "salesReport",
    "draftPo",
    "accountDetail",
    "supportTickets",
    "creditNotes",
    "userManagement",
    "transactionDetails",
    "orderPlaceWithoutAadhaar",
    "orderDetails",
    "userDetail",
    "reports",
  ],
  endpoints: (builder) => ({}),
});
