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
  }),
});

export const {
  useGetAllSubscriptionsMutation,
  useGetSubscriptionDetailsMutation,
} = subscriptionsApi;
