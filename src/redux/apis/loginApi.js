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
      providesTags: ["login"],
    }),
    verifyOtp: builder.mutation({
      query: ({ body }) => {
        return {
          url: "/verify-otp",
          method: "POST",
          body: body,
        };
      },
      providesTags: ["login"],
    }),
    resendOtp: builder.mutation({
      query: ({ body }) => {
        return {
          url: "/partner-resend-otp",
          method: "POST",
          body: body,
        };
      },
      providesTags: ["login"],
    }),
  }),
});

export const {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
} = loginApi;
