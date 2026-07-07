import { apiSlice } from "../apiSlice";

const draftPoApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    generateNewOrder: builder.mutation({
      query: ({ body }) => ({
        url: "/generate-new-order",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["draftPo", "addToCart"],
    }),
  }),
});

export const { useGenerateNewOrderMutation } = draftPoApi;
