import { useEffect, useState, useMemo } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { FiFilter, FiLayers } from "react-icons/fi";
import Link from "next/link";
import styles from "@/components/customers/customers-details/CustomerDetails.module.css";
import Layout from "@/components/layout/Layout";
import {
  useGetSubscriptionDetailsMutation,
  useOrderCancelMutation,
} from "@/redux/apis/subscriptions";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { FaPen } from "react-icons/fa";
import { MdAutorenew } from "react-icons/md";
import Loader from "@/common-components/loader/Loader";
import { BiChevronRight } from "react-icons/bi";
import { Calendar, ExternalLink, Globe, User, Users } from "lucide-react";
import { usePartialUpgradeAddToCartMutation } from "@/redux/apis/addToCartApi";
import { useToast } from "@/custom-hooks/toast/ToastProvider";
import { GiCancel } from "react-icons/gi";
import {
  selectIsPopupVisible,
  setIsPopupVisible,
} from "@/redux/slices/popupSlice";
import { useDispatch, useSelector } from "react-redux";
import CustomPopup from "@/common-components/custom-popup/CustomPopup";
import { IoClose } from "react-icons/io5";

const planProviderIcons = [
  <svg
    key="tizzy"
    xmlns="http://www.w3.org/2000/svg"
    width="400"
    height="400"
    viewBox="0 0 400 400"
    className="icon"
  >
    <path
      fill="#34a853"
      d="M49,59s86.637-1.833,172,99L282,21,350,9V20s-36.234-2.265-53,43L144,391l-14-39,80-172S164.162,106.238,49,69V59Z"
    />
  </svg>,
  <svg
    key="ms"
    xmlns="http://www.w3.org/2000/svg"
    width="100"
    height="100"
    viewBox="0 0 48 48"
    className="icon"
  >
    <path fill="#ff5722" d="M6 6H22V22H6z" transform="rotate(-180 14 14)" />
    <path fill="#4caf50" d="M26 6H42V22H26z" transform="rotate(-180 34 14)" />
    <path fill="#ffc107" d="M26 26H42V42H26z" transform="rotate(-180 34 34)" />
    <path fill="#03a9f4" d="M6 26H22V42H6z" transform="rotate(-180 14 34)" />
  </svg>,
  <svg
    key="google"
    xmlns="http://www.w3.org/2000/svg"
    width="100"
    height="100"
    viewBox="0 0 48 48"
    className="icon"
  >
    <path
      fill="#1976d2"
      d="M38.193,18.359c-0.771-2.753-2.319-5.177-4.397-7.03l-4.598,4.598	c1.677,1.365,2.808,3.374,3.014,5.648v1.508c0.026,0,0.05-0.008,0.076-0.008c2.322,0,4.212,1.89,4.212,4.212S34.61,31.5,32.288,31.5	c-0.026,0-0.05-0.007-0.076-0.008V31.5h-6.666H24V38h8.212v-0.004c0.026,0,0.05,0.004,0.076,0.004C38.195,38,43,33.194,43,27.288	C43,23.563,41.086,20.279,38.193,18.359z"
    />
    <path
      fill="#4caf50"
      d="M15.712,31.5L15.712,31.5c-0.001,0-0.001,0-0.002,0c-0.611,0-1.188-0.137-1.712-0.373l-4.71,4.71	C11.081,37.188,13.301,38,15.71,38c0.001,0,0.001,0,0.002,0v0H24v-6.5H15.712z"
    />
    <path
      fill="#ffc107"
      d="M11.5,27.29c0-2.32,1.89-4.21,4.21-4.21c1.703,0,3.178,1.023,3.841,2.494l4.717-4.717	c-1.961-2.602-5.065-4.277-8.559-4.277C9.81,16.58,5,21.38,5,27.29c0,3.491,1.691,6.59,4.288,8.547l4.71-4.71	C12.53,30.469,11.5,28.999,11.5,27.29z"
    />
  </svg>,
];

