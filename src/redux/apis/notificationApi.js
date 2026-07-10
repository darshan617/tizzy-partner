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

    getNotificationList: builder.mutation({
      query: ({ body }) => {
        return {
          url: `/notification-list`,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["notification"],
    }),

    markNotificationAsRead: builder.mutation({
      query: ({ body }) => {
        return {
          url: `/notification-read`,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["notification"],
    }),

    deleteNotification: builder.mutation({
      query: ({ body }) => {
        return {
          url: `/notification-delete`,
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
  useGetNotificationListMutation,
  useMarkNotificationAsReadMutation,
  useDeleteNotificationMutation,
} = notificationApi;
