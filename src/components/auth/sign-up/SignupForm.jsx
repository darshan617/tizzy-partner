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
const SignupForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [register] = useRegisterMutation();
  const [searchGstin] = useSearchGstinMutation();
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
  });
  console.log(userDetails);

  const [isValidGstIn, setIsValidGstIn] = useState(false);

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
  };

  const handleRegister = async () => {
    try {
      const res = await register({
        body: userDetails,
      });
      if (res?.data?.success) {
        // Cookies.set("userData", JSON.stringify(userDetails));
        dispatch(setUserData(userDetails));
        router?.push("/auth/otp-verification");
      }
    } catch (error) {
      console.log("error", error);
    }
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
  };
  const handleSearchGstin = async () => {
    try {
      const res = await searchGstin({
        body: {
          gstin: userDetails?.gstin,
        },
      });
      console.log("res", res);

      if (res?.data?.success) {
        const compnayName = res?.data?.data?.company_name;
        const companyAddress = res?.data?.data?.company_address;
        const city = res?.data?.data?.city;
        const country = res?.data?.data?.country;
        const state = res?.data?.data?.state;
        const pincode = res?.data?.data?.pincode;
        const pan_no = res?.data?.data?.pan_no;
        const constitution = res?.data?.data?.constitution;
        const gst_status = res?.data?.data?.gst_status;
        const last_updated = res?.data?.data?.last_updated;
        const nature_of_business = res?.data?.data?.nature_of_business;
        const registration_date = res?.data?.data?.registration_date;
        const trade_name = res?.data?.data?.trade_name;

        setIsValidGstIn(true);
        setUserDetails((prev) => ({
          ...prev,
          company_name: compnayName,
          company_address: companyAddress,
          city: city,
          country: country,
          state: state,
          pincode: pincode,
          pan_no: pan_no,
          constitution: constitution,
          gst_status: gst_status,
          last_updated: last_updated,
          nature_of_business: nature_of_business,
          registration_date: registration_date,
          trade_name: trade_name,
        }));
        // dispatch(setUserData(res?.data?.data));
      } else {
        setIsValidGstIn(false);
      }
    } catch (error) {
      console.log("error", error);
      setIsValidGstIn(false);
    }
  };
  return (
    <>
      <div className="auth-wrapper">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-11 col-xl-10">
              <div className="auth-card d-flex flex-column flex-md-row">
                {/* LEFT */}
                <div className="col-md-6 auth-left" data-aos="fade-right">
                  <h2 className="p-content mb-0">Create Account</h2>
                  <p className="text-muted mb-4">
                    Sign up quickly and start managing your cloud services
                  </p>

                  <div className={styles.signupFormContainer}>
                    <input
                      name="name"
                      type="text"
                      placeholder="Enter your name"
                      value={userDetails?.name}
                      onChange={handleChange}
                    />
                    <input
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={userDetails?.email}
                      onChange={handleChange}
                    />
                    <input
                      name="mobile"
                      type="text"
                      placeholder="Enter your mobile number"
                      value={userDetails?.mobile}
                      onChange={handleChange}
                    />
                    <div>
                      <input
                        name="gstin"
                        type="text"
                        placeholder="Enter your GSTIN"
                        value={userDetails?.gstin}
                        onChange={handleChange}
                      />
                      <button onClick={handleSearchGstin}>Search</button>
                    </div>
                    {isValidGstIn && (
                      <>
                        <input
                          name="company_name"
                          type="text"
                          placeholder="Enter your company name"
                          value={userDetails?.company_name}
                          onChange={handleChange}
                        />
                        <input
                          name="company_address"
                          type="text"
                          placeholder="Enter your company address"
                          value={userDetails?.company_address}
                          onChange={handleChange}
                        />
                      </>
                    )}
                    <input
                      type="checkbox"
                      name="terms_and_conditions"
                      checked={userDetails?.terms_and_conditions}
                      onChange={handleChange}
                    />

                    <button
                      onClick={handleRegister}
                      className={styles.btn}
                      disabled={!isValidGstIn}
                    >
                      Register
                    </button>
                  </div>
                  <div className="text-center mt-3">
                    <p>
                      Already have an account?{" "}
                      <Link href="/user-login">Login</Link>
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="col-md-6 auth-right d-flex align-items-center justify-content-center">
                  <div>
                    <h3>Access your account securely</h3>

                    <ul className="list-unstyled mt-3">
                      <li>
                        <FaCheckCircle /> Manage Cloud Server
                      </li>
                      <li>
                        <FaCheckCircle /> Access Cloud Storage
                      </li>
                      <li>
                        <FaCheckCircle /> 24/7 Support
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupForm;
