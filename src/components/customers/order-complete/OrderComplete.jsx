import React, { useEffect, useRef, useState } from "react";
import styles from "@/components/customers/order-complete/OrderComplete.module.css";
import { useRouter } from "next/router";
import { useGetBalanceAndCartDetailsQuery } from "@/redux/apis/balanceAndCartApi";
import Cookies from "js-cookie";
import { SIDEBAR_SERVICES_CONSTANTS } from "@/components/layout/sidebar/SidebarConstant";
import { useOrderPlaceWithoutAadhaarMutation } from "@/redux/apis/orderDetailsApi";
import { useToast } from "@/custom-hooks/toast/ToastProvider";
import Loader from "@/common-components/loader/Loader";
import {
  Calendar,
  Eye,
  FileText,
  Globe,
  LayoutDashboard,
  Layers,
  Users,
} from "lucide-react";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { MdOutlineFileDownload } from "react-icons/md";
import { IoIosCheckmark } from "react-icons/io";

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
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

const formatEnrollmentType = (orderType) => {
  if (!orderType) return "New Service";
  const normalized = String(orderType).toLowerCase();
  if (normalized === "b2b" || normalized === "new") return "New Service";
  return String(orderType)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const getServiceIcon = (providerId) =>
  SIDEBAR_SERVICES_CONSTANTS.find((s) => s.id === Number(providerId))?.image ||
  "-";

const OrderComplete = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const hasPlacedOrder = useRef(false);
  const [userData, setUserData] = useState({});
  const [orderData, setOrderData] = useState(null);

  const [orderPlaceWithoutAadhaar, { isLoading: isOrderPlaceLoading }] =
    useOrderPlaceWithoutAadhaarMutation();

  useEffect(() => {
    const parsedUser = Cookies?.get("userData")
      ? JSON.parse(decodeURIComponent(Cookies.get("userData")))
      : {};

    const parsedOrder = Cookies.get("orderDetails")
      ? JSON.parse(decodeURIComponent(Cookies.get("orderDetails")))
      : null;

    setUserData(parsedUser);
    if (parsedOrder && !router?.query?.ordId) {
      setOrderData(parsedOrder);
    }
  }, [router?.query?.ordId]);

  const handleOrderPlaceWithoutAadhaar = async () => {
    if (!router?.query?.ordId || !userData?.id) return;
    try {
      const response = await orderPlaceWithoutAadhaar({
        body: {
          order_id: router?.query?.ordId,
        },
      });
      if (response?.data?.success) {
        const data = response?.data?.data || {};
        setOrderData(data);
        Cookies.set("orderDetails", JSON.stringify(data));
        showToast(
          response?.data?.message || "Order placed successfully",
          "success",
        );
      } else {
        showToast(
          response?.error?.data?.message || "Failed to place order",
          "error",
        );
      }
    } catch (error) {
      showToast(error?.data?.message || "Failed to place order", "error");
    }
  };

  useEffect(() => {
    if (
      !router?.isReady ||
      !userData?.id ||
      !router?.query?.ordId ||
      hasPlacedOrder.current
    ) {
      return;
    }
    hasPlacedOrder.current = true;
    handleOrderPlaceWithoutAadhaar();
  }, [userData?.id, router?.query?.ordId, router?.isReady]);

  useGetBalanceAndCartDetailsQuery(
    { partner_id: userData?.id },
    {
      skip: !userData?.id,
    },
  );

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const clearOrderCookieAndNavigate = (path) => {
    Cookies.remove("orderDetails");
    router.push(path);
  };

  const plans = Array.isArray(orderData?.plans)
    ? orderData.plans
    : Array.isArray(orderData?.orders)
      ? orderData.orders
      : [];
  const firstPlan = plans[0] || {};
  const poDetails = orderData?.po_details || {};
  const orderNo = orderData?.order_no || firstPlan?.order_no || "-";
  const poNumber = poDetails?.po_number || orderData?.po_number || "-";
  const poLink =
    poDetails?.final_po_link ||
    poDetails?.po_link ||
    orderData?.final_po_link ||
    orderData?.po_link ||
    router?.query?.po ||
    "";
  const domainName = firstPlan?.domain_name || "-";
  const billingCycle =
    firstPlan?.subscription_start_date && firstPlan?.subscription_end_date
      ? `${formatDate(firstPlan.subscription_start_date)} - ${formatDate(
          firstPlan.subscription_end_date,
        )}`
      : "-";
  const documentMeta = `${poNumber !== "-" ? poNumber : "PO"} - ${formatDate(
    orderData?.order_date,
  )}`;

  if (isOrderPlaceLoading && !orderData) {
    return <Loader />;
  }

  return (
    <div className={styles.pageWrap}>
      <div className={styles.successCard}>
        <div className={styles.successIcon} aria-hidden>
          <IoIosCheckmark size={42} color="#fff" className={styles.checkMark} />
        </div>
        <h1 className={styles.successTitle}>Order Completed Successfully</h1>
        <p className={styles.successSubtitle}>
          Your order is in process. We will update you once it is activated.
        </p>
        <div className={styles.successActions}>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={() => clearOrderCookieAndNavigate("/dashboard")}
          >
            <LayoutDashboard size={16} />
            Go to Dashboard
          </button>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() => clearOrderCookieAndNavigate("/subscriptions")}
          >
            <Eye size={16} />
            View Subscriptions
          </button>
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
                plans.map((item, idx) => (
                  <div
                    key={`${item?.subscription_id || item?.plan_name}-${idx}`}
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
                        {formatCurrency(item?.unit_price ?? item?.plan_amount)}{" "}
                        Per User / Per Year
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
                        {Number(item?.plan_amount || 0).toLocaleString(
                          "en-IN",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className={styles.emptyText}>No subscription plans found.</p>
              )}
            </div>
          </div>
        </div>

        <aside className={styles.rightCol}>
          <div className={styles.card}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Purchase Snapshot</h3>
            </div>
            <div className={styles.sideBody}>
              <div className={styles.kvRow}>
                <span className={styles.kvLabel}>Order ID</span>
                <span className={styles.kvValue}>{orderNo}</span>
              </div>
              <div className={styles.kvRow}>
                <span className={styles.kvLabel}>PO Number</span>
                <span className={styles.kvValue}>{poNumber}</span>
              </div>
              <div className={styles.kvRow}>
                <span className={styles.kvLabel}>Enrollment Type</span>
                <span className={styles.kvValue}>
                  {formatEnrollmentType(orderData?.enrollment_type)}
                </span>
              </div>
              {firstPlan?.remaining_value && (
                <div className={styles.kvRow}>
                  <span className={styles.kvLabel}>Remaining Value</span>
                  <span className={styles.kvValue}>
                    {formatCurrency(firstPlan?.remaining_value || 0)}
                  </span>
                </div>
              )}
              <div className={`${styles.kvRow} ${styles.totalKvRow}`}>
                <span className={styles.kvLabel}>Total Amount</span>
                <span className={styles.totalAmount}>
                  {formatCurrency(
                    orderData?.total_amount ?? router?.query?.crdUsage,
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Generated Documents</h3>
            </div>
            <div className={styles.docBody}>
              {poLink ? (
                <div className={styles.docItem}>
                  <div className={styles.docIcon}>
                    <FileText size={20} color="var(--primaryColor)" />
                  </div>
                  <div className={styles.docInfo}>
                    <p className={styles.docTitle}>Purchase Order</p>
                    <p className={styles.docMeta}>{documentMeta}</p>
                  </div>
                  <a
                    href={poLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.docDownload}
                    aria-label="Download Purchase Order"
                  >
                    <MdOutlineFileDownload size={22} />
                  </a>
                </div>
              ) : (
                <p className={styles.emptyText}>No documents available yet.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default OrderComplete;
