import { useMemo, useState } from "react";
import styles from "@/components/subscription/all-subscriptions/AllSubscriptions.module.css";
import { FiFilter } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { LuPencil } from "react-icons/lu";
import Loader from "@/components/common-components/loader/Loader";

const statusLabelMap = {
  active: "Active",
  expiring: "Expiring",
  inactive: "Inactive",
};

const statusOrder = ["active", "expiring", "inactive"];

const AllSubscriptions = ({
  allSubscriptionsData,
  isAllSubscriptionDataLoading,
}) => {
  console.log(allSubscriptionsData);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const toggleStatus = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((item) => item !== status)
        : [...prev, status],
    );
  };

  const filteredSubscriptions = useMemo(
    () =>
      []?.filter((subscription) => {
        const q = searchQuery.trim().toLowerCase();
        const matchesSearch =
          q === "" ||
          subscription.domain.toLowerCase().includes(q) ||
          subscription.plan.toLowerCase().includes(q);
        const matchesStatus =
          selectedStatuses.length === 0 ||
          selectedStatuses.includes(subscription.status);

        return matchesSearch && matchesStatus;
      }),
    [searchQuery, selectedStatuses],
  );

  return (
    <div className="col">
      <div className={`${styles.sectionCard} ${styles.adjustWidth}`}>
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
                Showing <span className="fw-medium darkColor">1 - 10</span> from{" "}
                <span className="fw-medium darkColor">12400</span> Subscriptions
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
                          <input
                            type="checkbox"
                            className="btn-check"
                            id={`status_${status}`}
                            autoComplete="off"
                            checked={selectedStatuses.includes(status)}
                            onChange={() => toggleStatus(status)}
                          />
                          <label
                            className={`${styles.filterItem} rounded-pill`}
                            htmlFor={`status_${status}`}
                          >
                            {statusLabelMap[status]}
                          </label>
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
                allSubscriptionsData?.length > 0 ? (
                  allSubscriptionsData?.map((subscription, idx) => {
                    const customer = subscription?.customer;
                    const order_details = subscription?.order_details;
                    const partner = subscription?.partner;
                    const plan = subscription?.plan;

                    return (
                      <div
                        key={idx}
                        className={`${styles.contentRow} ${styles.btnDisplay}`}
                      >
                        <div className="row align-items-center">
                          <div className={`${styles.ckbCol} col-auto`}>
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                          </div>

                          <div className="col">
                            <div className="row align-items-center py-3">
                              <div className="col-md-5 col-12">
                                <div
                                  className={`${styles.crDomain} d-flex align-items-center`}
                                >
                                  <div
                                    className={`avatarSmall flex-shrink-0 ${styles.avatarBg}`}
                                  >
                                    {order_details?.domain_name
                                      ?.charAt(0)
                                      ?.toUpperCase()}
                                  </div>
                                  <div
                                    className={`${styles.crDomainName} ps-2`}
                                  >
                                    {order_details?.domain_name}
                                  </div>
                                </div>
                                <div className={`${styles.crName} ms-4 ps-2`}>
                                  {plan?.name}
                                </div>
                              </div>

                              <div className="col-md-2 col-6 text-center">
                                <div className={styles.metaHead}>License</div>
                                <div className={styles.licenseValue}>
                                  <span>{order_details?.quantity}</span>
                                  <button
                                    type="button"
                                    className={styles.editBtn}
                                  >
                                    <LuPencil className={styles.editIcon} />
                                  </button>
                                </div>
                              </div>

                              <div className="col-md-2 col-6 text-center">
                                <div className={styles.metaHead}>Due on</div>
                                <div className={styles.dueValue}>
                                  {plan?.due_date || "-"}
                                </div>
                              </div>

                              <div
                                className={`col-md-3 col-12 ${styles.statusCol}`}
                              >
                                <div className={styles.statusInner}>
                                  <div className={styles.statusBadgeGroup}>
                                    <span
                                      className={`${styles.statusBadge} ${order_details?.status?.toLowerCase() === "active" ? styles.activeBadge : ""} ${order_details?.status?.toLowerCase() === "expiring" ? styles.expiringBadge : ""}  ${order_details?.status?.toLowerCase() === "expired" ? styles.expired : ""} ${order_details?.status === "inactive" ? styles.inactiveBadge : ""}`}
                                    >
                                      {order_details?.status}
                                    </span>
                                    {subscription?.subtext ? (
                                      <div className={styles.statusSubtext}>
                                        {subscription?.subtext}
                                      </div>
                                    ) : null}
                                  </div>
                                  <button
                                    type="button"
                                    className={styles.renewBtn}
                                  >
                                    Renew
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div
                            className={`col-auto align-self-stretch d-flex align-items-center justify-content-end order-sm-3 mobAction ${styles.arrowCol}`}
                          >
                            <a href="/subscriptions" className={styles.crBtn}>
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
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>No Subscriptions Data</p>
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
