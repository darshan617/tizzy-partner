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
  }),
});

export const { useGetTransactionHistoryMutation } = transactionsApi;
