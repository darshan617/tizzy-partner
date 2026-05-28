import { apiSlice } from "../apiSlice";

const partnerApproveRequestApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPartnerApprovalRequest: builder.mutation({
      query: ({ body }) => {
        return {
          url: `/partner-approval-status`,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["partnerApprovalRequest"],
    }),
  }),
});

export const { useGetPartnerApprovalRequestMutation } =
  partnerApproveRequestApi;
