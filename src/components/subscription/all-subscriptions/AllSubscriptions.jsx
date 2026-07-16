import { useMemo, useState } from "react";
import styles from "@/components/subscription/all-subscriptions/AllSubscriptions.module.css";
import { FiFilter, FiGlobe } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { LuPencil } from "react-icons/lu";
import Loader from "@/common-components/loader/Loader";
import { useRouter } from "next/router";
import Link from "next/link";

const avatarColorClasses = [
  "avatarRed",
  "avatarGold",
  "avatarBlue",
  "avatarPurple",
  "avatarTeal",
  "avatarNavy",
];

const statusLabelMap = {
  active: "Active",
  expiring: "Expiring",
  inactive: "Inactive",
  pending: "Pending",
  downgraded: "Downgraded",
  draft: "Draft",
  cancelled: "Cancelled",
  upgraded: "Upgraded",
  renewed: "Renewed",
};

const statusOrder = [
  "active",
  "upgraded",
  "downgraded",
  "renewed",
  "expiring",
  "inactive",
  "pending",
  "draft",
  "cancelled",
];

const AllSubscriptions = ({
  allSubscriptionsData,
  isAllSubscriptionDataLoading,
}) => {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState("all");

  const toggleStatus = (status) => {
    setSelectedStatuses((prev) => (prev === status ? "all" : status));
  };

  const filteredSubscriptions = useMemo(
    () =>
      allSubscriptionsData?.filter((subscription) => {
        const q = searchQuery?.trim()?.toLowerCase();
        const matchesSearch =
          q === "" ||
          subscription?.domain?.toLowerCase()?.includes(q) ||
          subscription?.customer_name?.toLowerCase()?.includes(q) ||
          subscription?.currentPlan?.toLowerCase()?.includes(q) ||
          subscription?.order_no?.toLowerCase()?.includes(q);
        const matchesStatus =
          selectedStatuses === "all"
            ? true
            : selectedStatuses === subscription?.status?.toLowerCase();

        return matchesSearch && matchesStatus;
      }),
    [searchQuery, selectedStatuses, allSubscriptionsData],
  );

  const finalSubscriptionsList = filteredSubscriptions?.filter(
    (subscription) => {
      if (!router?.query?.customerId) return true;

      return (
        subscription?.customer_id === Number(router?.query?.customerId) &&
        subscription?.status.toLowerCase() === "active"
      );
    },
  );

  console.log(finalSubscriptionsList, "finalSubscriptionsList");

  return (
    <div className="col">
      <div className={`sectionCard ${styles.adjustWidth}`}>
        <div className={styles.filtersMain}>
          <div className="py-3 px-sm-4 px-3 border-bottom">
            <div className="row align-items-center justify-content-between">
              <div className="col-sm-auto order-sm-2">
                <search className={styles.pageSearchBox}>
                  <input
                    type="text"
                    className={`${styles.pageSearch} form-control`}
                    placeholder="Search Subscription"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
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
                  1 - {allSubscriptionsData?.length}
                </span>{" "}
                from{" "}
                <span className="fw-medium darkColor">
                  {allSubscriptionsData?.length}
                </span>{" "}
                Subscriptions
              </div>
            </div>
          </div>

          <div className={styles.filterWrapper}>
            <div
              className={`collapse${filterOpen ? " show" : ""}`}
              id="filterSection"
            >
              <div className="p-sm-4 p-3">
                <div className="row g-4 mb-4">
                  <div className={`${styles.filterPart} col-auto`}>
                    <span className={styles.filterHead}>Status :</span>
                    <ul className={`${styles.filterGroup} gap-2`} role="group">
                      {statusOrder.map((status) => (
                        <li key={status}>
                          <button
                            key={status}
                            className={`${styles.filterItem} rounded-pill`}
                            onClick={() => toggleStatus(status)}
                            style={{
                              backgroundColor:
                                selectedStatuses === status
                                  ? "var(--primaryColor)"
                                  : "",
                              color:
                                selectedStatuses === status
                                  ? "var(--whiteColor)"
                                  : "var(--darkColor)",
                            }}
                          >
                            {statusLabelMap[status]}
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

        <div className={styles.listScrollArea}>
          <div className="py-5 px-sm-4 px-3">
            <div
              className={`${styles.subscriptionList} d-flex flex-column gap-3 mb-5`}
            >
              {!isAllSubscriptionDataLoading ? (
                finalSubscriptionsList?.length > 0 ? (
                  finalSubscriptionsList
                    ?.filter((subscription) =>
                      selectedStatuses === "all"
                        ? true
                        : subscription?.status?.toLowerCase() ===
                          selectedStatuses,
                    )
                    ?.map((subscription, idx) => {
                      const companyInitial =
                        subscription?.customer_name?.charAt(0)?.toUpperCase() ||
                        subscription?.domain?.charAt(0)?.toUpperCase() ||
                        "";
                        console.log(subscription);

                      return (
                        <div
                          key={idx}
                          className={`${styles.contentRow} ${styles.btnDisplay}`}
                        >
                          <div className={styles.rowInner}>
                            <div className={styles.txnCol}>
                              <div className={styles.txnDate}>
                                {subscription?.due_date || "-"}
                              </div>
                              <div className={styles.txnId}>
                                {subscription?.order_no || "-"}
                              </div>
                            </div>

                            <div className={styles.companyCol}>
                              <div
                                className={`${styles.avatarBg} ${
                                  avatarColorClasses[
                                    idx % avatarColorClasses.length
                                  ]
                                }`}
                              >
                                {companyInitial}
                              </div>
                              <div className={styles.companyInfo}>
                                <div className={styles.companyName}>
                                  {subscription?.customer_name || "-"}
                                </div>
                                <div className={styles.companyDomain}>
                                  <FiGlobe className={styles.globeIcon} />
                                  <span>{subscription?.domain || "-"}</span>
                                </div>
                              </div>
                            </div>

                            <div className={styles.planCol}>
                              <div className={styles.crName}>
                                <span className={styles.crNameText}>
                                  {subscription?.currentPlan}
                                </span>
                                <span className={styles.plansCount}>
                                  {subscription?.plans_count &&
                                  subscription?.plans_count > 1
                                    ? ` (+${subscription?.plans_count - 1} more)`
                                    : ""}
                                </span>
                              </div>
                              <div className={styles.licenseLine}>
                                <span className={styles.licenseLabel}>
                                  License
                                </span>
                                <span className={styles.licenseValue}>
                                  {subscription?.licenses ?? "-"}
                                </span>
                              </div>
                            </div>

                            <div className={styles.enrollmentCol}>
                              <div className={styles.metaHead}>
                                Enrollment Type
                              </div>
                              <div className={styles.enrollmentValue}>
                                {subscription?.enrollment_type || "-"}
                              </div>
                            </div>

                            <div className={styles.statusCol}>
                              <div className={styles.statusBadgeGroup}>
                                <span
                                  className={`${styles.statusBadge} ${subscription?.status?.toLowerCase() === "active" ? styles.activeBadge : ""} 
                                        ${subscription?.status?.toLowerCase() === "expiring" ? styles.expiringBadge : ""}  
                                        ${subscription?.status?.toLowerCase() === "expired" ? styles.expired : ""} 
                                        ${subscription?.status === "inactive" ? styles.inactiveBadge : ""} 
                                        ${subscription?.status?.toLowerCase() === "pending" ? styles.pendingBadge : ""} 
                                        ${subscription?.status?.toLowerCase() === "draft" ? styles.draftBadge : ""}
                                        ${subscription?.status?.toLowerCase() === "cancelled" ? styles.cancelledBadge : ""}
                                        ${subscription?.status?.toLowerCase() === "upgraded" ? styles.upgradedBadge : ""}
                                        ${subscription?.status?.toLowerCase() === "renewed" ? styles.renewedBadge : ""}
                                        ${subscription?.status?.toLowerCase() === "downgraded" ? styles.downgradedBadge : ""}
                                        ${subscription?.status?.toLowerCase() === "upgrade pending" ? styles.upgradePending : ""}
                                        ${subscription?.status?.toLowerCase() === "downgrade pending" ? styles.downgradePending : ""}
                                        `}
                                >
                                  {subscription?.status}
                                </span>
                                {subscription?.subtext ? (
                                  <div className={styles.statusSubtext}>
                                    {subscription?.subtext}
                                  </div>
                                ) : null}
                              </div>
                            </div>

                            <div className={styles.arrowCol}>
                              <Link
                                className={styles.crBtn}
                                href={{
                                  pathname:
                                    "/subscriptions/subscriptions-details",
                                  query: {
                                    customerId: subscription?.customer_id,
                                    orderId: subscription?.order_id,
                                  },
                                }}
                              >
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
                                  <path d="m9 18 6-6-6-6" />
                                </svg>
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <p className="text-center m-0">No Subscriptions Data</p>
                )
              ) : (
                <Loader />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllSubscriptions;
