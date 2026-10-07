import { apiSlice } from "../apiSlice";

const searchApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    search: builder.query({
      query: ({ query }) => {
        return {
          url: `/global-search?query=${encodeURIComponent(query)}`,
          method: "GET",
        };
      },
      providesTags: ["search"],
    }),
  }),
});

export const { useSearchQuery } = searchApi;
