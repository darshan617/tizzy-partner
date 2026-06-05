import { apiSlice } from "../apiSlice";

const dashbaordApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: ({ partner_id }) => {
        return {
          url: `/dashboard-detail?partner_id=${partner_id}`,
          method: "GET",
        };
      },
    }),

    salesReport: builder.mutation({
      query: ({ body }) => {
        return {
          url: `/sales-report`,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["salesReport"],
    }),
  }),
});

export const { useGetDashboardDataQuery, useSalesReportMutation } =
  dashbaordApi;
