import Layout from "@/components/layout/Layout";
import NotificationsSettingComponent from "@/components/notifications/NotificationsSettingComponent";

import UserProfileLayout from "@/components/user-profile-layout/UserProfileLayout";
import React from "react";

const NotificationsSettings = () => {
  return (
    <Layout>
      <UserProfileLayout>
        <NotificationsSettingComponent />
      </UserProfileLayout>
    </Layout>
  );
};

export default NotificationsSettings;
