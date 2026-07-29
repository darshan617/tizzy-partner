import Image from "next/image";
import React, { useEffect, useState } from "react";
import styles from "@/components/customers/order-complete/OrderComplete.module.css";
import { useRouter } from "next/router";
import { useGetBalanceAndCartDetailsQuery } from "@/redux/apis/balanceAndCartApi";
import Cookies from "js-cookie";
import { MdOutlineFileDownload, MdDescription } from "react-icons/md";
import { IoIosCheckmarkCircle } from "react-icons/io";
import successGif from "@/assets/images/check.svg";
import { SIDEBAR_SERVICES_CONSTANTS } from "@/components/layout/sidebar/SidebarConstant";
const OrderComplete = () => {
  const router = useRouter();

  const [userData, setUserData] = useState({});
  const [orderDetails, setOrderDetails] = useState({});
  const [today, setToday] = useState("-");
  const [animationPhase, setAnimationPhase] = useState("playing");
  console.log(orderDetails, "orderDetails");

  useEffect(() => {
    const parsedUser = Cookies?.get("userData")
      ? JSON.parse(decodeURIComponent(Cookies.get("userData")))
      : {};

    const parsedOrder = Cookies.get("orderDetails")
      ? JSON.parse(decodeURIComponent(Cookies.get("orderDetails")))
      : {};

    setUserData(parsedUser);
    setOrderDetails(parsedOrder);
    setToday(
      new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      }),
    );
  }, []);

  useGetBalanceAndCartDetailsQuery(
    { partner_id: userData?.id },
    {
      skip: !userData?.id,
    },
  );

  useEffect(() => {
    const moveTimer = setTimeout(() => setAnimationPhase("done"), 1800);
    return () => clearTimeout(moveTimer);
  }, []);

  const firstItem = orderDetails?.orders?.[0] || {};
  const orderId = firstItem?.order_id;
  const orderNo = firstItem?.order_no;
  const companyName = firstItem?.company_name;
  const domainName = firstItem?.domain_name;
  const poLink = router?.query?.po || firstItem?.po?.po_link;
  const poNumber = firstItem?.po?.po_number;

  const totalAmount = router?.query?.crdUsage;

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <div>
      <div className={`${styles.orderCard}`}>
        <div
          className={`d-flex flex-column align-items-center justify-content-center ${styles.stage}`}
        >
          <div
            className={`mb-3 ${styles.gifWrapper} ${styles[animationPhase]}`}
            data-aos="zoom-in"
            data-aos-duration="1000"
          >
            {animationPhase === "done" ? null : (
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
                  Order Placed Successfully
                </h1>
              </>
            )}
          </div>

          <div
            className={`${styles.contentWrapper} ${
              animationPhase === "done" ? styles.show : ""
            }`}
          >
            <div className={styles.confirmCard} data-aos="fade-up">
              <div className={styles.metaRow}>
                <div className={styles.metaBlock}>
                  <span className={styles.metaLabel}>Date</span>
                  <span className={styles.metaValue}>{today}</span>
                </div>
                <div className={styles.metaBlock}>
                  <span className={styles.metaLabel}>Order Number</span>
                  <span className={styles.metaValue}>{orderNo || "-"}</span>
                </div>
              </div>

              <div className={styles.confirmBody}>
                <div className={styles.poPreview}>
                  {poLink ? (
                    <>
                      <div className={styles.poFrame}>
                        <iframe
                          className={styles.innerFrame}
                          scrolling="no"
                          src={`${poLink}#toolbar=0&navpanes=0&view=FitH`}
                        />
                      </div>
                      <a
                        href={poLink ? poLink : "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.downloadInvoiceBtn}
                      >
                        <MdOutlineFileDownload size={20} />
                      </a>
                    </>
                  ) : (
                    <div className={styles.poPlaceholder}>
                      <MdDescription size={48} />
                      <p>Loading Purchase Order PDF...</p>
                    </div>
                  )}
                </div>

                <div className={styles.orderSummary}>
                  <div className={styles.orderMainHead}>
                    <IoIosCheckmarkCircle
                      size={22}
                      color="var(--primaryColor)"
                    />
                    Order Placed Successfully
                  </div>

                  <div className={styles.greeting}>
                    <strong>Company Name: {companyName || "there"},</strong>
                    <p>
                      Your order has been confirmed
                      {domainName ? (
                        <>
                          {" "}
                          for <strong>{domainName}</strong>
                        </>
                      ) : null}
                      . Your purchase order is ready to download.
                    </p>
                  </div>

                  <div className={styles.itemList}>
                    {orderDetails?.orders?.map((item, idx) => (
                      <div className={styles.itemRow} key={item?.cart_item_id}>
                        <div className={styles.itemIcon}>
                          {
                            SIDEBAR_SERVICES_CONSTANTS.find(
                              (service) =>
                                service?.id === orderDetails?.provider_id,
                            )?.image
                          }
                        </div>
                        <div className={styles.itemInfo}>
                          <span className={styles.itemName}>
                            {item?.plan_name}
                          </span>
                          <span className={styles.itemSub}>
                            {item?.licenses} license
                            {item?.licenses === 1 ? "" : "s"}
                            {" - "}
                            {item?.plan_amount ? `₹ ${item?.plan_amount}` : "-"}
                          </span>
                          {/* <span className={styles.itemSub}>
                            {item?.plan_amount ? `₹ ${item?.plan_amount}` : "-"}
                          </span> */}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.summaryDivider} />

                  {/* <div className={styles.summaryRow}>
                    <span>Order ID</span>
                    <span>{orderId || "-"}</span>
                  </div> */}
                  <div className={styles.summaryRow}>
                    <span>PO Number</span>
                    <span>{poNumber || "-"}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>GST</span>
                    <span>
                      {orderDetails?.gst ? `₹ ${orderDetails?.gst}` : "-"}
                    </span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Coupon Discount</span>
                    <span>
                      {orderDetails?.coupon_discount
                        ? `₹ ${orderDetails?.coupon_discount}`
                        : "-"}
                    </span>
                  </div>
                  <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                    <span>Total Amount</span>
                    <span>
                      {orderDetails?.total_amount
                        ? `₹ ${orderDetails?.total_amount}`
                        : "-"}
                    </span>
                  </div>

                  <div className={styles.doneBtnContainer}>
                    <button
                      onClick={() => {
                        router.push("/subscriptions");
                        Cookies.remove("orderDetails");
                      }}
                      className={styles.doneBtn}
                    >
                      <span>Done</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderComplete;
