import Image from "next/image";
import React from "react";
import bag from "@/assets/images/bag.png";
import invoice from "@/assets/images/invoice.png";
import styles from "@/components/customers/order-complete/OrderComplete.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { useGetBalanceAndCartDetailsQuery } from "@/redux/apis/balanceAndCartApi";
import Cookies from "js-cookie";
import Loader from "@/common-components/loader/Loader";
import { MdOutlineFileDownload } from "react-icons/md";

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
        <div className="d-flex flex-column align-items-center justify-content-center">
          <div className="mb-3">
            <Image
              src={bag}
              alt="bag"
              width={50}
              height={50}
              className="img-fluid"
            />
          </div>
          <div className={`${styles.orderMainHead} mb-2`}>
            YOUR ORDER PURCHASE IS SUCCESSFUL.
          </div>
          <div className={`${styles.orderHead}  mb-3 text-center`}>
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
          </div>
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
            style={{ display: "block" }}
            className={styles.downloadInvoiceLink}
          >
            <button className={styles.downloadInvoiceBtn}>
              <MdOutlineFileDownload size={20} />
            </button>
            {router?.query?.po ? (
              <div
                style={{
                  width: "100%",
                  height: "423px",
                  overflowY: "auto",
                }}
              >
                <iframe
                  src={`${router?.query?.po}#toolbar=0`}
                  width="100%"
                  height="100%"
                  maxHeight="1000px"
                  frameBorder="0"
                  style={{ pointerEvents: "none" }}
                />
              </div>
            ) : (
              <div>
                <Loader />
                <p>Loading Purchase Order PDF...</p>
              </div>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderComplete;
