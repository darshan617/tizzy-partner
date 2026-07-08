import React, { useEffect, useRef, useState } from "react";
import styles from "@/components/draft-po/DraftPoComponent.module.css";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Link from "next/link";
import { ArrowDownToLine } from "lucide-react";
import { BiCheckCircle } from "react-icons/bi";
import { FaLock } from "react-icons/fa";

const DraftPoComponent = () => {
  const router = useRouter();
  const esignRequired = router?.query?.sr === "true";
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
      <div
        className={styles.draftPoSuccessText}
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <BiCheckCircle /> Draft PO Generated Successfully{" "}
      </div>
      <div className={styles.draftPoIframeContainer}>
        <iframe
          src={`${router?.query?.pl}#toolbar=0`}
          allowFullScreen
          style={{
            pointerEvents: "none",

            filter: esignRequired && "blur(2px)",
            opacity: esignRequired && 0.5,
          }}
        />
        <p className={styles.draftPoLockText}>
          <FaLock size={20} /> <br /> This is a draft purchase order. Complete
          e-sign to view the full document.{" "}
        </p>
        {!esignRequired && (
          <Link
            href={`${router?.query?.pl}`}
            target="_blank"
            className={styles.downloadButton}
          >
            <ArrowDownToLine />
          </Link>
        )}
      </div>
      {esignRequired ? (
        <button
          className={styles.commonButton}
          onClick={() =>
            router.push({
              pathname: "/verify-aadhar",
              query: { ordId: router?.query?.ordId },
            })
          }
        >
          Continue To E-Sign
        </button>
      ) : (
        <button
          className={styles.commonButton}
          onClick={() => router.push("/subscriptions")}
        >
          Done
        </button>
      )}
    </div>
  );
};

export default DraftPoComponent;
