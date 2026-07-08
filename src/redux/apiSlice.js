import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://superadmin.tizzygroup.com/api/v1/partner",
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
  ],
  endpoints: (builder) => ({}),
});
