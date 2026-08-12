import { apiSlice } from "../apiSlice";

const reportApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.mutation({
      query: (body) => {
        return {
          url: "/report-list",
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["reports"],
    }),
  }),
});

export const { useGetReportsMutation } = reportApi;
