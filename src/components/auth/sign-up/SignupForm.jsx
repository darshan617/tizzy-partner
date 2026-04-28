import React, { useState } from "react";
import styles from "@/components/auth/sign-up/SignupForm.module.css";
import {
  useRegisterMutation,
  useSearchGstinMutation,
} from "@/redux/apis/signupApi";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "@/redux/slices/userSlice";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import {
  FaCheckCircle,
  FaEnvelope,
  FaFile,
  FaPhone,
  FaUser,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import signupImage from "@/assets/signup/signupImg.png";
import signupLogo from "@/assets/signup/signupLogo.png";
import AuthLayout from "../authLayout/AuthLayout";

const SignupForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  const [searchGstin, { isLoading: isSearchingGstinLoading }] =
    useSearchGstinMutation();
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    mobile: "",
    gstin: "",
    company_name: "",
    company_address: "",
    terms_and_conditions: false,

    country: "",
    state: "",
    city: "",
    // zip_code: "",

    constitution: "",
    gst_status: "",
    last_updated: "",
    legal_name: "",
    nature_of_business: [],
    pan_no: "",
    pincode: "",
    registration_date: "",
    trade_name: "",
    legal_name: "",
  });

  const [isValidGstIn, setIsValidGstIn] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!userDetails?.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (!userDetails?.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userDetails?.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!userDetails?.mobile?.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(userDetails?.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }

    if (!userDetails?.gstin?.trim()) {
      newErrors.gstin = "GSTIN is required";
    } else if (
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
        userDetails?.gstin?.toUpperCase(),
      )
    ) {
      newErrors.gstin = "Invalid GSTIN format";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, checked } = e?.target;
    if (name === "terms_and_conditions") {
      setUserDetails((prev) => ({
        ...prev,
        terms_and_conditions: checked,
      }));
    } else {
      setUserDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleRegister = async () => {
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});

    try {
      const res = await register({
        body: userDetails,
      });
      if (res?.data?.success) {
        // Cookies.set("userData", JSON.stringify(userDetails));
        dispatch(setUserData(userDetails));
        router?.push("/auth/otp-verification?type=signup");

        setUserDetails({
          name: "",
          email: "",
          mobile: "",
          gstin: "",
          company_name: "",
          company_address: "",
          terms_and_conditions: false,

          country: "",
          state: "",
          city: "",
          zip_code: "",
          pan_no: "",
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const handleSearchGstin = async () => {
    const gstin = userDetails?.gstin?.toUpperCase().trim();

    if (!gstin) {
      setErrors((prev) => ({
        ...prev,
        gstin: "GSTIN is required",
      }));
      return;
    }

    if (
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstin)
    ) {
      setErrors((prev) => ({
        ...prev,
        gstin: "Invalid GSTIN format",
      }));
      return;
    }

    setErrors((prev) => ({
      ...prev,
      gstin: "",
    }));

    try {
      const res = await searchGstin({
        body: { gstin },
      });

      if (res?.data?.success) {
        const data = res?.data?.data;

        setIsValidGstIn(true);

        setUserDetails((prev) => ({
          ...prev,
          company_name: data?.company_name || "",
          company_address: data?.company_address || "",
          city: data?.city || "",
          country: data?.country || "",
          state: data?.state || "",
          pincode: data?.pincode || "",
          pan_no: data?.pan_no || "",
          constitution: data?.constitution || "",
          gst_status: data?.gst_status || "",
          last_updated: data?.last_updated || "",
          nature_of_business: data?.nature_of_business || [],
          registration_date: data?.registration_date || "",
          trade_name: data?.trade_name || "",
          legal_name: data?.legal_name || "",
        }));
      } else {
        setIsValidGstIn(false);

        setErrors((prev) => ({
          ...prev,
          gstin: "GSTIN not found",
        }));
      }
    } catch (error) {
      console.log("error", error);
      setIsValidGstIn(false);

      setErrors((prev) => ({
        ...prev,
        gstin: "Error validating GSTIN",
      }));
    }
  };
  return (
    <>
      <AuthLayout>
        <div
          className={styles.formContent}
          data-aos="fade-up"
          data-aos-duration="900"
        >
          <h1 className={styles.heading}>Ready to become a Partner?</h1>
          <p className={styles.subheading}>
            Join 2000+ partners already scaling with Tizzy.
          </p>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Name<span className={styles.required}>*</span>
            </label>
            <input
              name="name"
              type="text"
              value={userDetails?.name}
              onChange={handleChange}
              className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <span className={styles.errorMessage}>{errors.name}</span>
            )}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Email<span className={styles.required}>*</span>
            </label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email address"
              value={userDetails?.email}
              onChange={handleChange}
              className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
            />
            {errors.email && (
              <span className={styles.errorMessage}>{errors.email}</span>
            )}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Mobile No.<span className={styles.required}>*</span>
            </label>
            <div className={styles.mobileInputWrapper}>
              <select className={styles.countryCode}>
                <option>+91</option>
              </select>
              <input
                name="mobile"
                type="text"
                placeholder="Enter your mobile number"
                value={userDetails?.mobile}
                onChange={handleChange}
                className={`${styles.mobileInput} ${errors.mobile ? styles.inputError : ""}`}
              />
            </div>
            {errors.mobile && (
              <span className={styles.errorMessage}>{errors.mobile}</span>
            )}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              GSTIN<span className={styles.required}>*</span>
            </label>
            <div className={styles.gstinInputWrapper}>
              <input
                name="gstin"
                type="text"
                placeholder="Enter your GSTIN"
                value={userDetails?.gstin}
                onChange={handleChange}
                className={`${styles.gstinInput} ${errors.gstin ? styles.inputError : ""}`}
              />
              <button onClick={handleSearchGstin} className={styles.searchBtn}>
                {isSearchingGstinLoading ? "Searching..." : "Search"}
              </button>
            </div>
            {errors.gstin && (
              <span className={styles.errorMessage}>{errors.gstin}</span>
            )}
          </div>
          {isValidGstIn && (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Company Name<span className={styles.required}>*</span>
                </label>
                <input
                  name="company_name"
                  type="text"
                  placeholder=""
                  value={userDetails?.company_name}
                  onChange={handleChange}
                  className={styles.input}
                  readOnly
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Company Address<span className={styles.required}>*</span>
                </label>
                <input
                  name="company_address"
                  type="text"
                  placeholder=""
                  value={userDetails?.company_address}
                  onChange={handleChange}
                  className={styles.input}
                  readOnly
                />
              </div>
            </>
          )}
          <div className={styles.termsWrapper}>
            <label htmlFor="terms" className={styles.termsLabel}>
              By clicking 'Register' below, you agree to our{" "}
              <Link href="/terms-of-services" className={styles.link}>
                Terms of Services
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className={styles.link}>
                Privacy Policy
              </Link>
            </label>
          </div>
          <button
            onClick={handleRegister}
            className={styles.registerBtn}
            disabled={!isValidGstIn}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
          <p className={styles.signinLink}>
            Already a partner?{" "}
            <Link href="/auth/login" className={styles.link}>
              Sign in
            </Link>
          </p>
        </div>
      </AuthLayout>
    </>
  );
};

export default SignupForm;
