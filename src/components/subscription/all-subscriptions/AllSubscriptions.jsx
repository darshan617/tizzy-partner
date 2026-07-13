import { useMemo, useState } from "react";
import styles from "@/components/subscription/all-subscriptions/AllSubscriptions.module.css";
import { FiFilter } from "react-icons/fi";
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
                      return (
                        <div
                          key={idx}
                          className={`${styles.contentRow} ${styles.btnDisplay}`}
                        >
                          <div className="row align-items-center">
                            {/* <div className={`${styles.ckbCol} col-auto`}>
                              <input
                                type="checkbox"
                                className="form-check-input"
                              />
                            </div> */}

                            <div className="col">
                              <div className="row align-items-center py-3">
                                <div className="col-md-3 col-12">
                                  <div
                                    className={`${styles.crDomain} d-flex align-items-center`}
                                  >
                                    <div
                                      className={`flex-shrink-0 ${styles.avatarBg} ${
                                        avatarColorClasses[
                                          idx % avatarColorClasses.length
                                        ]
                                      }`}
                                    >
                                      {subscription?.domain
                                        ?.charAt(0)
                                        ?.toUpperCase()}
                                    </div>
                                    <div className={` ps-2`}>
                                      <span
                                        className={`${styles.crDomainName} ps-2`}
                                      >
                                        {subscription?.domain}
                                      </span>
                                      {/* <p className="m-0  ps-2 text-secondary small ">
                                        {" "}
                                        Enrollment Type:{" "}
                                        <span className="text-dark fw-medium">
                                          {" "}
                                          {subscription?.enrollment_type}
                                        </span>
                                      </p> */}
                                      <p className="m-0  ps-2 text-secondary small">
                                        {" "}
                                        Order Id:{" "}
                                        <span className="text-dark fw-medium">
                                          {subscription?.order_no}
                                        </span>
                                      </p>
                                      <p className="m-0  ps-2 text-secondary small">
                                        {" "}
                                        Customer Name:{" "}
                                        <span className="text-dark fw-medium">
                                          {subscription?.customer_name}
                                        </span>
                                      </p>
                                    </div>
                                  </div>

                                  {/* <div className={`${styles.crName} ms-4 ps-2`}>
                                    {subscription?.currentPlan}
                                  </div> */}
                                </div>

                                <div className="col-md-4 col-6 ">
                                  <div className={`${styles.crName} `}>
                                    {subscription?.currentPlan}
                                  </div>
                                  <div className={styles.dueValue}>
                                    {subscription?.due_date || "-"}
                                  </div>
                                </div>

                                <div className="col-md-2 col-6 text-center">
                                  <div className={styles.metaHead}>
                                    Enrollment Type
                                  </div>
                                  <span
                                    style={{ color: "var(--primaryColor)" }}
                                  >
                                    {" "}
                                    {subscription?.enrollment_type}
                                  </span>
                                </div>

                                <div className="col-md-1 col-6 text-center">
                                  <div className={styles.metaHead}>License</div>
                                  <div className={styles.licenseValue}>
                                    <span>{subscription?.licenses}</span>
                                    {/* <button
                                    type="button"
                                    className={styles.editBtn}
                                  >
                                    <LuPencil className={styles.editIcon} />
                                  </button> */}
                                  </div>
                                </div>

                                <div
                                  className={`col-md-2 col-12 ${styles.statusCol}`}
                                >
                                  <div className={styles.statusInner}>
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
                                    {/* {(subscription?.status?.toLowerCase() ===
                                      "expiring" ||
                                      subscription?.status?.toLowerCase() ===
                                        "expired") && (
                                      <button
                                        type="button"
                                        className={styles.renewBtn}
                                        onClick={() =>
                                          router.push({
                                            pathname: "/order-summary",
                                            query: {
                                              type: "renew-plan",
                                              order_id: subscription?.order_id,
                                              renewal_order_id:
                                                subscription?.renewal_order_id,
                                            },
                                          })
                                        }
                                      >
                                        Renew
                                      </button>
                                    )} */}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div
                              className={`col-auto align-self-stretch d-flex align-items-center justify-content-end order-sm-3 mobAction ${styles.arrowCol}`}
                            >
                              <Link
                                className={styles.crBtn}
                                href={{
                                  // pathname: "/customers/customer-details",
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
