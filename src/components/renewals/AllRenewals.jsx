import { useMemo, useState } from "react";
import styles from "@/components/subscription/all-subscriptions/AllSubscriptions.module.css";
import { FiFilter } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { LuPencil } from "react-icons/lu";
import Loader from "@/common-components/loader/Loader";
import Link from "next/link";
import { useRouter } from "next/router";
import { useGetAllRenewalsListMutation } from "@/redux/apis/renewalsApi";
import Cookies from "js-cookie";
import React, { useEffect } from "react";

const statusLabelMap = {
  expiring: "Expiring",
  // active: "Active",
  // inactive: "Inactive",
  expired: "Expired",
};

const avatarColorClasses = [
  "avatarRed",
  "avatarGold",
  "avatarBlue",
  "avatarPurple",
  "avatarTeal",
  "avatarNavy",
];

const statusOrder = [
  "expiring",
  // "active",
  // "inactive",
  "expired",
];

const formatDueDate = (dateStr) => {
  if (!dateStr) return "-";
  const [year, month, day] = dateStr.split("-");
  if (!year || !month || !day) return dateStr;
  return `${day}-${month}-${year}`;
};

const AllRenewals = () => {
  const router = useRouter();
  const userData = Cookies.get("userData")
    ? JSON.parse(decodeURIComponent(Cookies.get("userData")))
    : {};

  const [getAllRenewalsList, { isLoading: isAllRenewalsListLoading }] =
    useGetAllRenewalsListMutation();
  const [renewalsList, setRenewalsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const fetchAllRenewalsList = async () => {
    try {
      const res = await getAllRenewalsList({
        body: { partner_id: userData?.id },
      });
      if (res?.data?.success) {
        setRenewalsList(res?.data?.data || []);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    fetchAllRenewalsList();
  }, []);

  const toggleStatus = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((item) => item !== status)
        : [...prev, status],
    );
  };

  const filteredRenewals = useMemo(
    () =>
      renewalsList.filter((renewal) => {
        const q = searchQuery.trim().toLowerCase();
        const matchesSearch =
          q === "" ||
          renewal.domain?.toLowerCase().includes(q) ||
          renewal.plan?.toLowerCase().includes(q) ||
          renewal.order_no?.toLowerCase().includes(q) ||
          renewal.customer_name?.toLowerCase().includes(q) ||
          renewal.email?.toLowerCase().includes(q);
        const renewalStatus = renewal.status?.toLowerCase();
        const matchesStatus =
          selectedStatuses.length === 0 ||
          selectedStatuses.includes(renewalStatus);

        return matchesSearch && matchesStatus;
      }),
    [renewalsList, searchQuery, selectedStatuses],
  );

  const totalCount = renewalsList.length;
  const showingCount = filteredRenewals.length;

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
                    placeholder="Search Renewal"
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
                  {showingCount > 0 ? 1 : 0} - {showingCount}
                </span>{" "}
                from <span className="fw-medium darkColor">{totalCount}</span>{" "}
                Renewals
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
                            id={`renewal_status_${status}`}
                            autoComplete="off"
                            checked={selectedStatuses.includes(status)}
                            onChange={() => toggleStatus(status)}
                          />
                          <label
                            className={`${styles.filterItem} rounded-pill`}
                            htmlFor={`renewal_status_${status}`}
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
              {!isAllRenewalsListLoading ? (
                filteredRenewals.length > 0 ? (
                  filteredRenewals?.map((renewal, idx) => {
                    const statusKey = renewal.status?.toLowerCase();

                    return (
                      <div
                        key={renewal.order_id}
                        className={`${styles.contentRow} ${styles.btnDisplay}`}
                      >
                        <div className="row align-items-center">
                          <div className="col">
                            <div className="row align-items-center py-3 px-3">
                              <div className="col-md-4 col-12">
                                <div
                                  className={`${styles.crDomain} d-flex align-items-center`}
                                >
                                  <div
                                    className={` flex-shrink-0 ${styles.avatarBg} ${
                                      avatarColorClasses[
                                        idx % avatarColorClasses.length
                                      ]
                                    }`}
                                  >
                                    {renewal?.domain?.charAt(0)?.toUpperCase()}
                                  </div>
                                  <div className={` ps-2`}>
                                    <span className={`${styles.crDomainName}`}>
                                      {renewal?.domain}
                                    </span>
                                    <p className="m-0  text-secondary small">
                                      Order Id: {renewal?.order_no}
                                    </p>
                                    <div className={`${styles.crName} `}>
                                      {renewal?.plan}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="col-md-2 col-6 text-center">
                                <div className={styles.metaHead}>License</div>
                                <div className={styles.licenseValue}>
                                  <span>{renewal?.license_count}</span>
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
                                  {formatDueDate(
                                    renewal?.renewal_date ||
                                      renewal?.subscription_end_date,
                                  )}
                                </div>
                              </div>

                              <div
                                className={`col-md-3 col-12 ${styles.statusCol}`}
                              >
                                <div className={styles.statusInner}>
                                  <div className={styles.statusBadgeGroup}>
                                    <span
                                      className={`${styles.statusBadge} ${statusKey === "active" ? styles.activeBadge : ""} ${statusKey === "expiring" ? styles.expiringBadge : ""} ${statusKey === "expired" ? styles.expired : ""} ${statusKey === "inactive" ? styles.inactiveBadge : ""}`}
                                    >
                                      {renewal?.status}
                                    </span>
                                    {renewal?.days_left != null ? (
                                      <div className={styles.statusSubtext}>
                                        {renewal.days_left} days left
                                      </div>
                                    ) : null}
                                  </div>
                                  {/* {(statusKey === "expiring" ||
                                    statusKey === "expired") && (
                                    <button
                                      type="button"
                                      className={styles.renewBtn}
                                      onClick={() =>
                                        router.push({
                                          pathname: "/order-summary",
                                          query: {
                                            type: "renew-plan",
                                            order_id: renewal?.order_id,
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
                                pathname:
                                  "/subscriptions/subscriptions-details",
                                query: {
                                  orderId: renewal?.order_id,
                                  type: "renewals",
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
                  <p className="text-center m-0">No Renewals Data</p>
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

export default AllRenewals;
