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
      invalidatesTags: ["invoice"],
    }),
    invoicesPaymentDetails: builder.mutation({
      query: ({ body }) => {
        return {
          url: `/invoices-payment-details`,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["invoice"],
    }),
    paymentVerify: builder.mutation({
      query: ({ body }) => {
        return {
          url: `/payment-verify`,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["invoice"],
    }),
  }),
});

export const {
  useGetInvoiceDetailsMutation,
  useInvoicesPaymentDetailsMutation,
  usePaymentVerifyMutation,
} = invoiceApi;
