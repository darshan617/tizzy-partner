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
  }),
});

export const { useAddTicketMutation } = supportTicketsApi;
export default supportTicketsApi;
