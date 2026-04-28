import React, { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { selectUserData } from "@/redux/slices/userSlice";
import { useGetOtpVerifiedMutation } from "@/redux/apis/signupApi";
import { useRouter } from "next/router";
import { useVerifyOtpMutation } from "@/redux/apis/loginApi";
import styles from "@/components/auth/verify-otp/VerifyOtp.module.css";

const VerifyOtp = () => {
  const router = useRouter();
  const inputsRef = useRef([]);

  const [otpDetails, setOtpDetails] = useState({
    email: "",
    otp: "",
  });

  const [otpArray, setOtpArray] = useState(["", "", "", "", "", ""]);

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

  // ✅ Handle OTP change
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

    // move forward
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  // ✅ Backspace handling
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpArray[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // ✅ Paste support
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
    <>
      <div>
        {/* ✅ 6 OTP Inputs */}
        <div
          className="d-flex gap-2 justify-content-center"
          onPaste={handlePaste}
        >
          {otpArray.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              inputMode="numeric"
              className={styles.verifyOtpInput}
              value={digit}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        <button onClick={handleSubmit}>Submit</button>
      </div>
    </>
  );
};

export default VerifyOtp;
