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
    getUpdateCartDetails: builder.query({
      query: ({ partner_id, plan_id }) => {
        return {
          url: `/updated?partner_id=${partner_id}&plan_id=${plan_id}`,
          method: "GET",
        };
      },
      providesTags: ["addToCart"],
    }),
    deleteFromCart: builder.mutation({
      query: ({ body }) => {
        return {
          url: `/delete-cart`,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["addToCart"],
    }),
    upgradeAddToCart: builder.mutation({
      query: ({ body }) => {
        return {
          url: `/upgrade-add-to-cart`,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["addToCart"],
    }),
    getUpgradeAddToCartDetails: builder.mutation({
      query: ({ body }) => ({
        url: `/upgrade-cart-details`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["addToCart"],
    }),
    checkIsDomainAvailable: builder.query({
      query: ({ domain_name }) => {
        return {
          url: `/orders-check-domain?domain_name=${domain_name}`,
          method: "GET",
        };
      },
      providesTags: ["addToCart"],
    }),
  }),
});

export const {
  useAddToCartMutation,
  useGetCartDetailsMutation,
  useUpdateCartMutation,
  useRenewCustomerDetailsMutation,
  useGetUpdateCartDetailsQuery,
  useDeleteFromCartMutation,
  useUpgradeAddToCartMutation,
  useGetUpgradeAddToCartDetailsMutation,
  useCheckIsDomainAvailableQuery,
  useLazyCheckIsDomainAvailableQuery,
} = addToCartApi;
