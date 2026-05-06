import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://goyalinfotech.in/tizzy/api/v1/partner",
  }),
  tagTypes: [
    "login",
    "signup",
    "customer",
    "services",
    "subscriptions",
    "dashboard",
  ],
  endpoints: (builder) => ({}),
});
