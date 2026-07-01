import React, { useEffect, useRef, useState } from "react";
import styles from "@/components/draft-po/DraftPoComponent.module.css";
import Cookies from "js-cookie";
import { useGenerateNewOrderMutation } from "@/redux/apis/draftPoApi";
import { useRouter } from "next/router";

const DraftPoComponent = () => {
  const router = useRouter();
  const [generateNewOrder, { isLoading: isGeneratingNewOrder }] =
    useGenerateNewOrderMutation();
  const userData = Cookies.get("userData")
    ? JSON.parse(decodeURIComponent(Cookies.get("userData")))
    : {};

  const [draftPoData, setDraftPoData] = useState(null);
  console.log("draftPoData", draftPoData);

  const handleGenerateNewOrder = async () => {
    const res = await generateNewOrder({
      body: {
        partner_id: userData?.id,
        main_cart_id: router?.query?.main_cart_id,
      },
    });
    if (res?.data?.success) {
      setDraftPoData(res?.data?.data);
    } else {
      console.log(res?.error?.data?.message);
    }
  };

  const hasFetched = useRef(false);

  useEffect(() => {
    if (
      !router?.isReady ||
      !router?.query?.main_cart_id ||
      hasFetched.current
    ) {
      return;
    }

    hasFetched.current = true;
    handleGenerateNewOrder();
  }, [router?.isReady, router?.query?.main_cart_id]);
  return (
    <div className={styles.draftPoContainer}>
      <div className={styles.draftPoIframeContainer}>
        <iframe src={`${draftPoData?.po_link}#toolbar=0`} allowFullScreen />
      </div>
    </div>
  );
};

export default DraftPoComponent;
