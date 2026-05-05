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
      providesTags: ["subscriptions"],
    }),
  }),
});

export const {
useGetAllSubscriptionsMutation
} = subscriptionsApi;
