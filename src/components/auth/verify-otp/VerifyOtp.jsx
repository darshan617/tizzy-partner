import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { selectUserData } from "@/redux/slices/userSlice";
import { useGetOtpVerifiedMutation } from "@/redux/apis/signupApi";
import { useRouter } from "next/router";

const VerifyOtp = () => {
  const router = useRouter();
  const [otpDetails, setOtpDetails] = useState({
    email: "",
    otp: "",
  });

  const userData = useSelector(selectUserData);
  console.log("userData", userData);

  const [getOtpVerified] = useGetOtpVerifiedMutation();

  const handleSubmit = async () => {
    try {
      const res = await getOtpVerified({
        body: otpDetails,
      });

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
  return (
    <>
      <div>
        <input
          type="text"
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
