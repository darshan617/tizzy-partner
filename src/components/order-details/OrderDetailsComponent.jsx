import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  ArrowUpRight,
  Box,
  Calendar,
  Globe,
  Layers,
  Users,
  Wallet,
} from "lucide-react";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { IoMdArrowBack } from "react-icons/io";
import { SIDEBAR_SERVICES_CONSTANTS } from "@/components/layout/sidebar/SidebarConstant";
import styles from "@/components/order-details/OrderDetailsComponent.module.css";
import { useOrderDetailsMutation } from "@/redux/apis/orderDetailsApi";
import Loader from "@/common-components/loader/Loader";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsPopupVisible,
  setIsPopupVisible,
} from "@/redux/slices/popupSlice";
import CustomPopup from "@/common-components/custom-popup/CustomPopup";

const formatCurrency = (value) =>
  `₹ ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatOrderType = (value) => {
  if (!value) return "-";
  return String(value).toUpperCase();
};

const getServiceIcon = (providerId) =>
  SIDEBAR_SERVICES_CONSTANTS.find((s) => s.id === Number(providerId))?.image ||
  SIDEBAR_SERVICES_CONSTANTS.find((s) => s.id === 1)?.image;

const OrderDetailsComponent = () => {
  const router = useRouter();
  const hasFetched = useRef(false);
  const dispatch = useDispatch();
  const isPopupVisible = useSelector(selectIsPopupVisible);
  const [orderData, setOrderData] = useState(null);
  const [isPurchaseConfirmed, setIsPurchaseConfirmed] = useState(false);
  console.log("orderData", orderData);

  const userData = Cookies.get("userData")
    ? JSON.parse(Cookies.get("userData"))
    : null;

  const [orderDetails, { isLoading }] = useOrderDetailsMutation();

  const handleGetOrderDetails = async () => {
    if (!router?.query?.ordId || !userData?.id || !router?.isReady) return;
    try {
      const response = await orderDetails({
        body: {
          partner_id: userData?.id,
          order_id: router?.query?.ordId,
        },
      });
      if (response?.data?.success) {
        setOrderData(response?.data?.data || null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (
      !router?.isReady ||
      !router?.query?.ordId ||
      !userData?.id ||
      hasFetched.current
    ) {
      return;
    }
    hasFetched.current = true;
    handleGetOrderDetails();
  }, [router?.query?.ordId, userData?.id, router?.isReady]);

  const customer = orderData?.customer || {};
  const plans = Array.isArray(orderData?.plans) ? orderData.plans : [];
  const firstPlan = plans[0] || {};
  const poDetails = orderData?.po_details || {};

  const displayName = customer?.company_name || customer?.name || "-";
  const avatarLetter = displayName?.charAt(0)?.toUpperCase() || "N";
  const billingCycle =
    firstPlan?.subscription_start_date && firstPlan?.subscription_end_date
      ? `${formatDate(firstPlan.subscription_start_date)} - ${formatDate(
          firstPlan.subscription_end_date,
        )}`
      : "-";
  const domainName = firstPlan?.domain_name || "-";
  const orderNo = orderData?.order_no || "-";
  const poLink = poDetails?.final_po_link || orderData?.final_po_link || "";

  const breadcrumbItems = [
    { label: "Order Summary", href: "/order-summary" },
    { label: "Draft Po", back: true },
  ];

  if (isLoading && !orderData) {
    return <Loader />;
  }

  return (
    <>
      <div className={styles.pageWrap}>
        <div className={styles.headerRow}>
          <div>
            <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
              {breadcrumbItems.map((item, index) => (
                <React.Fragment key={`${item.label}-${index}`}>
                  {index > 0 && " / "}
                  {item.href ? (
                    <Link href={item.href}>{item.label}</Link>
                  ) : item.back ? (
                    <button
                      type="button"
                      className={styles.routerbackBtn}
                      onClick={() => router.back()}
                    >
                      <span>{item.label}</span>
                    </button>
                  ) : (
                    <span>{item.label}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
            <h1 className={styles.pageTitle}>Order Review</h1>
          </div>
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => router.back()}
          >
            <IoMdArrowBack size={16} />
            <span>Back</span>
          </button>
        </div>

        <div className={`${styles.card} ${styles.customerCard}`}>
          <div className={styles.customerInner}>
            <div className={styles.custIdentity}>
              <span className={styles.custAvatar} aria-hidden>
                {avatarLetter}
              </span>
              <div className={styles.custMeta}>
                <h2 className={styles.custName}>{displayName}</h2>
                <span className={styles.custIdBadge}>
                  Customer Id : {customer?.customer_no || "-"}
                </span>
              </div>
            </div>
            <div className={styles.custFields}>
              <div>
                <span className={styles.infoLabel}>Email</span>
                <p className={styles.infoValue}>{customer?.email || "-"}</p>
              </div>
              <div>
                <span className={styles.infoLabel}>Contact No.</span>
                <p className={styles.infoValue}>{customer?.mobile || "-"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.split}>
          <div className={styles.leftCol}>
            <div className={styles.card}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>
                  <Layers size={18} />
                  Subscription Details
                </h3>
                <span className={styles.billingBadge}>
                  <Calendar size={13} />
                  Billing Cycle: {billingCycle}
                </span>
              </div>

              <div className={styles.domainBar}>
                <div className={styles.domainLeft}>
                  <Globe size={16} />
                  <span className={styles.domainName}>{domainName}</span>
                </div>
                <div className={styles.orderIdWrap}>
                  <span className={styles.orderIdLabel}>Order ID</span>
                  <span className={styles.orderIdBadge}>{orderNo}</span>
                </div>
              </div>

              <div className={styles.subItems}>
                {plans.length > 0 ? (
                  plans.map((item) => (
                    <div
                      key={`${item?.plan_id}-${item?.subscription_id}`}
                      className={styles.subItem}
                    >
                      <div className={styles.planIcon}>
                        {getServiceIcon(
                          item?.provider_id || orderData?.provider_id,
                        )}
                      </div>
                      <div className={styles.planInfo}>
                        <p className={styles.planName}>
                          {item?.plan_name || "-"}
                        </p>
                        <p className={styles.planPrice}>
                          {formatCurrency(item?.unit_price)} Per User / Per Year
                        </p>
                      </div>
                      <div className={styles.planMeta}>
                        <span className={styles.metaItem}>
                          <Layers size={14} color="var(--primaryColor)" />
                          {item?.subscription_id || "-"}
                        </span>
                        <span className={styles.metaItem}>
                          <Users size={14} color="var(--primaryColor)" />
                          {item?.licenses ?? 0} Users
                        </span>
                        <span className={styles.metaItem}>
                          <FaIndianRupeeSign
                            size={12}
                            color="var(--primaryColor)"
                          />
                          {formatCurrency(item?.plan_amount)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className={styles.infoValue}>
                    No subscription plans found.
                  </p>
                )}
              </div>

              <div className={styles.subtotalRow}>
                <span>Subtotal ({plans.length})</span>
                <span className={styles.subtotalAmount}>
                  {formatCurrency(orderData?.subtotal)}
                </span>
              </div>
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={() => dispatch(setIsPopupVisible("proceed_checkout"))}
              >
                Proceed Checkout
              </button>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => router.push("/order-summary")}
              >
                Edit Order
              </button>
            </div>
          </div>

          <aside className={styles.rightCol}>
            <div className={styles.card}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>
                  <Box size={18} />
                  Order Summary
                </h3>
                {poLink ? (
                  <a
                    href={poLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.poLink}
                  >
                    PO
                    <ArrowUpRight size={14} />
                  </a>
                ) : (
                  <span className={styles.poLink}>
                    PO
                    <ArrowUpRight size={14} />
                  </span>
                )}
              </div>
              <div className={styles.sideBody}>
                <div className={styles.kvRow}>
                  <span className={styles.kvLabel}>Order ID</span>
                  <span className={styles.kvValue}>{orderNo}</span>
                </div>
                <div className={styles.kvRow}>
                  <span className={styles.kvLabel}>PO Number</span>
                  <span className={styles.kvValue}>
                    {poDetails?.po_number || "-"}
                  </span>
                </div>
                <div className={styles.kvRow}>
                  <span className={styles.kvLabel}>Order Date</span>
                  <span className={styles.kvValue}>
                    {formatDate(orderData?.order_date)}
                  </span>
                </div>
                <div className={styles.kvRow}>
                  <span className={styles.kvLabel}>Enrollment Type</span>
                  <span className={styles.kvValue}>
                    {formatOrderType(orderData?.order_type)}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>
                  <Wallet size={18} />
                  Payment &amp; Billing
                </h3>
              </div>
              <div className={styles.sideBody}>
                <div className={styles.kvRow}>
                  <span className={styles.kvLabel}>Subtotal</span>
                  <span className={styles.kvValue}>
                    {formatCurrency(orderData?.subtotal)}
                  </span>
                </div>
                <div className={styles.kvRow}>
                  <span className={styles.kvLabel}>
                    Tax {orderData?.gst ?? 0}% (GST)
                  </span>
                  <span className={styles.kvValue}>
                    {formatCurrency(orderData?.gst_amount)}
                  </span>
                </div>
                <div className={styles.kvRow}>
                  <span className={styles.kvLabel}>Discount</span>
                  <span className={styles.kvValue}>
                    {formatCurrency(orderData?.discount_amount)}
                  </span>
                </div>
                {Number(firstPlan?.remaining_value) > 0 &&
                  firstPlan?.remaining_value !== undefined && (
                    <div className={styles.kvRow}>
                      <span className={styles.kvLabel}>Remaining Value</span>
                      <span className={styles.kvValue}>
                        {formatCurrency(firstPlan?.remaining_value)}
                      </span>
                    </div>
                  )}
                <div className={styles.divider} />
                <div className={styles.totalRow}>
                  <span>Total Amount</span>
                  <span className={styles.totalAmount}>
                    {formatCurrency(orderData?.total_amount)}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      {isPopupVisible === "proceed_checkout" && (
        <CustomPopup
          maxWidth="420px"
          onClose={() => {
            setIsPurchaseConfirmed(false);
            dispatch(setIsPopupVisible(""));
          }}
        >
          <div className={styles.confirmPopup}>
            <div className={styles.confirmHeader}>
              <h3 className={styles.confirmTitle}>Confirm Your Purchase</h3>
              <p className={styles.confirmSubtitle}>
                Purchase Order cannot be edited after confirmation.
              </p>
            </div>

            <label className={styles.confirmCheckRow}>
              <input
                type="checkbox"
                className={styles.confirmCheckbox}
                checked={isPurchaseConfirmed}
                onChange={(e) => setIsPurchaseConfirmed(e.target.checked)}
              />
              <span className={styles.confirmCheckLabel}>
                I have reviewed the order details and confirm that all
                information is accurate.
              </span>
            </label>

            <div className={styles.confirmFooter}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => {
                  setIsPurchaseConfirmed(false);
                  dispatch(setIsPopupVisible(""));
                }}
              >
                Back to Review
              </button>
              <button
                type="button"
                className={styles.btnPrimary}
                disabled={!isPurchaseConfirmed}
                onClick={() => {
                  if (!isPurchaseConfirmed) return;
                  setIsPurchaseConfirmed(false);
                  dispatch(setIsPopupVisible(""));
                  router.push({
                    pathname: "/order-complete",
                    query: {
                      ordId: router?.query?.ordId,
                    },
                  });
                }}
              >
                Confirm Purchase
              </button>
            </div>
          </div>
        </CustomPopup>
      )}
    </>
  );
};

export default OrderDetailsComponent;
