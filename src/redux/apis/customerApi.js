import { apiSlice } from "../apiSlice";

const customerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCustomer: builder.mutation({
      query: ({ body }) => {
        return {
          url: "/add-customer",
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["customer"],
    }),
    updateCustomer: builder.mutation({
      query: ({ body }) => {
        return {
          url: `/update-customer`,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["customer"],
    }),
    getAllCustomers: builder.query({
      query: ({ partner_id }) => {
        return {
          url: `/customers?partner_id=${partner_id}`,
          method: "GET",
        };
      },
      providesTags: ["customer", "customer"],
    }),
    getSpecificCustomerDetails: builder.query({
      query: ({ customer_id, partner_id }) => {
        return {
          url: `/getCustomerDetail?customer_id=${customer_id}&partner_id=${partner_id}`,
          method: "GET",
        };
      },
      providesTags: ["customer"],
    }),
    upgradeDowngradePlan: builder.query({
      query: ({ type, plan_id }) => {
        return {
          url: `/${type}?plan_id=${plan_id}`,
          method: "GET",
        };
      },
      providesTags: ["customer"],
    }),
  }),
});

export const {
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useGetAllCustomersQuery,
  useGetSpecificCustomerDetailsQuery,
  useLazyUpgradeDowngradePlanQuery,
} = customerApi;
