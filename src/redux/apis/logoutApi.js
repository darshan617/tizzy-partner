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

// export const logoutOnPageExit = (token) => {
//   const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

//   if (!baseUrl) {
//     return Promise.reject(new Error("Backend URL is not configured"));
//   }

//   return fetch(`${baseUrl.replace(/\/+$/, "")}/logout`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify({}),
//     keepalive: true,
//   }).then((response) => {
//     if (!response.ok) {
//       throw new Error(`Logout request failed with status ${response.status}`);
//     }
//   });
// };
