import { useSendOtpMutation } from "@/redux/apis/loginApi";
import { setUserData } from "@/redux/slices/userSlice";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthLayout from "../authLayout/AuthLayout";
import styles from "@/components/auth/login/LoginForm.module.css";
import Link from "next/link";
import { useToast } from "@/custom-hooks/toast/ToastProvider";
import {
  selectIsPopupVisible,
  setIsPopupVisible,
} from "@/redux/slices/popupSlice";
import CustomPopup from "@/common-components/custom-popup/CustomPopup";
import { FiSmartphone } from "react-icons/fi";

const LoginForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const isPopupVisible = useSelector(selectIsPopupVisible);
  const [input, setInput] = useState("");
  const [errors, setErrors] = useState({});
  const { showToast } = useToast();
  const [inputType, setInputType] = useState("email");

  const [sendOtp, { isLoading }] = useSendOtpMutation();

  const validateForm = () => {
    const newErrors = {};
    if (!input?.trim()) {
      newErrors.input = "Field is required";
    } else if (
      inputType === "email" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)
    ) {
      newErrors.input = "Please enter a valid email";
    } else if (inputType === "mobile" && !/^\d{10}$/.test(input)) {
      newErrors.input = "Please enter a valid mobile number";
    }

    return newErrors;
  };

  const handleSubmit = async (e, type) => {
    e?.preventDefault();

    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});

    try {
      const res = await sendOtp({
        body: {
          ...(inputType === "mobile"
            ? {
                mobile: input,
                isAlreadyLoggedIn: type === "login" ? true : false,
              }
            : {}),
          ...(inputType === "email"
            ? {
                email: input,
                isAlreadyLoggedIn: type === "login" ? true : false,
              }
            : {}),
        },
      });

      if (res?.data?.isAlreadyLoggedIn) {
        dispatch(setIsPopupVisible("already-login"));
      } else if (res?.data?.success) {
        router?.push({
          pathname: "/auth/otp-verification",
          query: {
            type: "login",
            inputType: inputType,
            inp: input,
          },
        });

        setInput("");

        if (inputType === "mobile") {
          dispatch(setUserData({ mobile: input }));
        } else {
          dispatch(setUserData({ email: input }));
        }
      } else {
        showToast(res?.data?.message, "error");
      }
    } catch (error) {
      console.log(error, "error in handleSubmit");
    }
  };
  return (
    <>
      <AuthLayout>
        <div
          className={styles.loginWrapper}
          data-aos="fade-up"
          data-aos-duration="900"
        >
          <h2 className={styles.title}>Great to see you here 👋</h2>

          <p className={styles.subtitle}>Sign in to continue.</p>

          <form onSubmit={(e) => handleSubmit(e, "nologin")}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Email / Mobile Number
                <span className={styles.required} style={{ color: "#f6051d" }}>
                  *
                </span>
              </label>

              {inputType === "email" ? (
                <>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);

                      setErrors((prev) => ({
                        ...prev,
                        input: "",
                      }));

                      setInputType(
                        /^[0-9].*$/.test(e.target.value) ? "mobile" : "email",
                      );
                    }}
                    className={styles.input}
                    placeholder="Enter your email or mobile number"
                    autoFocus
                  />

                  {errors.input && (
                    <p className={styles.errorMsg}>{errors.input}</p>
                  )}
                </>
              ) : (
                <>
                  <div className={styles.mobileInputWrapper}>
                    <select
                      className={styles.countryCode}
                      aria-label="Country code"
                    >
                      <option value="+91">+91</option>
                    </select>

                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={input}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");

                        setInput(value);

                        setErrors((prev) => ({
                          ...prev,
                          input: "",
                        }));

                        setInputType(
                          /^[0-9].*$/.test(value) ? "mobile" : "email",
                        );
                      }}
                      className={styles.mobileInput}
                      placeholder="Enter your mobile number"
                      autoFocus
                    />
                  </div>

                  {errors.input && (
                    <p className={styles.errorMsg}>{errors.input}</p>
                  )}
                </>
              )}
            </div>

            <button
              type="submit"
              className={styles.otpBtn}
              disabled={isLoading}
            >
              {isLoading ? "Sending OTP..." : "Get OTP"}
            </button>
          </form>

          <p className={styles.footerText}>
            Want to be a partner?{" "}
            <Link href="/auth/signup" className={styles.registerBtn}>
              Register Now
            </Link>
          </p>
        </div>
      </AuthLayout>

      {isPopupVisible === "already-login" && (
        <CustomPopup
          title="Already Logged In"
          maxWidth="400px"
          bodyPadding="20px 21px"
          onClose={() => dispatch(setIsPopupVisible(null))}
        >
          <div className={styles.alreadyLoginPopup}>
            <div className={styles.alreadyLoginMessage}>
              <div className={styles.deviceIcon} aria-hidden="true">
                <FiSmartphone size={21} />
              </div>
              <div>
                <p className={styles.alreadyLoginPrimaryText}>
                  You are already logged in on another device.
                </p>
                <p className={styles.alreadyLoginSecondaryText}>
                  If you continue, you will be automatically logged out from the
                  previous device.
                </p>
              </div>
            </div>

            <div className={styles.alreadyLoginActions}>
              <button
                type="button"
                className={styles.cancelLoginButton}
                onClick={() => dispatch(setIsPopupVisible(null))}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.continueLoginButton}
                onClick={(e) => handleSubmit(e, "login")}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Continue"}
              </button>
            </div>
          </div>
        </CustomPopup>
      )}
    </>
  );
};

export default LoginForm;
