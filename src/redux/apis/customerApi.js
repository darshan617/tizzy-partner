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
      providesTags: ["customer"],
    }),
    getAllCustomers: builder.query({
      query: ({partner_id}) => {
        return{
          url:`/customers?partner_id=${partner_id}`,
          method:"GET",
        }
      },
      providesTags: ["customer"],
    }),
    getCustomerById: builder.query({
      query: ({customer_id}) => {
        return{
          url:`/customer/${customer_id}`,
          method:"GET",
        }
      },
      providesTags: ["customer"],
    })
  }),
});

export const {
    useCreateCustomerMutation,
    useGetAllCustomersQuery
} = customerApi;
