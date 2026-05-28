import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "@/components/notifications/NotificationsSetting.module.css";
import {
  useGetNotificationSettingsMutation,
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} from "@/redux/apis/notificationApi";
import Cookies from "js-cookie";
import { useToast } from "@/custom-hooks/toast/ToastProvider";

const preferenceData = [
  {
    title: "SUBSCRIPTIONS & PAYMENTS",
    description:
      "Stay informed about the status, any changes, and expiration of subscriptions. Get billing and payment updates.",
    channels: [
      { name: "SMS", key: "subscription_sms", checked: false },
      { name: "Whatsapp", key: "subscription_whatsapp", checked: false },
      { name: "Email", key: "subscription_email", checked: true },
    ],
  },
  {
    title: "ACCOUNT AND ITS SECURITY",
    description:
      "Get notified about changes, issues, or important updates related to your account.",
    channels: [
      { name: "SMS", key: "security_sms", checked: false },
      { name: "Whatsapp", key: "security_whatsapp", checked: false },
      { name: "Email", key: "security_email", checked: true },
    ],
  },
  {
    title: "SERVICE STATUS & CHANGES ",
    description:
      "Get alerts about the status, downtime, and other important information that affects how your services work.",
    channels: [
      { name: "SMS", key: "service_sms", checked: false },
      { name: "Whatsapp", key: "service_whatsapp", checked: false },
      { name: "Email", key: "service_email", checked: true },
    ],
  },
  {
    title: "PRODUCT UPDATE & SPECIAL OFFERS",
    description:
      "Be the first to discover about new products, updates to existing ones, and get discounts.",
    channels: [
      { name: "SMS", key: "offers_sms", checked: false },
      { name: "Whatsapp", key: "offers_whatsapp", checked: false },
      { name: "Email", key: "offers_email", checked: true },
    ],
  },
];

const NotificationsSettingComponent = () => {
  const { showToast } = useToast();
  const userData = Cookies?.get("userData")
    ? JSON.parse(decodeURIComponent(Cookies?.get("userData")))
    : {};

  const [selectedChannels, setSelectedChannels] = useState({
    subscription_sms: false,
    subscription_whatsapp: false,
    subscription_email: false,
    security_sms: false,
    security_whatsapp: false,
    security_email: false,
    service_sms: false,
    service_whatsapp: false,
    service_email: false,
    offers_sms: false,
    offers_whatsapp: false,
    offers_email: false,
  });

  console.log(selectedChannels, "selectedChannels");
  const [updateNotificationSettings, { isLoading: isSavingSettings }] =
    useUpdateNotificationSettingsMutation();

  const [getNotificationSettings, { isLoading: isGettingSettings }] =
    useGetNotificationSettingsMutation();

  const handleChannelChange = (e, idx) => {
    setSelectedChannels((prev) => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }));
  };

  const handleGetSettings = async () => {
    try {
      const res = await getNotificationSettings({
        body: {
          partner_id: userData?.id,
        },
      });
      console.log(res, "res");
      if (res?.data?.success) {
        console.log(res?.data?.data, "res?.data?.data");
        setSelectedChannels(res?.data?.data);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  useEffect(() => {
    if (userData?.id) {
      handleGetSettings();
    }
  }, [userData?.id]);

  const handleSaveSettings = async () => {
    try {
      const res = await updateNotificationSettings({
        body: {
          partner_id: userData?.id,
          subscription_sms: selectedChannels?.subscription_sms ? 1 : 0,
          subscription_whatsapp: selectedChannels?.subscription_whatsapp
            ? 1
            : 0,
          subscription_email: selectedChannels?.subscription_email ? 1 : 0,
          security_sms: selectedChannels?.security_sms ? 1 : 0,
          security_whatsapp: selectedChannels?.security_whatsapp ? 1 : 0,
          security_email: selectedChannels?.security_email ? 1 : 0,
          service_sms: selectedChannels?.service_sms ? 1 : 0,
          service_whatsapp: selectedChannels?.service_whatsapp ? 1 : 0,
          service_email: selectedChannels?.service_email ? 1 : 0,
          offers_sms: selectedChannels?.offers_sms ? 1 : 0,
          offers_whatsapp: selectedChannels?.offers_whatsapp ? 1 : 0,
          offers_email: selectedChannels?.offers_email ? 1 : 0,
        },
      });
      console.log(res, "res");
      if (res?.data?.success) {
        showToast(
          res?.data?.message || "Notification settings updated successfully",
          "success",
        );
      }
    } catch (error) {
      console.log(error, "error");
      showToast("Failed to update notification settings", "error");
    }
  };

  return (
    <div className={styles.notificationsSettingsWrapper}>
      <p className={styles.policyText}>
        By turning on communication permissions, you agree to let us use your
        phone number and/or email, as outlined in our
        <Link href="/privacy-policy" className={styles.policyLink}>
          Privacy Policy.
        </Link>
      </p>
      {preferenceData.map((item, idx) => {
        return (
          <>
            <div className={styles.preferenceRowWrapper} key={idx}>
              <h4 className={styles.preferenceTitle}>{item?.title}</h4>
              <div className={styles.preferenceRow}>
                <div className={styles.preferenceInfo}>
                  <p>{item?.description}</p>
                </div>
                <div className={styles.channelsWrapper}>
                  {item?.channels?.map((channel, idx) => {
                    return (
                      <label className={styles.channelOption}>
                        <input
                          type="checkbox"
                          checked={selectedChannels[channel?.key]}
                          name={channel?.key}
                          onChange={(e) => handleChannelChange(e, idx)}
                          disabled={isSavingSettings}
                        />
                        <span>{channel?.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
            {idx !== preferenceData?.length - 1 && <hr />}
          </>
        );
      })}
      <div className={styles.saveButtonWrapper}>
        <button
          className={styles.saveButton}
          onClick={handleSaveSettings}
          disabled={isSavingSettings}
        >
          {isSavingSettings ? "Saving Chnages..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default NotificationsSettingComponent;
