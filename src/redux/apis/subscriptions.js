import { apiSlice } from "../apiSlice";

const subscriptionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubscriptions: builder.mutation({
      query: ({ partner_id, body }) => {
        return {
          url: `/order-list`,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["subscriptions"],
    }),
    getSubscriptionDetails: builder.mutation({
      query: ({ body }) => {
        return {
          url: `/subscription-details`,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["subscriptions"],
    }),
    getDomainHistory: builder.mutation({
      query: ({ body }) => {
        return {
          url: "/domain-history",
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["addToCart"],
    }),
  }),
});

export const {
  useGetAllSubscriptionsMutation,
  useGetSubscriptionDetailsMutation,
  useGetDomainHistoryMutation,
} = subscriptionsApi;
