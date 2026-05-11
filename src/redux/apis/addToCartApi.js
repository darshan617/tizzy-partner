import { apiSlice } from "../apiSlice";

const addToCartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addToCart: builder.mutation({
      query: ({ body }) => {
        return {
          url: `/add-to-cart`,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["addToCart"],
    }),
    getCartDetails: builder.mutation({
      query: ({ body }) => {
        return {
          url: `/getCartDetails`,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["addToCart"],
    }),
    updateCart: builder.mutation({
      query: ({ body }) => {
        return {
          url: `/update-cart`,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["addToCart"],
    }),
    renewCustomerDetails: builder.mutation({
      query: ({ body }) => {
        return {
          url: "/renewalsCustomerdetails",
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["addToCart"],
    }),
  }),
});

export const {
  useAddToCartMutation,
  useGetCartDetailsMutation,
  useUpdateCartMutation,
  useRenewCustomerDetailsMutation,
} = addToCartApi;
