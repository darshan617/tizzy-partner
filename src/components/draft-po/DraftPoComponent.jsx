import React, { useEffect, useRef, useState } from "react";
import styles from "@/components/draft-po/DraftPoComponent.module.css";
import Cookies from "js-cookie";
import { useGenerateNewOrderMutation } from "@/redux/apis/draftPoApi";
import { useRouter } from "next/router";
import Link from "next/link";
import { ArrowDownToLine } from "lucide-react";

const DraftPoComponent = () => {
  const router = useRouter();
  // const handleGenerateNewOrder = async () => {
  //   const res = await generateNewOrder({
  //     body: {
  //       partner_id: userData?.id,
  //       main_cart_id: router?.query?.main_cart_id,
  //     },
  //   });
  //   if (res?.data?.success) {
  //     setDraftPoData(res?.data?.data);
  //   } else {
  //     console.log(res?.error?.data?.message);
  //   }
  // };

  // const hasFetched = useRef(false);

  // useEffect(() => {
  //   if (
  //     !router?.isReady ||
  //     !router?.query?.main_cart_id ||
  //     hasFetched.current
  //   ) {
  //     return;
  //   }

  //   hasFetched.current = true;
  //   handleGenerateNewOrder();
  // }, [router?.isReady, router?.query?.main_cart_id]);

  return (
    <div className={styles.draftPoContainer}>
      <div className={styles.draftPoIframeContainer}>
        <iframe src={`${router?.query?.pl}#toolbar=0`} allowFullScreen />
        <Link
          href={`${router?.query?.pl}`}
          target="_blank"
          className={styles.downloadButton}
        >
          <ArrowDownToLine />
        </Link>
      </div>
      {router?.query?.sr === "true" ? (
        <button className={styles.commonButton}>Continue To E-Sign</button>
      ) : (
        <button className={styles.commonButton}>Done</button>
      )}
    </div>
  );
};

export default DraftPoComponent;
