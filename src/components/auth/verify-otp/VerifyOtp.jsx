import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { selectUserData } from "@/redux/slices/userSlice";
import { useGetOtpVerifiedMutation } from "@/redux/apis/signupApi";
import { useRouter } from "next/router";
import { useVerifyOtpMutation } from "@/redux/apis/loginApi";
import styles from "@/components/auth/verify-otp/VerifyOtp.module.css";
const VerifyOtp = () => {
  const router = useRouter();
  const [otpDetails, setOtpDetails] = useState({
    email: "",
    otp: "",
  });

  const userData = useSelector(selectUserData);
  const [getOtpVerified] = useGetOtpVerifiedMutation();
  const [verifyOtp] = useVerifyOtpMutation();

  const handleSubmit = async () => {
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
    if (router?.query?.type === "signup") {
      setOtpDetails((prev) => ({
        ...prev,
        email: userData?.email,
      }));
    } else {
      setOtpDetails((prev) => ({
        ...prev,
        email: userData,
      }));
    }
  }, []);
  return (
    <>
      <div>
        <input
          type="text"
          className={styles.verifyOtpInput}
          value={otpDetails?.otp}
          onChange={(e) =>
            setOtpDetails((prev) => ({
              ...prev,
              otp: e?.target?.value,
            }))
          }
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </>
  );
};

export default VerifyOtp;
