import { apiSlice } from "../apiSlice";

const transactionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTransactionHistory: builder?.mutation({
      query: ({ body }) => {
        return {
          url: "/transaction-history",
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["transactions"],
    }),
    getTransactionDetails: builder?.mutation({
      query: ({ body }) => {
        return {
          url: "/transaction-details",
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["transactionDetails"],
    }),
  }),
});

export const {
  useGetTransactionHistoryMutation,
  useGetTransactionDetailsMutation,
} = transactionsApi;
