import { apiSlice } from "../apiSlice";

const accountDetailApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAccountDetail: builder.query({
      query: ({body}) => {
        return {
          url: `/account-details`,
          method: "POST",
          body: body,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };
      },
      providesTags: ["accountDetail"],
    }),
  }),
});

export const { useGetAccountDetailQuery } = accountDetailApi;
