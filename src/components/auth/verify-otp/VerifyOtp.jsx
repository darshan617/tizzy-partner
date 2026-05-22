import React, { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { selectUserData } from "@/redux/slices/userSlice";
import { useGetOtpVerifiedMutation } from "@/redux/apis/signupApi";
import { useRouter } from "next/router";
import {
  useResendOtpMutation,
  useVerifyOtpMutation,
} from "@/redux/apis/loginApi";
import styles from "@/components/auth/verify-otp/VerifyOtp.module.css";
import AuthLayout from "../authLayout/AuthLayout";
import { useToast } from "@/custom-hooks/toast/ToastProvider";
import Layout from "@/components/layout/Layout";
import { useVerifyAadharNumberOtpMutation } from "@/redux/apis/addToCartApi";

const VerifyOtp = () => {
  const router = useRouter();
  const inputsRef = useRef([]);
  const { showToast } = useToast();
  const [otpDetails, setOtpDetails] = useState({
    email: "",
    otp: "",
  });
  const [otpArray, setOtpArray] = useState(["", "", "", "", "", ""]);
  const userData = useSelector(selectUserData);
  const [verifyOtp, { isLoading: isVerifyOtpLoading }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResendOtpLoading }] = useResendOtpMutation();
  const [errors, setErrors] = useState({});

  const userDataFromCookie = Cookies.get("userData")
    ? JSON.parse(Cookies.get("userData"))
    : {};

  const [getOtpVerified, { isLoading: isGetOtpVerifiedLoading }] =
    useGetOtpVerifiedMutation();

  const [verifyAadharNumberOtp, { isLoading: isVerifyAadharNumberOtpLoading }] =
    useVerifyAadharNumberOtpMutation();

  const validateOtp = () => {
    const newErrors = {};

    if (!otpDetails.otp || otpDetails.otp.length !== 6) {
      newErrors.otp = "Please enter complete 6-digit OTP";
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const formErrors = validateOtp();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});

    try {
      let res;
      if (router?.query?.type === "signup") {
        res = await getOtpVerified({
          body: otpDetails,
        });
      } else {
        res = await verifyOtp({
          body: otpDetails,
        });
      }
      console.log(res, "res");

      if (res?.data?.success) {
        Cookies.set("userData", JSON.stringify(res?.data?.data?.partner));
        showToast("Email verified successfully", "success");
        router?.push("/dashboard");
        setOtpDetails((prev) => ({
          ...prev,
          email: "",
          otp: "",
        }));
      } else {
        showToast(res?.error?.data?.message, "error");
      }
    } catch (error) {
      console.log(error);
      showToast("Failed to verify email", "error");
    }
  };

  // aadhar number otp submit
  const handleSubmitAadharNumberOtp = async () => {
    try {
      const res = await verifyAadharNumberOtp({
        body: {
          otp: otpDetails?.otp,
          main_cart_id: router?.query?.main_cart_id,
          partner_id: userDataFromCookie?.id,
        },
      });
      if (res?.data?.success) {
        showToast(res?.data?.message, "success");
        router?.push({
          pathname: "/order-complete",
          query: {
            po: res?.data?.po_link,
          },
        });
        setOtpArray(["", "", "", "", "", ""]);
      } else {
        showToast(res?.error?.data?.message, "error");
      }
    } catch (error) {
      console.log(error, "error");
      showToast("Failed to verify aadhar number OTP", "error");
    }
  };

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otpArray];
    newOtp[index] = value;
    setOtpArray(newOtp);

    const finalOtp = newOtp.join("");

    setOtpDetails((prev) => ({
      ...prev,
      otp: finalOtp,
    }));
    if (errors.otp) {
      setErrors((prev) => ({ ...prev, otp: "" }));
    }

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpArray[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(paste)) return;

    const newOtp = paste.split("");
    setOtpArray(newOtp);

    setOtpDetails((prev) => ({
      ...prev,
      otp: newOtp.join(""),
    }));

    newOtp.forEach((val, i) => {
      if (inputsRef.current[i]) {
        inputsRef.current[i].value = val;
      }
    });
  };

  const handleResend = async () => {
    try {
      const res = await resendOtp({
        body: { email: otpDetails.email },
      });
      if (res?.data?.success) {
        setOtpArray(["", "", "", "", "", ""]);
        setOtpDetails((prev) => ({
          ...prev,
          otp: "",
        }));
        inputsRef.current[0].focus();
        showToast("OTP resent successfully", "success");
      } else {
        showToast("Failed to resend OTP", "error");
      }
    } catch (error) {
      showToast("Failed to resend OTP", "error");
      console.log("error", error);
    }
  };

  const otpContent = (
    <div
      className={styles.otpWrapper}
      data-aos="fade-up"
      data-aos-duration="900"
    >
      {router?.query?.type === "order" ? (
        <h2 className={styles.title}>Verify Your Aadhar</h2>
      ) : (
        <h2 className={styles.title}>Verify Your Email</h2>
      )}

      {router?.query?.type === "order" ? (
        <p className={styles.subtitle}>
          Please enter the 6-digit code, we have sent on your
          <br />
          registered mobile number for verification.
        </p>
      ) : (
        <p className={styles.subtitle}>
          We've emailed you a 6-digit verification code.
          <br />
          Please enter it below to confirm your email.
        </p>
      )}
      {!router?.query?.type === "order" && (
        <p className={styles.email}>{otpDetails?.email}</p>
      )}

      <p className={styles.label}>
        Enter your 6-digit code <span>*</span>
      </p>
      <div className={styles.otpContainer} onPaste={handlePaste}>
        {otpArray.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            inputMode="numeric"
            className={styles.otpInput}
            value={digit}
            ref={(el) => (inputsRef.current[index] = el)}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          />
        ))}
      </div>
      {errors.otp && <p className={styles.errorMessage}>{errors.otp}</p>}

      <button
        className={styles.confirmBtn}
        onClick={
          router?.query?.type === "order"
            ? handleSubmitAadharNumberOtp
            : handleSubmit
        }
        disabled={
          isGetOtpVerifiedLoading ||
          isVerifyOtpLoading ||
          isVerifyAadharNumberOtpLoading
        }
      >
        {isGetOtpVerifiedLoading ||
        isVerifyOtpLoading ||
        isVerifyAadharNumberOtpLoading
          ? "Verifying..."
          : "Confirm"}
      </button>

      <p className={styles.resend}>
        Didn’t receive a code?{" "}
        <button
          className={styles.resendBtn}
          onClick={handleResend}
          disabled={isResendOtpLoading}
        >
          {isResendOtpLoading ? "Resending..." : "Resend"}
        </button>
      </p>

      {/* <p className={styles.back}>
          Back to <span className={styles.link}>Forgot Password</span>
        </p> */}
    </div>
  );

  useEffect(() => {
    setOtpDetails((prev) => ({
      ...prev,
      email: userData?.email,
    }));
  }, []);

  return router?.query?.type === "order" ? (
    <Layout>{otpContent}</Layout>
  ) : (
    <>
      <AuthLayout>{otpContent}</AuthLayout>
    </>
  );
};

export default VerifyOtp;
