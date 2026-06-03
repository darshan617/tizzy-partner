import { apiSlice } from "../apiSlice";

const renewalsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllRenewalsList: builder.mutation({
      query: ({ body }) => {
        return {
          url: "/renewals",
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["renewals"],
    }),
  }),
});

export const { useGetAllRenewalsListMutation } = renewalsApi;
