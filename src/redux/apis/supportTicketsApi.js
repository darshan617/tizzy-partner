import { apiSlice } from "../apiSlice";

const supportTicketsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addTicket: builder.mutation({
      query: ({ body }) => ({
        url: "/add-ticket ",
        method: "POST",
        body: body,
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
  }),
});

export const {
  useAddTicketMutation,
  useGetOrdersByPartnerMutation,
  usePlanViewByPartnerQuery,
  useGetTicketsMutation,
} = supportTicketsApi;
export default supportTicketsApi;
