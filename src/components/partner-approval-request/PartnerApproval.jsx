import React from "react";
import styles from "@/components/partner-approval-request/PartnerApproval.module.css";
import partnerApproveImage from "@/assets/partner-approval/partnerApproval.svg";
import Image from "next/image";

const PartnerApproval = () => {
  const handleContactSupport = () => {
    window.location.href = "mailto:support@tizzy.com";
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <Image
          src={partnerApproveImage}
          alt="Verification in progress"
          className={styles.image}
        />
        <h1 className={styles.title}>Verification in Progress</h1>
        <p className={styles.description}>
          Thank you for completing your registration. Your account is currently
          under review by our team. Once verified, you&apos;ll receive a
          confirmation email and can start accessing your dashboard.
        </p>
        <button
          type="button"
          className={styles.contactBtn}
          onClick={handleContactSupport}
        >
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default PartnerApproval;
