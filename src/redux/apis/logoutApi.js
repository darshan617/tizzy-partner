import { apiSlice } from "../apiSlice";

const logoutApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    logout: builder.mutation({
      query: ({ body }) => {
        return {
          url: "/logout",
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["logout"],
    }),
  }),
});

export const { useLogoutMutation } = logoutApi;
