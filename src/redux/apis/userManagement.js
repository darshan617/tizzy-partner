import { apiSlice } from "../apiSlice";

const userManagementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPartnerUsers: builder.mutation({
      query: ({ body }) => ({
        url: "/partner-users",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["userManagement"],
    }),
    partnerUserAdd: builder.mutation({
      query: ({ body }) => ({
        url: "/partner-user-add",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["userManagement"],
    }),
    
  }),
});

export const { useGetPartnerUsersMutation, usePartnerUserAddMutation } =
  userManagementApi;
