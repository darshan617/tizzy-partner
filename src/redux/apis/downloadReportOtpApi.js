import { apiSlice } from "../apiSlice";

const downloadReportOtpApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDownloadReportApi: builder.mutation({
      query: ({ body }) => {
        return {
          url: "/report/send",
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["downloadReportOtpApi"],
    }),
    verifyDownloadReportApi: builder.mutation({
      query: ({ body }) => {
        return {
          url: "/report/verify",
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["downloadReportOtpApi"],
    }),
    resendDownloadReportApi: builder.mutation({
      query: ({ body }) => {
        return {
          url: "/report/resend",
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["downloadReportOtpApi"],
    }),
  }),
});

export const {
  useGetDownloadReportApiMutation,
  useVerifyDownloadReportApiMutation,
  useResendDownloadReportApiMutation,
} = downloadReportOtpApi;
