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
  }),
});

export const {
    useCreateCustomerMutation
} = customerApi;
