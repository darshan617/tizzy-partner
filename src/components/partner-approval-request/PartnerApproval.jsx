import React, { useEffect, useState } from "react";
import styles from "@/components/partner-approval-request/PartnerApproval.module.css";
import partnerApproveImage from "@/assets/partner-approval/partnerApproval.svg";
import Image from "next/image";
import { BiSupport } from "react-icons/bi";
import Link from "next/link";
import { useGetPartnerApprovalRequestMutation } from "@/redux/apis/partnerApproveRequestApi";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const PartnerApproval = () => {
  const router = useRouter();
  const userDataCookie = Cookies?.get("userData");
  let userData = {};
  try {
    if (userDataCookie && userDataCookie !== "undefined") {
      userData = JSON.parse(decodeURIComponent(userDataCookie));
    }
  } catch (error) {
    console.log("Invalid userData cookie", error);
  }
  const [countdown, setCountdown] = useState(10);
  const [getPartnerApprovalRequest, { isLoading }] =
    useGetPartnerApprovalRequestMutation();
  const handleGetPartnerApprovalRequest = async () => {
    try {
      const res = await getPartnerApprovalRequest({
        body: {
          partner_id: userData?.id,
        },
      });
      if (res?.data?.success) {
        const status = res?.data?.data?.status;
        Cookies.set("partnerApproval", status);
        if (status === "approved") {
          router.replace("/dashboard");
        }
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  useEffect(() => {
    if (!userData?.id) return;
    handleGetPartnerApprovalRequest();
  }, [userData?.id]);

  useEffect(() => {
    const timerRef = setInterval(() => {
      handleGetPartnerApprovalRequest();
    }, 10000);
    return () => clearInterval(timerRef);
  }, [handleGetPartnerApprovalRequest]);

  useEffect(() => {
    const timerRef = setInterval(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      } else {
        handleGetPartnerApprovalRequest();
        setCountdown(10);
      }
    }, 1000);
    return () => clearInterval(timerRef);
  }, [countdown]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <Image
          src={partnerApproveImage}
          alt="Verification in progress"
          className={styles.image}
        />
        <div className={styles.verificationStatus}>
          <h1 className={styles.title}>
            Verification in Progress
            <span className={styles.loadingDots} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </h1>
        </div>
        <p className={styles.description}>
          Thank you for completing your registration. Your account is currently
          under review by our team. Once verified, you&apos;ll receive a
          confirmation email and can start accessing your dashboard.
        </p>
        <div className={styles.refreshStatus}>
          <span className={styles.refreshIcon} aria-hidden="true" />
          <span>
            Checking status in <strong>{countdown}s</strong>
          </span>
        </div>
        <Link href={"#"} className={styles.contactBtn}>
          <BiSupport size={20} className="me-2" /> Contact Support
        </Link>
      </div>
    </div>
  );
};

export default PartnerApproval;
