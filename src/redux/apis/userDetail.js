import { apiSlice } from "../apiSlice";

const userDetailApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPartnerUserDetail: builder.mutation({
      query: ({ body }) => ({
        url: "/partner-user-detail",
        method: "POST",
        body: body,
      }),
    }),
  }),
});

export const { useGetPartnerUserDetailMutation } = userDetailApi;