import { apiSlice } from "../apiSlice";

const signupApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: ({ body }) => {
        return {
          url: "/register",
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["signup"],
    }),
    searchGstin: builder?.mutation({
      query: ({ body }) => {
        return {
          url: "https://superadmin.tizzygroup.com/api/v1/search-gstin",
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["signup"],
    }),
    getOtpVerified: builder?.mutation({
      query: ({ body }) => {
        return {
          url: "verify-registration-otp",
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["signup"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useSearchGstinMutation,
  useGetOtpVerifiedMutation,
} = signupApi;
