import styles from "@/components/plans/plans-detail/PlansDetail.module.css";
import { CiUser } from "react-icons/ci";
import { IoMdArrowBack } from "react-icons/io";
import { LuLayers } from "react-icons/lu";
import { IoMdAdd } from "react-icons/io";
import { MdOutlineAccessTime } from "react-icons/md";
import { usePlanDetailsMutation } from "@/redux/apis/subscriptions";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Loader from "@/common-components/loader/Loader";
import { SIDEBAR_SERVICES_CONSTANTS } from "@/components/layout/sidebar/SidebarConstant";
import Link from "next/link";
import { usePartialUpgradeAddToCartMutation } from "@/redux/apis/addToCartApi";

const normalizeStatus = (status) => String(status ?? "").toLowerCase();

const getStatusBadgeClass = (status) => {
  const normalized = normalizeStatus(status);
  if (normalized === "active" || normalized === "completed") {
    return styles.activeBadge;
  }
  if (
    normalized === "expiring" ||
    normalized === "expiring_soon" ||
    normalized === "processing" ||
    normalized === "upgrade pending" ||
    normalized === "downgrade pending" ||
    normalized === "renewal pending"
  ) {
    return styles.expiringBadge;
  }
  if (normalized === "expired" || normalized === "cancelled") {
    return styles.expiredBadge;
  }
  return styles.activeBadge;
};

