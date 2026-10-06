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
    partnerUserDeactivateDevice: builder.mutation({
      query: ({ body }) => {
        return {
          url: "partner-user-deactivate-device",
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["userManagement"],
    }),
    partnerUserInactive: builder.mutation({
      query: ({ body }) => ({
        url: `/partner-user-inactive`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["supportTickets"],
    }),
  }),
});

export const {
  useGetPartnerUsersMutation,
  usePartnerUserAddMutation,
  usePartnerUserDeactivateDeviceMutation,
  usePartnerUserInactiveMutation,
} = userManagementApi;