const formatPlanStatus = (status) => {
  if (!status) return "-";
  if (status.toLowerCase() === "completed") return "Active";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const getPlanStatusClass = (status) => {
  const normalized = status?.toLowerCase();
  if (normalized === "completed")
    return styles.active;
  if (
    normalized === "expiring" 
  ) {
    return styles.expiring;
  }
  if (normalized === "expired")
    return styles.expired;
  if (normalized === "draft") return styles.draft;
  if (normalized === "upgraded") return styles.upgraded;
  if (normalized === "downgraded") return styles.downgraded;
  if (normalized === "renewed") return styles.renewed;
  if (normalized === "processing") return styles.processing;
  if (normalized === "Upgrade Pending") return styles.UpgradePending;
  if (normalized === "Downgrade Pending") return styles.DowngradePending;
  return "";
};

const getServicePath = (provider_id) => {
  if (provider_id === 1) return "tizzy";
  if (provider_id === 2) return "microsoft-365";
  if (provider_id === 3) return "google-workspace";
  return "google-workspace";
};

const statusLabelMap = {
  completed: "Active",
  active: "Active",
  expiring: "Expiring",
  pending: "Pending",
  expired: "Expired",
  cancelled: "Cancelled",
  draft: "Draft",
  renewed: "Renewed",
  processing: "Processing",
  "upgrade pending": "Upgrade Pending",
  "downgrade pending": "Downgrade Pending",
};

const statusOrder = [
  "completed",
  "expiring",
  "pending",
  "cancelled",
  "draft",
  "renewed",
  "upgrade pending",
  "downgrade pending",
  "processing",
];

const getStatusKey = (status) =>
  (status || "").toString().trim().toLowerCase();

const SubscriptionsDetailsComponent = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const isPopupVisible = useSelector(selectIsPopupVisible);
  const userData = Cookies.get("userData")
    ? JSON.parse(decodeURIComponent(Cookies.get("userData")))
    : {};
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [reason, setReason] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState("all");

  const [orderCancel, { isLoading: isOrderCancelLoading }] =
    useOrderCancelMutation();
  const [getSubscriptionDetails, { isLoading: isSubscriptionDetailsLoading }] =
    useGetSubscriptionDetailsMutation();
  const [
    partialUpgradeAddToCart,
    { isLoading: isPartialUpgradeAddToCartLoading },
  ] = usePartialUpgradeAddToCartMutation();

  const toggleStatus = (statusKey) => {
    setSelectedStatuses((prev) => (prev === statusKey ? "all" : statusKey));
  };

  const fetchSubscriptionDetails = async () => {
    if (!router?.query?.orderId) return;
    try {
      const res = await getSubscriptionDetails({
        body: {
          order_id: router?.query?.orderId,
        },
      });
      if (res?.data?.success) {
        setSubscriptionDetails(res?.data?.data);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handlePartialUpgrade = async (plan) => {
    try {
      const res = await partialUpgradeAddToCart({
        body: {
          partner_id: userData?.id,
          order_id: router?.query?.orderId,
          order_sub_id: plan?.order_sub_id,
          licenses: plan?.licenses,
          customer_id: router?.query?.customerId,
        },
      });

      if (res?.data?.success) {
        router?.push({
          pathname: "/order-summary",
          query: {
            type: "partial-upgrade",
            order_id: router?.query?.orderId,
            order_sub_id: plan?.order_sub_id,
            licenses: plan?.licenses,
            customer_id: router?.query?.customerId,
            main_cart_id: res?.data?.data?.main_cart_id,
          },
        });
      } else {
        showToast(res?.error?.data?.message, "error");
      }
    } catch (error) {
      console.log("partialUpgradeAddToCart Error", error);
      showToast("Something went wrong", "error");
    }
  };

  const handleCancelOrder = async () => {
    try {
      const res = await orderCancel({
        body: {
          order_id: router?.query?.orderId,
          cancel_reason: reason,
          partner_id: userData?.id,
        },
      });
      if (res?.data?.success) {
        showToast(res?.data?.message, "success");
        dispatch(setIsPopupVisible(null));
        router?.push("/subscriptions");
      } else {
        showToast(res?.error?.data?.message, "error");
      }
    } catch (error) {
      console.log("handleCancelOrder Error", error);
      showToast("Something went wrong", "error");
    }
  };

  useEffect(() => {
    if (router?.isReady) {
      fetchSubscriptionDetails();
    }
  }, [router?.isReady, router?.query?.orderId]);

  const customer = subscriptionDetails?.customer;
  const plans = subscriptionDetails?.plans || [];
  const domainName = subscriptionDetails?.domain_name || plans?.[0]?.domain;
  const periodStart =
    subscriptionDetails?.subscription_start_date ||
    plans?.[0]?.subscription_start_date;
  const periodEnd =
    subscriptionDetails?.subscription_end_date ||
    plans?.[0]?.subscription_end_date;

  // Search + status filtering over the current subscription's plans.
  const filteredPlans = useMemo(() => {
    const q = searchQuery?.trim()?.toLowerCase() || "";

    return plans.filter((plan) => {
      const matchesSearch =
        q === "" ||
        plan?.plan_name?.toLowerCase()?.includes(q) ||
        String(plan?.subscription_no || "")
          .toLowerCase()
          .includes(q) ||
        String(plan?.order_sub_id || "")
          .toLowerCase()
          .includes(q) ||
        domainName?.toLowerCase()?.includes(q);

      const statusKey = getStatusKey(plan?.status);
      const matchesStatus =
        selectedStatuses === "all" || selectedStatuses === statusKey;

      return matchesSearch && matchesStatus;
    });
  }, [plans, searchQuery, selectedStatuses, domainName]);

  const resultTotal = filteredPlans?.length || 0;
  const itemPerPage = resultTotal;
  const startIndex = resultTotal > 0 ? 0 : -1;

  if (isSubscriptionDetailsLoading) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  return (
    <>
      <Layout>
        <div className="row flex-column gy-4 py-4">
          <div className="col">
            <div className={`${styles.pageWrap}`}>
              <div className={`${styles.headerRow} row align-items-end`}>
                <div className="col">
                  <nav className={`${styles.breadcrumbs} mb-0`}>
                    <Link href={"/dashboard"}>Dashboard</Link> /{" "}
                    {router?.query?.type === "renewals" ? (
                      <Link href="/renewals">Renewals</Link>
                    ) : (
                      <Link href="/subscriptions">Subscriptions</Link>
                    )}
                    <h1
                      className={`${styles.breadcrumbItem} active fs-4`}
                      aria-current="page"
                    >
                      {router?.query?.type === "renewals"
                        ? "Renewal"
                        : "Subscription"}{" "}
                      - {router?.query?.orderId}
                    </h1>
                  </nav>
                </div>
                <div className="col-auto">
                  <button
                    onClick={() => router?.back()}
                    className="btn small btnWhite"
                  >
                    <IoMdArrowBack />
                    <span>Back</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="col">
            <div className="row align-items-end">
              <div className="col">
                <nav className={`${styles.breadcrumb} mb-0`}>
                  <Link href="/dashboard">Dashboard</Link> /{" "}
                  {router?.query?.type === "renewals" ? (
                    <Link href="/renewals">Renewals</Link>
                  ) : (
                    <Link href="/subscriptions">Subscriptions</Link>
                  )}
                  <span className="breadcrumb-item" />
                  <h1 className="breadcrumb-item active" aria-current="page">
                    {router?.query?.type === "renewals"
                      ? "Renewal"
                      : "Subscription"}{" "}
                    - {router?.query?.orderId}
                  </h1>
                </nav>
              </div>
              <div className="col-auto">
                <button
                  onClick={() => router?.back()}
                  className="btn small btnWhite"
                >
                  <IoMdArrowBack />
                  <span>Back</span>
                </button>
              </div>
            </div>
          </div> */}

          <div className="col">
            <div
              className={`sectionCard py-4 py-sm-4 px-sm-4 px-3`}
              style={{ minHeight: "0px" }}
            >
              <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-lg-between gap-3 gap-lg-4">
                <div className="d-flex align-items-center min-w-0">
                  <div
                    className={`${styles.profAvatar} ${styles.avatarColor_2} flex-shrink-0 text-capitalize`}
                  >
                    {customer?.company_name?.charAt(0) || "?"}
                  </div>
                  <div className={`${styles.profUser} ms-2 min-w-0`}>
                    <p className="mb-2 fw-semibold text-capitalize text-truncate">
                      {customer?.company_name || "-"}
                    </p>
                    <div className="d-flex align-items-center flex-wrap gap-2">
                      {router?.query?.type !== "renewals" && (
                        <div className={styles.idBadge}>
                          <strong className="fs-6">
                            Customer Id :{" "}
                            {customer?.customer_id ||
                              router?.query?.customerId ||
                              "-"}
                          </strong>
                        </div>
                      )}
                      <div className="d-flex align-items-center gap-1 text-muted">
                        <User size={14} strokeWidth={1.75} />
                        <span className="text-capitalize">
                          {customer?.customer_name || "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-column flex-sm-row gap-3 gap-sm-5 ms-lg-auto">
                  <div>
                    <small className="d-block textLight mb-1">Email</small>
                    <Link
                      href={`mailto:${customer?.email || "#"}`}
                      className="text-body text-decoration-none"
                    >
                      {customer?.email || "-"}
                    </Link>
                  </div>
                  <div>
                    <small className="d-block textLight mb-1">
                      Contact No.
                    </small>
                    <Link
                      href={`tel:${customer?.mobile || ""}`}
                      className="text-body text-decoration-none"
                    >
                      {customer?.mobile || "-"}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col">
            <div className={`sectionCard px-sm-4 px-3 py-1`}>
              <div className={styles.filtersMain}>
                <div className="py-3 px-sm-4 px-3 border-bottom">
                  <div className="row align-items-center justify-content-between">
                    <div className="col-sm-auto order-sm-2">
                      <search className={styles.pageSearchBox}>
                        <input
                          type="text"
                          className={`${styles.pageSearch} form-control`}
                          placeholder="Search Plan"
                          value={searchQuery}
                          onChange={(event) =>
                            setSearchQuery(event.target.value)
                          }
                        />
                        <button className={styles.searchBtn} type="button">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={styles.icon}
                          >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                          </svg>
                        </button>
                      </search>
                    </div>
                    <div
                      className={`${styles.searchCount} col-sm-auto order-sm-1 text-center my-2 my-sm-0`}
                    >
                      Showing{" "}
                      <span className="fw-medium darkColor">
                        {startIndex + 1}-{itemPerPage}
                      </span>{" "}
                      from{" "}
                      <span className="fw-medium darkColor">{resultTotal}</span>{" "}
                      {resultTotal === 1 ? "result" : "results"}
                    </div>
                  </div>
                </div>

                <div className={styles.filterWrapper}>
                  <div
                    className={`collapse${filterOpen ? " show" : ""}`}
                    id="transactionFilterSection"
                  >
                    <div className="p-sm-4 p-3">
                      <div className="row g-4 mb-4">
                        <div className="col-auto">
                          <span className={styles.filterHead}>Status :</span>
                          <ul
                            className={`${styles.filterGroup} gap-2`}
                            role="group"
                          >
                            {statusOrder.map((statusKey) => (
                              <li key={statusKey}>
                                <button
                                  className={`${styles.filterItem} rounded-pill`}
                                  onClick={() => toggleStatus(statusKey)}
                                  style={{
                                    backgroundColor:
                                      selectedStatuses === statusKey
                                        ? "var(--primaryColor)"
                                        : "",
                                    color:
                                      selectedStatuses === statusKey
                                        ? "var(--whiteColor)"
                                        : "var(--darkColor)",
                                  }}
                                >
                                  {statusLabelMap[statusKey]}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`${styles.btn} ${styles.small} ${styles.btnDefault} ${styles.filterBtn}`}
                    onClick={() => setFilterOpen((prev) => !prev)}
                    aria-expanded={filterOpen}
                  >
                    {filterOpen ? (
                      <>
                        <IoClose className={`${styles.icon} me-2`} />
                        <span>Close</span>
                      </>
                    ) : (
                      <>
                        <FiFilter className={`${styles.icon} me-2`} />
                        <span>Filters</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className=" py-sm-2 py-3">
                <div className={styles.domainBar}>
                  <div className={styles.domainLeft}>
                    <Globe size={16} />
                    <span className={styles.domainName}>
                      {domainName || ""}
                    </span>
                  </div>
                  <div className={styles.domainBarRight}>
                    {subscriptionDetails?.status?.toLowerCase() !==
                      "cancelled" &&
                      subscriptionDetails?.plans?.[0]?.provider_id !== 3 && (
                        <button
                          type="button"
                          className={styles.cancelOrderBtn}
                          onClick={() =>
                            dispatch(setIsPopupVisible("cancelOrder"))
                          }
                        >
                          Cancel Order <GiCancel size={14} />
                        </button>
                      )}
                    <div className={styles.orderIdWrap}>
                      <span className={styles.orderIdLabel}>Order ID</span>
                      <span className={styles.orderIdBadge}>
                        {subscriptionDetails?.order_no || "-"}
                      </span>
                    </div>
                    {subscriptionDetails?.credit_note_link ? (
                      <Link
                        href={subscriptionDetails?.credit_note_link || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.viewPoLink}
                      >
                        View Credit Note <ExternalLink size={14} />
                      </Link>
                    ) : plans?.[0]?.status?.toLowerCase() === "draft" ? (
                      <button
                        type="button"
                        className={styles.viewPoLink}
                        style={{ cursor: "not-allowed", opacity: 0.6 }}
                        disabled
                      >
                        View PO <ExternalLink size={14} />
                      </button>
                    ) : (
                      <Link
                        href={subscriptionDetails?.po_link || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.viewPoLink}
                      >
                        View PO <ExternalLink size={14} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              <div className="py-3">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div>
                    <h2 className={styles.sectionCardHead}>
                      CURRENT SUBSCRIPTION <span>({filteredPlans?.length || 0})</span>
                    </h2>
                  </div>
                  <div>
                    <Link
                      href={{
                        pathname: "/subscriptions/domain-history",
                        query: {
                          domains: domainName,
                          customerId: router?.query?.customerId,
                        },
                      }}
                      className={`${styles.viewAll} text-decoration-underline`}
                    >
                      View History
                    </Link>
                  </div>
                </div>

                {filteredPlans?.length > 0 ? (
                  filteredPlans?.map((plan) => (
                    <div
                      key={plan?.order_sub_id}
                      className={`${styles.subRow} noHover`}
                    >
                      <div className={`${styles.subTop}`}>
                        <div className={`${styles.subPlan}`}>
                          <p
                            className={`${styles.subPlanIcon} m-0 flex-shrink-0`}
                          >
                            {planProviderIcons?.[plan?.provider_id - 1] || "-"}
                          </p>
                          <div className="ms-2">
                            <div className={`${styles.subPlanName}`}>
                              {plan?.plan_name || "-"}
                            </div>
                            <small className={`${styles.subPlanPrice}`}>
                              ₹ {plan?.subtotal ?? "-"}{" "}
                              {/* <span>Per User / Per Year</span> */}
                            </small>
                            {plan?.hide_upgrade && (
                              <p
                                className=" mb-0"
                                style={{ fontSize: "12px", color: "#ff9800" }}
                              >
                                (Upgrade Initiated)
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="d-flex align-items-center gap-3">
                          <span
                            className={`${styles.statusBadge} 
                        ${getPlanStatusClass(plan?.status)} 
                        ${(plan?.status?.toLowerCase() === "upgrade pending" || plan?.status?.toLowerCase() === "downgrade pending" || plan?.status?.toLowerCase() === "renewal pending") && styles.upgradePending} ${styles.subPlanStatus}`}
                          >
                            {formatPlanStatus(plan?.status)}
                          </span>
                        </div>
                      </div>

                      <div className={`${styles.subBottom}`}>
                        <div className={`${styles.subMeta} ps-1`}>
                          <div className={`${styles.subMetaItem}`}>
                            <FiLayers className={`${styles.subMetaIcon}`} />
                            <div>
                              <div className={`${styles.subMetaValue}`}>
                                #{plan?.subscription_no}
                              </div>
                            </div>
                          </div>
                          <div className={`${styles.subMetaItem}`}>
                            <Calendar className={`${styles.subMetaIcon}`} />
                            <div>
                              {/* <small className={`${styles.infoLabel}`}>
                              Billing Cycle
                            </small> */}
                              <div className={`${styles.subMetaValue}`}>
                                {plan?.subscription_start_date ||
                                  periodStart ||
                                  "-"}{" "}
                                -{" "}
                                {plan?.subscription_end_date ||
                                  periodEnd ||
                                  "-"}
                              </div>
                            </div>
                          </div>

                          {/* <div className={`${styles.subMetaItem}`}>
                            <Globe className={`${styles.subMetaIcon}`} />
                            <div>
                         
                              <div className={`${styles.subMetaValue}`}>
                                {domainName || "-"}
                              </div>
                            </div>
                          </div> */}

                          <div className={`${styles.subMetaItem}`}>
                            <Users className={`${styles.subMetaIcon}`} />
                            <div>
                              {/* <small className={`${styles.infoLabel}`}>
                              Licenses
                            </small> */}
                              <div className={`${styles.subMetaValue}`}>
                                {plan?.licenses ?? "-"} Users
                                {/* <button
                                type="button"
                                className={`${styles.iconBtn} btnWhite btn`}
                                onClick={() =>
                                  router?.push({
                                    pathname: "/order-summary",
                                    query: {
                                      type: "renew-plan",
                                      order_id: subscriptionDetails?.order_id,
                                    },
                                  })
                                }
                              >
                                <FaPen size={10} />
                              </button> */}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* {plan?.status?.toLowerCase() === "expiring" ||
                      plan?.status?.toLowerCase() === "expired" ? ( */}

                        <div className={`${styles.subActions}`}>
                          {(plan?.status?.toLowerCase() === "expiring" ||
                            plan?.status?.toLowerCase() === "expired") && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  router?.push({
                                    pathname: "/order-summary",
                                    query: {
                                      type: "renew-plan",
                                      order_id: subscriptionDetails?.order_id,
                                      order_sub_id: plan?.order_sub_id,
                                      planId: plan?.plan_id,
                                    },
                                  })
                                }
                                className={`${styles.subRenewBtn}`}
                              >
                                <MdAutorenew
                                  className="me-2"
                                  size={14}
                                  style={{ minWidth: "14px" }}
                                />
                                <span>Renew</span>
                              </button>
                            </>
                          )}

                          {plan?.status?.toLowerCase() !== "draft" &&
                          plan?.status?.toLowerCase() !== "pending" &&
                          plan?.status?.toLowerCase() !== "cancelled" &&
                          plan?.status?.toLowerCase() !== "upgrade pending" &&
                          plan?.status?.toLowerCase() !== "upgraded" &&
                          plan?.status?.toLowerCase() !== "downgrade pending" &&
                          plan?.status?.toLowerCase() !== "downgraded" &&
                          plan?.status?.toLowerCase() !== "renewal pending" &&
                          plan?.status?.toLowerCase() !== "cancelled" &&
                          plan?.status?.toLowerCase() !== "processing" &&
                          !plan?.hide_upgrade ? (
                            <>
                              <Link
                                href={{
                                  pathname: `/services/${getServicePath(plan?.provider_id)}`,
                                  query: {
                                    type: "upgrade",
                                    order_id: subscriptionDetails?.order_id,
                                    customer_id:
                                      router?.query?.customerId ||
                                      plan?.customer_id,
                                    plan_id: plan?.plan_id,
                                    order_sub_id: plan?.order_sub_id,
                                  },
                                }}
                                className={styles.subUpgradeTextLink}
                                onClick={() => {
                                  Cookies.remove("customerData");
                                  Cookies.set(
                                    "customerData",
                                    JSON.stringify({
                                      partner_id: userData?.id,
                                      customer_id: router?.query?.customerId,
                                      domain_name: domainName,
                                    }),
                                  );
                                }}
                              >
                                Upgrade
                              </Link>
                              <button
                                onClick={() => handlePartialUpgrade(plan)}
                                className={styles.subUpgradeTextLink}
                              >
                                Partial Upgrade
                              </button>
                            </>
                          ) : (
                            <button
                              style={{
                                width: "fit-content",
                                fontSize: "12px",
                                cursor: "not-allowed",
                                textUnderlineOffset: "3px",
                              }}
                              className="bg-transparent border-0 p-0 text-decoration-underline text-muted"
                            >
                              Upgrade
                            </button>
                          )}

                          {(plan?.status?.toLowerCase() === "expiring" ||
                            plan?.status?.toLowerCase() === "expired") && (
                            <>
                              <Link
                                className={styles.downgradeBtn}
                                href={{
                                  pathname: `/services/${getServicePath(plan?.provider_id)}`,
                                  query: {
                                    type: "downgrade",
                                    order_id: subscriptionDetails?.order_id,
                                    customer_id: router?.query?.customerId,
                                    plan_id: plan?.plan_id,
                                    order_sub_id: plan?.order_sub_id,
                                  },
                                }}
                                onClick={() => {
                                  Cookies.remove("customerData");
                                  Cookies.set(
                                    "customerData",
                                    JSON.stringify({
                                      partner_id: userData?.id,
                                      customer_id: router?.query?.customerId,
                                      domain_name: domainName,
                                    }),
                                  );
                                }}
                              >
                                Downgrade
                              </Link>
                            </>
                          )}
                          <button
                            onClick={() =>
                              router?.push({
                                pathname: "/plan-details",
                                query: {
                                  planId: plan?.plan_id,
                                  orderId: router?.query?.orderId,
                                },
                              })
                            }
                            className="btn small btnWhite p-2"
                            style={{ height: "fit-content" }}
                          >
                            <BiChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center">
                    <p className="text-muted">No plans found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {subscriptionDetails?.status?.toLowerCase() === "draft" && (
          <div className="text-center">
            <button
              className={styles.eSignBtn}
              onClick={() =>
                router?.push({
                  pathname: "/verify-aadhar",
                  query: { ordId: router?.query?.orderId },
                })
              }
            >
              E-Sign
            </button>
          </div>
        )}
      </Layout>
      {isPopupVisible === "cancelOrder" && (
        <CustomPopup onClose={() => dispatch(setIsPopupVisible(null))}>
          <div className="d-flex flex-column">
            {" "}
            <h3>Cancel Order</h3>
            <p>Are you sure you want to cancel this order?</p>
            <textarea
              placeholder="Enter reason for cancellation"
              className="form-control"
              style={{ minHeight: "100px" }}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="d-flex gap-2 mt-3 justify-content-end">
              <button
                className={styles.cancelCancelOrderBtn}
                onClick={() => dispatch(setIsPopupVisible(null))}
              >
                Cancel
              </button>
              <button
                className={styles.confirmCancelOrderBtn}
                onClick={() => handleCancelOrder()}
              >
                Confirm
              </button>
            </div>
          </div>
        </CustomPopup>
      )}
    </>
  );
};

export default SubscriptionsDetailsComponent;