import { apiSlice } from "../apiSlice";

const creditNote = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    creditNotes: builder.mutation({
      query: ({ body }) => {
        return {
          url: "/credit-notes",
          method: "POST",
          body: body,
        };
      },
    }),
    invalidatesTags: ["creditNotes"],
  }),
});

export const { useCreditNotesMutation } = creditNote;
