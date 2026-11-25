import { apiSlice } from "../apiSlice";

const faqApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPartnerFaqs: builder.query({
      query: () => ({
        url: "/faqs?audience=partner",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetPartnerFaqsQuery } = faqApi;
