import { apiSlice } from "../apiSlice";

const signupApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: ({ body }) => {
        return {
          url: "/register-validation",
          method: "POST",
          body: body,
        };
      },
      providesTags: ["signup"],
    }),
    searchGstin: builder?.mutation({
      query: ({ body }) => {
        return {
          url: "/search-gstin",
          method: "POST",
          body: body,
        };
      },
      providesTags: ["signup"],
    }),
    getOtpVerified: builder?.mutation({
      query: ({ body }) => {
        return {
          url: "/user-login-verify-otp",
          method: "POST",
          body: body,
        };
      },
      providesTags: ["signup"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useSearchGstinMutation,
  useGetOtpVerifiedMutation,
} = signupApi;
