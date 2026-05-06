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
  }),
});

export const { useGetDashboardDataQuery } = dashbaordApi;
