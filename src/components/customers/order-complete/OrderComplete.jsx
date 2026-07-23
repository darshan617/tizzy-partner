import Image from "next/image";
import React, { useEffect, useState } from "react";
import bag from "@/assets/images/bag.png";
import invoice from "@/assets/images/invoice.png";
import successGif from "@/assets/images/check.svg";
import styles from "@/components/customers/order-complete/OrderComplete.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { useGetBalanceAndCartDetailsQuery } from "@/redux/apis/balanceAndCartApi";
import Cookies from "js-cookie";
import Loader from "@/common-components/loader/Loader";
import { MdOutlineFileDownload } from "react-icons/md";
import { IoIosCheckmarkCircle } from "react-icons/io";

const OrderComplete = () => {
  const router = useRouter();
  const userData = Cookies?.get("userData")
    ? JSON.parse(decodeURIComponent(Cookies?.get("userData")))
    : {};
  const { data: balanceAndCartData } = useGetBalanceAndCartDetailsQuery(
    { partner_id: userData?.id },
    {
      skip: !userData?.id,
    },
  );
  console.log(router.query.po);

  const [animationPhase, setAnimationPhase] = useState("playing");

  useEffect(() => {
    const moveTimer = setTimeout(() => setAnimationPhase("done"), 1800);
    return () => clearTimeout(moveTimer);
  }, []);

  return (
    <div>
      {/* <div className="col">
        <div className="row align-items-end">
          <div className="col">
            <nav className={`${styles.breadcrumb}`}>
              <button
                onClick={() => router.push("/dashboard")}
                className={styles.breadcrumbItem}
              >
                Dashboard
              </button>{" "}
              /
              <button
                onClick={() => router.push("/customers")}
                className={styles.breadcrumbItem}
              >
                Customers
              </button>
              /
              <button
                onClick={() => router.push("/customers")}
                className={styles.breadcrumbItem}
              >
                Customers 00024
              </button>
              /
              <h1 className="breadcrumb-item active" aria-current="page">
                Renew plan
              </h1>
            </nav>
          </div>
        </div>
      </div> */}
      <div className={`${styles.orderCard}`}>
        <div
          className={`d-flex flex-column align-items-center justify-content-center ${styles.stage}`}
        >
          <div
            className={`mb-3 ${styles.gifWrapper} ${styles[animationPhase]}`}
            data-aos="zoom-in"
            data-aos-duration="1000"
          >
            {animationPhase === "done" ? (
              <IoIosCheckmarkCircle size={60} color="var(--primaryColor)" />
            ) : (
              <>
                <Image
                  src={successGif}
                  alt="success"
                  width={250}
                  height={250}
                  unoptimized
                  className={styles.successGif}
                />
                <h1
                  className="text-center"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  Order Place Successfully
                </h1>
              </>
            )}
          </div>

          <div
            className={`${styles.contentWrapper} ${
              animationPhase === "done" ? styles.show : ""
            }`}
          >
            <div
              className={`${styles.orderMainHead} mb-2`}
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              YOUR ORDER IS PLACED SUCCESSFULL.
            </div>
            {/* <div className={`${styles.orderHead}  mb-3 text-center`}>
              <div>
                <span className={`${styles.value}`}>
                  ₹ {router?.query?.crdUsage}{" "}
                </span>
                <span className={`${styles.valueContent}`}>
                  deducted from your credits
                </span>
              </div>
              <div className={`${styles.BalInfo}`}>
                <span>Credit Balance: </span>
                <span className={`${styles.CreditValue}`}>
                  ₹{balanceAndCartData?.data?.wallet_balance}
                </span>
              </div>
            </div> */}
            {/* <div className={`${styles.InvoiceImg} my-4`}>
              {router?.query?.po ? (
                <Link
                  href={router.query.po}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.downloadInvoiceBtn}
                >
                  Download Purchase Order PDF
                </Link>
              ) : null}
            </div> */}
            <Link
              href={router?.query?.po || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.downloadInvoiceLink}
            >
              <button className={styles.downloadInvoiceBtn}>
                <MdOutlineFileDownload size={20} />
              </button>
              {router?.query?.po ? (
                <div className={styles.orderFrame}>
                  <iframe
                    className={styles.innerFrame}
                    scrolling="no"
                    src={`${router?.query?.po}#toolbar=0&navpanes=0&view=FitH`}
                  />
                </div>
              ) : (
                <div>
                  <Loader />
                  <p>Loading Purchase Order PDF...</p>
                </div>
              )}
            </Link>
            <Link href="/subscriptions" className={styles.doneBtn}>
              Done
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderComplete;
