import React, { useState } from "react";
import Link from "next/link";
import styles from "@/components/subscription/all-current-subscription/AllCurrentSubscription.module.css";
import { FiFilter, FiLayers } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { FiUsers } from "react-icons/fi";
import { Calendar } from "lucide-react";
import { BiChevronRight, BiGlobe } from "react-icons/bi";
import { TbRefresh } from "react-icons/tb";
import { IoMdArrowBack } from "react-icons/io";
import { useRouter } from "next/router";

const AllCurrentSubscription = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState("all");
  const router = useRouter();
  const statusOrder = [
    "active",
    "processing",
    // "pending",
    "draft",
    "expiring",
    "upgraded",
    "downgraded",
    "renewed",
    "cancelled",
    "upgrade pending",
    "downgrade pending",
    "renewal pending",
  ];

  const statusLabelMap = {
    active: "Active",
    expiring: "Expiring",
    pending: "Pending",
    downgraded: "Downgraded",
    draft: "Draft",
    cancelled: "Cancelled",
    upgraded: "Upgraded",
    renewed: "Renewed",
    "upgrade pending": "Upgrade Pending",
    "downgrade pending": "Downgrade Pending",
    "renewal pending": "Renewal Pending",
    processing: "Processing",
  };
  return (
    <div
      className={styles.container}
      style={{ width: "100%", maxWidth: "1100px", margin: "auto" }}
    >
      <div className={styles.breadcrumbs} aria-label="Breadcrumb">
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
          }}
        >
          <Link href="/dashboard" className={styles.breadcrumbLink}>
            Dashboard
          </Link>
          <span className={styles.separator}>/</span>
          <Link
            href="/customers/customers-details"
            className={styles.breadcrumbLink}
          >
            Customers
          </Link>
          <span className={styles.separator}>/</span>
          <Link
            href="/customers/customers-details"
            className={styles.breadcrumbLink}
          >
            Customer - 00024
          </Link>
        </span>
        <div className="col-auto">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn small btnWhite"
          >
            <IoMdArrowBack />
            <span>Back</span>
          </button>
        </div>
      </div>

      <div className={styles.title}>
        <h1>Customer Current Subscriptions</h1>
      </div>

      <div className={styles.filtersMain}>
        <div className="py-3 px-sm-4 px-3 border-bottom">
          <div className="row align-items-center justify-content-between">
            <div className="col-sm-auto order-sm-2">
              <Link
                href="/subscriptions/all-subscriptions"
                className={styles.viewAllLink}
              >
                <span>View All</span>
              </Link>
            </div>
            <h2 className={styles.subTitle}>Current Subscriptions</h2>
            <div
              className={`${styles.searchCount} col-sm-auto order-sm-1 text-center my-2 my-sm-0`}
            >
              Showing <span className="fw-medium darkColor">1 - 10</span> from{" "}
              <span className="fw-medium darkColor">10</span> Subscriptions
            </div>
          </div>
        </div>

        <div className={`${styles.filterWrapper} `} id="filterSection">
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
                          onClick={() =>
                            selectedStatuses === status
                              ? setSelectedStatuses("all")
                              : setSelectedStatuses(status)
                          }
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
            className="filterBtn btn small btnDefault"
            onClick={() => setFilterOpen((prev) => !prev)}
            aria-expanded={filterOpen}
          >
            {filterOpen ? (
              <>
                <IoClose className="icon me-2" />
                <span>Close</span>
              </>
            ) : (
              <>
                <FiFilter className="icon me-2" />
                <span>Filters</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="col">
        <div className={`${styles.pageWrap} py-4`}>
          <div className={`${styles.card} p-sm-4 p-3`}>
            <div className={`${styles.subRow}`}>
              <div className={`${styles.subTop}`}>
                <div className={`${styles.subPlan}`}>
                  <p className={`${styles.subPlanIcon} m-0 flex-shrink-0`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="400"
                      height="400"
                      viewBox="0 0 400 400"
                      class="icon"
                    >
                      <path
                        fill="#34a853"
                        d="M49,59s86.637-1.833,172,99L282,21,350,9V20s-36.234-2.265-53,43L144,391l-14-39,80-172S164.162,106.238,49,69V59Z"
                      ></path>
                    </svg>
                  </p>
                  <div className="ms-2">
                    <div className={`${styles.subPlanName}`}>
                      Tizzy® Mail Enterprise 100 GB
                    </div>
                    <small className={`${styles.subPlanPrice}`}>
                      ₹2850 <span>Per User / Per Year</span>
                    </small>
                  </div>
                </div>

                <span className={`${styles.statusBadge} ${styles?.["active"]}`}>
                  Pending
                </span>
              </div>

              <div className={`${styles.subBottom}`}>
                <div className={`${styles.subMeta} ps-1`}>
                  <div className={`${styles.subMetaItem}`}>
                    <FiLayers className={`${styles.subMetaIcon}`} />
                    <div className={`${styles.subMetaValue}`}>SUB-00097</div>
                  </div>
                  <div className={`${styles.subMetaItem}`}>
                    <BiGlobe className={`${styles.subMetaIcon}`} />
                    <div>
                      <div className={`${styles.subMetaValue}`}>
                        kbkenterprise.com
                      </div>
                    </div>
                  </div>
                  <div className={`${styles.subMetaItem}`}>
                    <FiUsers className={`${styles.subMetaIcon}`} />
                    <div>
                      <div className={`${styles.subMetaValue}`}>50 Users</div>
                    </div>
                  </div>
                  <div className={`${styles.subMetaItem}`}>
                    <TbRefresh className={`${styles.subMetaIcon}`} />
                    <div>
                      <div className={`${styles.subMetaValue}`}>
                        31 Oct 2025
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`${styles.subActions}`}>
                  <button className={styles.subActionBtnViewMore}>
                    <BiChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCurrentSubscription;
