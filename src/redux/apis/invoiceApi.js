import { apiSlice } from "../apiSlice";

const invoiceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInvoiceDetails: builder.mutation({
      query: ({ body }) => {
        return {
          url: `/invoice`,
          method: "POST",
          body: body,
        };
      },
    }),
    invalidatesTags: ["invoice"],
  }),
});

export const { useGetInvoiceDetailsMutation } = invoiceApi;
