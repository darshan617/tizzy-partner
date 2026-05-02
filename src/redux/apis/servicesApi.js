import { apiSlice } from "../apiSlice";

const servicesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProviders: builder.query({
      query: () => {
        return {
          url: "/providers",
          method: "GET",
        };
      },
      providesTags: ["services"],
    }),
    providerVariants: builder.mutation({
      query: ({ body }) => {
        return {
          url: "/providers-variants",
          method: "POST",
          body: body,
        };
      },
      providesTags: ["services"],
    }),
    getPlans: builder.mutation({
      query: ({ body }) => {
        return {
          url: "/providers-plans",
          method: "POST",
          body: body,
        };
      },
      providesTags: ["services"],
    }),
  }),
});

export const { useGetProvidersQuery, useProviderVariantsMutation, useGetPlansMutation } =
  servicesApi;
