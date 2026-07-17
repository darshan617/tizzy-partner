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
  }),
});

export const {
  useAddTicketMutation,
  useGetOrdersByPartnerMutation,
  usePlanViewByPartnerQuery,
} = supportTicketsApi;
export default supportTicketsApi;
