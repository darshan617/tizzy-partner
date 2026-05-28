import { apiSlice } from "../apiSlice";

const balanceAndCartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBalanceAndCartDetails: builder.query({
      query: ({ partner_id }) => {
        return {
          url: `/getcarts-and-CreditDetails/${partner_id}`,
          method: "GET",
        };
      },
      providesTags: ["balanceAndCart"],
    }),
  }),
});

export const { useGetBalanceAndCartDetailsQuery } = balanceAndCartApi;
