import { useSendOtpMutation } from "@/redux/apis/loginApi";
import { setUserData } from "@/redux/slices/userSlice";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import AuthLayout from "../authLayout/AuthLayout";
import styles from "@/components/auth/login/LoginForm.module.css";
import Link from "next/link";

const LoginForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const [sendOtp, { isLoading }] = useSendOtpMutation();
  const validateForm = () => {
    const newErrors = {};
    if (!email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    try {
      const res = await sendOtp({
        body: { email: email },
      });

      if (res?.data?.success) {
        router?.push("/auth/otp-verification?type=login");
        setEmail("");
        dispatch(setUserData({ email: email }));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <AuthLayout>
      <div
        className={styles.loginWrapper}
        data-aos="fade-up"
        data-aos-duration="900"
      >
        <h2 className={styles.title}>Great to see you here 👋</h2>

        <p className={styles.subtitle}>Sign in to continue.</p>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Email
            <span className={styles.required} style={{ color: "#f6051d" }}>
              *
            </span>
          </label>
          <input
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: "" }));
            }}
            className={styles.input}
            placeholder="Enter your email"
          />
          {errors.email && <p className={styles.errorMsg}>{errors.email}</p>}
        </div>

        <button
          className={styles.otpBtn}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Sending OTP..." : "Get OTP"}
        </button>

        <p className={styles.footerText}>
          Want to be a partner?{" "}
          <Link href="/auth/signup" className={styles.registerBtn}>
            Register Now
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginForm;
