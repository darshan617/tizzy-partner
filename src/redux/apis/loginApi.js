import { apiSlice } from "../apiSlice";

const loginApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ body }) => {
        return {
          url: "/user-login-validation",
          method: "POST",
          body: body,
        };
      },
      providesTags: ["login"],
    }),
  }),
});

export const { useLoginMutation } = loginApi;
s;
