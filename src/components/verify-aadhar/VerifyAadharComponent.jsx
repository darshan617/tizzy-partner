import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import styles from "@/components/verify-aadhar/VerifyAadharComponent.module.css";
import popupStyles from "@/components/customers/renew-plans/order-summary/OrderSummaryCard.module.css";
import {
  selectIsPopupVisible,
  setIsPopupVisible,
} from "@/redux/slices/popupSlice";
import CustomPopup from "@/common-components/custom-popup/CustomPopup";
import {
  useAadharNumberMutation,
  useOrderAadharVerifyMutation,
} from "@/redux/apis/addToCartApi";
import { useToast } from "@/custom-hooks/toast/ToastProvider";
import aadharImage from "../../../public/images/verify-aadhar/aadharImage.png";

const formatAadharDisplay = (digits) => {
  const groups = digits.match(/.{1,4}/g) || [];
  return groups.map((group) => group.split("").join(" ")).join("  ");
};

const VerifyAadharComponent = () => {
  const [aadharNumber, setAadharNumber] = useState("");
  const [isConcernedAboutAadhar, setIsConcernedAboutAadhar] = useState(false);
  console.log(isConcernedAboutAadhar);

  const dispatch = useDispatch();
  const isPopupVisible = useSelector(selectIsPopupVisible);
  const router = useRouter();
  const { showToast } = useToast();
  const [aadharNumberApi, { isLoading: isAadharNumberLoading }] =
    useAadharNumberMutation();
  const [orderAadharVerifyApi, { isLoading: isOrderAadharVerifyLoading }] =
    useOrderAadharVerifyMutation();

  const userData = Cookies?.get("userData")
    ? JSON.parse(decodeURIComponent(Cookies?.get("userData")))
    : {};

  const handleGetOtp = async () => {
    if (aadharNumber.length !== 12) {
      showToast("Please enter a valid 12-digit Aadhar number", "error");
      return;
    }

    try {
      const res = await aadharNumberApi({
        body: {
          order_id: router?.query?.ordId,
          aadhaar_number: aadharNumber,
        },
      });

      if (res?.data?.success) {
        router.push({
          pathname: "/verify-otp",
          query: {
            type: "order",
            main_cart_id: router?.query?.main_cart_id,
            ordId: router?.query?.ordId,
            renew: router?.query?.renew || 0,
            aadhar_number: aadharNumber,
          },
        });
      } else {
        showToast(res?.error?.data?.message, "error");
      }
    } catch (error) {
      showToast("Failed to verify aadhar number", "error");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>VERIFY YOUR AADHAR</h1>

        <div className={styles.logosBox}>
          <Image
            src={aadharImage}
            alt="State Emblem of India"
            width={500}
            height={500}
            className={styles.logo}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="aadhaarInput" className={styles.label}>
            Enter 12 Digit Aadhar Number
          </label>
          <input
            id="aadhaarInput"
            type="text"
            placeholder="1 2 3 4  4 5 6 7  9 1 0 2"
            maxLength={26}
            inputMode="numeric"
            className={styles.input}
            value={formatAadharDisplay(aadharNumber)}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "").slice(0, 12);
              setAadharNumber(digits);
            }}
          />

          <div className={styles.consentRow}>
            <input
              type="checkbox"
              id="aadhaarConsent"
              checked={isConcernedAboutAadhar}
              onChange={(e) => setIsConcernedAboutAadhar(e.target.checked)}
            />
            <label htmlFor="aadhaarConsent" className={styles.consentLabel}>
              I have read and agree to the{" "}
              <span
                className={styles.consentLink}
                onClick={() =>
                  dispatch(setIsPopupVisible("terms-and-conditions"))
                }
              >
                Aadhaar Verification Consent.
              </span>
            </label>
          </div>
        </div>

        <button
          type="button"
          className={styles.getOtpBtn}
          onClick={handleGetOtp}
          disabled={isOrderAadharVerifyLoading || !isConcernedAboutAadhar}
          style={{
            opacity:
              !isConcernedAboutAadhar || isOrderAadharVerifyLoading ? 0.7 : 1,
            cursor:
              !isConcernedAboutAadhar || isOrderAadharVerifyLoading
                ? "not-allowed"
                : "pointer",
          }}
        >
          {isOrderAadharVerifyLoading ? "Sending..." : "Get OTP"}
        </button>
      </div>

      <p className={styles.copyright}>
        &copy; 2026 Tizzy Group. All rights reserved.
      </p>

      {isPopupVisible === "terms-and-conditions" && (
        <CustomPopup
          onClose={() => dispatch(setIsPopupVisible(""))}
          maxWidth="400px"
        >
          <div className={popupStyles.termsAndConditionsPopup}>
            <h4 className={popupStyles.termsAndConditionsPopupTitle}>
              Aadhaar Verification Consent
            </h4>
            <p className="m-0 mt-3 text-secondary text-start">
              I hereby provide my voluntary consent to verify my identity using
              my Aadhaar number as per applicable regulations. I understand that
              my Aadhaar details will be used solely for identity verification
              purposes and will be handled securely in accordance with
              applicable data protection and privacy requirements.
            </p>
          </div>
        </CustomPopup>
      )}
    </div>
  );
};

export default VerifyAadharComponent;
