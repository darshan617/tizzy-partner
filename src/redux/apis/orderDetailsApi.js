import { apiSlice } from "../apiSlice";

const orderDetailsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    orderDetails: builder.mutation({
      query: ({ body }) => {
        return {
          url: "order-details",
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["orderDetails"],
    }),
    orderPlaceWithoutAadhaar: builder.mutation({
      query: ({ body }) => {
        return {
          url: "order-place-without-aadhaar ",
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["orderPlaceWithoutAadhaar"],
    }),
  }),
});

export const { useOrderDetailsMutation, useOrderPlaceWithoutAadhaarMutation } =
  orderDetailsApi;
