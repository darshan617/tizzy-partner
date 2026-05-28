import { apiSlice } from "../apiSlice";

const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateNotificationSettings: builder.mutation({
      query: ({ body }) => {
        return {
          url: `/save-notification-preferences `,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["notification"],
    }),
    getNotificationSettings: builder.mutation({
      query: ({ body }) => {
        return {
          url: `/get-notification-preferences`,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["notification"],
    }),
  }),
});

export const {
  useUpdateNotificationSettingsMutation,
  useGetNotificationSettingsMutation,
} = notificationApi;
