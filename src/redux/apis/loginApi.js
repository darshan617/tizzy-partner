import { apiSlice } from "../apiSlice";

const loginApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendOtp: builder.mutation({
      query: ({ body }) => {
        return {
          url: "/send-otp",
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["login"],
    }),
    verifyOtp: builder.mutation({
      query: ({ body }) => {
        return {
          url: "/verify-otp",
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["login"],
    }),
    resendOtp: builder.mutation({
      query: ({ body }) => {
        return {
          url: "/partner-resend-otp",
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["login"],
    }),
  }),
});

export const {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
} = loginApi;
