import { apiSlice } from "../apiSlice";

const supportTicketsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addTicket: builder.mutation({
      query: ({ body }) => ({
        url: "/add-ticket",
        method: "POST",
        body,
      }),
      invalidatesTags: ["supportTickets"],
    }),
    getOrdersByPartner: builder.mutation({
      query: ({ body }) => ({
        url: `/get-orders-by-partner`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["supportTickets"],
    }),
    planViewByPartner: builder.query({
      query: () => ({
        url: `/planViewByPartner`,
        method: "GET",
      }),
      providesTags: ["supportTickets"],
    }),
    getTickets: builder.mutation({
      query: ({ body }) => ({
        url: `/get-tickets`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["supportTickets"],
    }),
    getTicketDetail: builder.mutation({
      query: ({ body }) => ({
        url: `/get-ticket-detail`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["supportTickets"],
    }),
    detailsForSupport: builder.mutation({
      query: ({ body }) => ({
        url: `/details-for-support`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["supportTickets"],
    }),
    sendMessage: builder.mutation({
      query: ({ body }) => ({
        url: `/send-message`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["supportTickets"],
    }),
    getConvertation: builder.mutation({
      query: ({ body }) => ({
        url: `/get-convertation`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["supportTickets"],
    }),
  }),
});

export const {
  useAddTicketMutation,
  useGetOrdersByPartnerMutation,
  usePlanViewByPartnerQuery,
  useGetTicketsMutation,
  useGetTicketDetailMutation,
  useDetailsForSupportMutation,
  useSendMessageMutation,
  useGetConvertationMutation,
} = supportTicketsApi;
export default supportTicketsApi;
