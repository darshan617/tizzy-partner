import { apiSlice } from "../apiSlice";

const userDetailApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPartnerUserDetail: builder.mutation({
      query: ({ body }) => ({
        url: "/partner-user-detail",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["UserDetail"],
    }),

    updatePartnerUser: builder.mutation({
      query: ({ body }) => ({
        url: "/partner-user-update",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["UserDetail"],
    }),
  }),
});

export const { useGetPartnerUserDetailMutation, useUpdatePartnerUserMutation } = userDetailApi;