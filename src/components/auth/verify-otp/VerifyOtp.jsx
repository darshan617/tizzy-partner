import React, { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { selectUserData } from "@/redux/slices/userSlice";
import { useGetOtpVerifiedMutation } from "@/redux/apis/signupApi";
import { useRouter } from "next/router";
import { useVerifyOtpMutation } from "@/redux/apis/loginApi";
import styles from "@/components/auth/verify-otp/VerifyOtp.module.css";
import AuthLayout from "../authLayout/AuthLayout";

const VerifyOtp = () => {
  const router = useRouter();
  const inputsRef = useRef([]);

  const [otpDetails, setOtpDetails] = useState({
    email: "",
    otp: "",
  });

  const [otpArray, setOtpArray] = useState(["", "", "", "", "", ""]);

  const userData = useSelector(selectUserData);
  const [getOtpVerified, { isLoading: isGetOtpVerifiedLoading }] =
    useGetOtpVerifiedMutation();
  const [verifyOtp, { isLoading: isVerifyOtpLoading }] = useVerifyOtpMutation();
  const [errors, setErrors] = useState({});
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

      if (res?.data?.success) {
        Cookies.set("userData", JSON.stringify(res?.data?.data?.partner));
        router?.push("/");
        setOtpDetails((prev) => ({
          ...prev,
          email: "",
          otp: "",
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setOtpDetails((prev) => ({
      ...prev,
      email: userData?.email,
    }));
  }, []);

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

  return (
    <AuthLayout>
      <div className={styles.otpWrapper}>
        <h2 className={styles.title}>Verify Your Email</h2>
        <p className={styles.subtitle}>
          We've emailed you a 6-digit verification code.
          <br />
          Please enter it below to confirm your email.
        </p>
        <p className={styles.email}>{otpDetails?.email}</p>
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

        <button className={styles.confirmBtn} onClick={handleSubmit}>
          {isGetOtpVerifiedLoading || isVerifyOtpLoading
            ? "Verifying..."
            : "Confirm"}
        </button>

        <p className={styles.resend}>
          Didn’t receive a code? <span className={styles.link}>Resend</span>
        </p>

        <p className={styles.back}>
          Back to <span className={styles.link}>Forgot Password</span>
        </p>
      </div>
    </AuthLayout>
  );
};

export default VerifyOtp;
