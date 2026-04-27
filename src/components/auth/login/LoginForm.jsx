import { useSendOtpMutation } from "@/redux/apis/loginApi";
import { setUserData } from "@/redux/slices/userSlice";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

const LoginForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [sendOtp] = useSendOtpMutation();
  const handleSubmit = async () => {
    try {
      const res = await sendOtp({
        body: { email: email },
      });

      if (res?.data?.success) {
        router?.push("/auth/otp-verification?type=login");
        setEmail("");
        dispatch(setUserData(email));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <input
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e?.target?.value);
        }}
        placeholder="Enter your email id"
      />
      <button onClick={handleSubmit}>Send Otp</button>
    </>
  );
};

export default LoginForm;