export default function PlansDetail() {
  const router = useRouter();
  const [planDetails, setPlanDetails] = useState(null);
  const [getPlanDetails, { isLoading: isGetPlanDetailsLoading }] =
    usePlanDetailsMutation();

  const [
    partialUpgradeAddToCart,
    { isLoading: isPartialUpgradeAddToCartLoading },
  ] = usePartialUpgradeAddToCartMutation();
  const userData = Cookies.get("userData")
    ? JSON.parse(Cookies.get("userData"))
    : {};

  const fetchPlanDetails = async () => {
    if (
      !router?.isReady ||
      !userData?.id ||
      !router?.query?.planId ||
      !router?.query?.orderId
    ) {
      return;
    }
    try {
      const response = await getPlanDetails({
        body: {
          partner_id: userData?.id,
          plan_id: router?.query?.planId,
          order_id: router?.query?.orderId,
        },
      });
      if (response?.data?.success) {
        setPlanDetails(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getServicePath = (provider_id) => {
    if (provider_id === 1) return "tizzy";
    if (provider_id === 2) return "microsoft-365";
    if (provider_id === 3) return "google-workspace";
    return "google-workspace";
  };

  useEffect(() => {
    fetchPlanDetails();
  }, [router?.isReady, router?.query?.planId, router?.query?.orderId]);

  const customer = planDetails?.customer_information || {};
  const subscription = planDetails?.subscription_details || {};
  const plan = Array.isArray(planDetails?.plans) ? planDetails.plans[0] : {};
  const planActions = plan?.actions || {};
  const timeline = Array.isArray(planDetails?.timeline)
    ? planDetails.timeline
    : [];
  const timelineMeta = planDetails?.timeline_meta || {};

  const companyName = customer?.company_name || "-";
  const avatarLetter = companyName?.charAt(0)?.toUpperCase() || "N";
  const subscriptionNo =
    subscription?.subscription_no || plan?.subscription_no || "-";
  const customerId = customer?.customer_id || "-";
  const contactName =
    customer?.primary_contact || customer?.contact_name || "-";
  const status = subscription?.status ?? plan?.status ?? "-";
  const statusKey = normalizeStatus(status);
  const isProcessingOrCancelled =
    statusKey === "processing" ||
    statusKey === "cancelled" ||
    statusKey === "upgrade pending" ||
    statusKey === "downgrade pending" ||
    statusKey === "renewal pending";
  const domainName =
    plan?.domain || plan?.domain_name || planDetails?.domain_name || "-";
  const priceAmount = Number(
    plan?.unit_price || plan?.price_per_license_per_year || 0,
  ).toLocaleString("en-IN");

  if (isGetPlanDetailsLoading && !planDetails) {
    return <Loader />;
  }

  return (
    <div className={styles.page}>
      <div className="container px-0">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <div className={styles.breadcrumb}>
              / Customer Id : {customerId} / Subscription Order Detail -
              {subscriptionNo}
            </div>
            <h5 className={styles.pageTitle}>Plan Detail {subscriptionNo}</h5>
          </div>
          <button
            className={styles.backBtn}
            type="button"
            onClick={() => router.back()}
          >
            <IoMdArrowBack /> Back
          </button>
        </div>

        <div className={`${styles.card} mb-3`}>
          <div className="d-flex flex-wrap justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div className={styles.avatar}>{avatarLetter}</div>
              <div className="ms-3">
                <div className={styles.companyName}>{companyName}</div>
                <div className="d-flex align-items-center gap-2 mt-1">
                  <span className={styles.customerIdBadge}>
                    Customer Id : {customerId}
                  </span>
                  <span className={styles.contactPerson}>
                    <CiUser size={16} /> {contactName}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.infoBlock}>
              <div className={styles.infoLabel}>Email</div>
              <div className={styles.infoValue}>{customer?.email || "-"}</div>
            </div>

            <div className={styles.infoBlock}>
              <div className={styles.infoLabel}>Contact No.</div>
              <div className={styles.infoValue}>
                {customer?.contact_no || "-"}
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.card} mb-3`}>
          <div className={styles.cardHeaderRow}>
            <span className={styles.cardHeaderTitle}>
              <LuLayers /> Subscription Details
            </span>
            <span className={getStatusBadgeClass(status)}>{status}</span>
          </div>

          <div className={styles.divider} />

          <div className={styles.subHeaderRow}>
            <div className="d-flex">
              <div className={styles.subIcon}>
                {
                  SIDEBAR_SERVICES_CONSTANTS.find(
                    (s) => s.id === Number(plan?.provider_id),
                  )?.image
                }
              </div>
              <div className="ms-2">
                <div className={styles.subName}>
                  {plan?.product_name || "-"}
                </div>
                <div className={styles.subPrice}>
                  {plan?.price_label ? (
                    plan.price_label
                  ) : (
                    <>
                      ₹{priceAmount}{" "}
                      <span className={styles.subUnit}>
                        Per User / Per Year
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.provideText}>
              Provider : {plan?.provider || "-"}
            </div>
          </div>

          <div className={styles.detailGrid}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>License</span>
              <div className="d-flex align-items-center gap-2">
                <span className={styles.detailValue}>
                  {plan?.license_label ||
                    (plan?.licenses ? `${plan.licenses} Users` : "-")}
                </span>

                <button
                  className={styles.addBtn}
                  type="button"
                  onClick={() => {
                    router?.push({
                      pathname: "/order-summary",
                      query: {
                        type: "add-license",
                        order_id: router?.query?.orderId,
                        customer_id: customer?.cust_id,
                        order_sub_id: plan?.order_sub_id,
                        licenses: plan?.licenses,
                      },
                    });
                  }}
                  disabled={isProcessingOrCancelled || plan?.hide_upgrade}
                  style={{
                    opacity:
                      isProcessingOrCancelled || plan?.hide_upgrade ? 0.5 : 1,
                    cursor:
                      isProcessingOrCancelled || plan?.hide_upgrade
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  <IoMdAdd size={14} className={styles.addIcon} />
                  Add
                </button>
              </div>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Domain</span>
              <span className={styles.detailValue}>{domainName}</span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Billing Cycle</span>
              <span className={styles.detailValue}>
                {plan?.billing_cycle || "-"}
              </span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Start Date</span>
              <span className={styles.detailValue}>
                {plan?.start_date || "-"}
              </span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Renewal Date</span>
              <span className={styles.renewalValue}>
                {plan?.renewal_date || "-"}
              </span>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-3">
            {plan?.hide_upgrade && (
              <p
                className="mb-0"
                style={{ fontSize: "14px", color: "#ff9800" }}
              >
                (Upgrade Initiated)
              </p>
            )}
            {statusKey !== "processing" &&
              statusKey !== "upgrade pending" &&
              statusKey !== "downgrade pending" &&
              statusKey !== "cancelled" &&
              statusKey !== "renewal pending" &&
              !plan?.hide_upgrade && (
                <>
                  <Link
                    href={{
                      pathname: `/services/${getServicePath(plan?.provider_id)}`,
                      query: {
                        type: "upgrade",
                        order_id: router?.query?.orderId,
                        customer_id: customer?.cust_id,
                        order_sub_id: plan?.order_sub_id,
                        plan_id: router?.query?.planId,
                      },
                    }}
                    className={styles.upgradeBtn}
                    type="button"
                  >
                    Upgrade
                  </Link>
                  <Link
                    href={{
                      pathname: `/services/${getServicePath(plan?.provider_id)}`,
                      query: {
                        type: "partial-upgrade",
                        order_id: router?.query?.orderId,
                        customer_id: customer?.cust_id,
                        order_sub_id: plan?.order_sub_id,
                        plan_id: router?.query?.planId,
                        licenses: plan?.licenses,
                      },
                    }}
                    className={styles.upgradeBtn}
                    type="button"
                  >
                    Partial Upgrade
                  </Link>
                </>
              )}
            {statusKey === "expiring" && (
              <>
                <Link
                  href={{
                    pathname: `/services/${getServicePath(plan?.provider_id)}`,
                    query: {
                      type: "downgrade",
                      order_id: router?.query?.orderId,
                      customer_id: customer?.cust_id,
                      order_sub_id: plan?.order_sub_id,
                      plan_id: router?.query?.planId,
                    },
                  }}
                  className={styles.upgradeBtn}
                  type="button"
                >
                  Downgrade
                </Link>
                <Link
                  href={{
                    pathname: `order-summary`,
                    query: {
                      type: "renew-plan",
                      order_id: router?.query?.orderId,
                      order_sub_id: plan?.order_sub_id,
                      planId: router?.query?.planId,
                    },
                  }}
                  className={styles.renewBtn}
                  type="button"
                >
                  Renew
                </Link>
              </>
            )}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeaderRow}>
            <span className={styles.cardHeaderTitle}>
              <MdOutlineAccessTime /> Timeline
            </span>
            {/* {timelineMeta?.view_all && (
              <a href="#" className={styles.viewAllLink}>
                View All
              </a>
            )} */}
          </div>

          <div className={styles.divider} />

          <div className={styles.activityLabel}>ACTIVITY</div>

          <ul className={styles.timelineList}>
            {timeline.length > 0 ? (
              timeline.map((item, index) => (
                <li
                  key={`${item?.event || item?.title}-${index}`}
                  className={styles.timelineItem}
                >
                  <span
                    className={`${styles.timelineDot} ${styles.timelineDotDone}`}
                  />
                  <div className={styles.timelineContent}>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className={styles.timelineTitle}>
                          {item?.title || "-"}
                        </div>
                        <div className={styles.timelineDesc}>
                          {item?.description || "-"}
                        </div>
                      </div>
                      <span className={styles.timelineTime}>
                        {item?.date || "-"}
                      </span>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className={styles.timelineItem}>
                <div className={styles.timelineDesc}>No activity yet</div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
