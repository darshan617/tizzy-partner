import { apiSlice } from "../apiSlice";

const partnerApproveRequestApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPartnerApprovalRequest: builder.mutation({
      query: ({ body }) => {
        return {
          url: `/partner-approval-status`,
          method: "s",
          body: body,
        };
      },
    }),
  }),
});

export const { useGetPartnerApprovalRequestMutation } =
  partnerApproveRequestApi;
