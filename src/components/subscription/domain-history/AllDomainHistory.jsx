import { useGetDomainHistoryMutation } from "@/redux/apis/subscriptions";
import Loader from "@/common-components/loader/Loader";
import breadcrumbStyles from "@/components/customers/customers-details/CustomerDetails.module.css";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { GoShareAndroid } from "react-icons/go";
import { IoMdArrowBack } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { MdOutlineFileDownload } from "react-icons/md";
import styles from "./AllDomainHistory.module.css";
import DownloadExcel from "@/common-components/download-excel/DownloadExcel";
import { FaArrowRight, FaChevronRight, FaGlobe } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import { RiGlobalLine } from "react-icons/ri";

const TizzyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 400 400"
    width="24"
    height="24"
    className="icon"
  >
    <path
      fill="#34a853"
      d="M49,59s86.637-1.833,172,99L282,21,350,9V20s-36.234-2.265-53,43L144,391l-14-39,80-172S164.162,106.238,49,69V59Z"
    />
  </svg>
);

const MicrosoftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 48 48"
    className="icon"
  >
    <path fill="#ff5722" d="M6 6H22V22H6z" transform="rotate(-180 14 14)" />
    <path fill="#4caf50" d="M26 6H42V22H26z" transform="rotate(-180 34 14)" />
    <path fill="#ffc107" d="M26 26H42V42H26z" transform="rotate(-180 34 34)" />
    <path fill="#03a9f4" d="M6 26H22V42H6z" transform="rotate(-180 14 34)" />
  </svg>
);

const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
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
  </svg>
);

const formatHistoryStatus = (status) => {
  if (!status) return "-";
  const normalized = status.toLowerCase();
  if (normalized === "renewal") return "Renewed";
  if (normalized === "new") return "New Subscription";
  return status;
};

const formatPrice = (price) => {
  const amount = Number(price);
  if (Number.isNaN(amount)) return "-";
  return `₹ ${amount.toFixed(2)}`;
};

const getPlanIcon = (planName = "", domainName = "") => {
  const text = `${planName} ${domainName}`.toLowerCase();
  if (text.includes("microsoft") || text.includes("onmicrosoft")) {
    return <MicrosoftIcon />;
  }
  if (text.includes("google")) return <GoogleIcon />;
  return <TizzyIcon />;
};

const domainHistoryColumns = [
  {
    label: "Plan Name",
    key: "plan_name",
  },
  {
    label: "Type",
    key: "status",
  },
  {
    label: "Price",
    key: "price",
  },
  {
    label: "License",
    key: "license",
  },
  {
    label: "Period",
    key: "period",
  },
];

const HISTORY_STATUS = [
  {
    key: "active",
    label: "Renewed",
  },
  {
    key: "inactive",
    label: "Inactive",
  },
  {
    key: "expired",
    label: "Expired",
  },
  {
    key: "processing",
    label: "Processing",
  },
];

const AllDomainHistory = () => {
  const router = useRouter();
  const domains = router?.query?.domains?.split(",").filter(Boolean) || [];
  const customerId = router?.query?.customerId;
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState("all");

  const userData = Cookies.get("userData")
    ? JSON.parse(decodeURIComponent(Cookies.get("userData")))
    : {};
  const [domainHistory, setDomainHistory] = useState([]);

  const [getDomainHistory, { isLoading: isGetDomainHistoryLoading }] =
    useGetDomainHistoryMutation();

  const handleGetDomainHistory = async () => {
    try {
      if (!router?.isReady || domains?.length === 0) return;
      const res = await getDomainHistory({
        body: {
          partner_id: userData?.id,
          domain_names: domains,
        },
      });
      if (res?.data?.success || res?.data?.status) {
        setDomainHistory(res?.data?.data || []);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    handleGetDomainHistory();
  }, [router?.isReady, router?.query?.domains]);

  const filteredCustomers = useMemo(
    () =>
      domainHistory?.filter((domain) => {
        const q = searchQuery?.trim()?.toLowerCase();
        const matchesSearch =
          q === "" ||
          domain?.domain_name?.toLowerCase()?.includes(q) ||
          domain?.plan_name?.toLowerCase()?.includes(q) ||
          domain?.price?.toLowerCase()?.includes(q) ||
          domain?.license?.toLowerCase()?.includes(q) ||
          domain?.period?.toLowerCase()?.includes(q);

        return matchesSearch;
      }),
    [searchQuery, domainHistory],
  );

  const pageTitle = customerId
    ? `Customer - ${customerId}`
    : domains.length === 1
      ? domains[0]
      : "Domain History";

  if (isGetDomainHistoryLoading) {
    return <Loader />;
  }

  return (
    <div className="row flex-column gy-4 py-4">
      <div className="col">
        <div className={`${styles.breadcrumbHeader} row align-items-end`}>
          <div className="col">
            <nav className={`${breadcrumbStyles.breadcrumb} mb-0`}>
              <Link href="/dashboard" className="text-dark">
                Dashboard
              </Link>{" "}
              /{" "}
              <Link href="/subscriptions" className="text-dark">
                Subscriptions
              </Link>
              <span className="breadcrumb-item" />
              <h1
                className={`${breadcrumbStyles["breadcrumb-item"]} active fs-3 fw-bold`}
                aria-current="page"
              >
                {pageTitle}
              </h1>
            </nav>
          </div>
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
      </div>

      <div className="col">
        {domainHistory?.length > 0 ? (
          domainHistory?.map((domainItem) => (
            <>
              <div className={`${styles.filtersMain}`}>
                {/* Search & Count Header */}
                <div className={`${styles.filtersHeader} border-bottom`}>
                  <div className="row align-items-center justify-content-between">
                    <div className="col-sm-auto order-sm-2">
                      <search className={`${styles.pageSearchBox}`}>
                        <input
                          type="text"
                          className={`${styles.pageSearch} form-control`}
                          placeholder="Search Customers"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className={`${styles.searchBtn}`}>
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
                            className="icon"
                          >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                          </svg>
                        </button>
                      </search>
                    </div>
                    <div
                      className={`${styles.searchCount} col-sm-auto order-sm-1 text-center my-2 my-sm-2 `}
                    >
                      <h2 className={styles.domainTitle}>
                        <RiGlobalLine size={16} className={styles.domainIcon} />{" "}
                        {domainItem?.domain_name}
                      </h2>
                      Showing{" "}
                      <span className="fw-medium darkColor">
                        1 - {filteredCustomers?.length}
                      </span>{" "}
                      from{" "}
                      <span className="fw-medium darkColor">
                        {filteredCustomers?.length}
                      </span>{" "}
                      Subscriptions
                    </div>
                  </div>
                </div>

                <div className={`${styles.filterWrapper} `}>
                  <div
                    className={`collapse${filterOpen ? " show" : ""}`}
                    id="filterSection"
                  >
                    <div className="p-sm-4 p-3 ">
                      <div className="row g-4 mb-4">
                        <div className={`${styles.filterPart} col-auto `}>
                          <span className={`${styles.filterHead}`}>
                            Status :
                          </span>
                          <ul
                            className={`${styles.filterGroup} gap-2`}
                            role="group"
                          >
                            {HISTORY_STATUS?.map((status, i) => (
                              <li key={status?.key}>
                                <input
                                  type="checkbox"
                                  className="btn-check"
                                  id={`status_${status?.key}`}
                                  autoComplete="off"
                                  checked={selectedStatuses === status?.key}
                                  onChange={() =>
                                    setSelectedStatuses(
                                      selectedStatuses === status?.key
                                        ? "all"
                                        : status?.key,
                                    )
                                  }
                                />
                                <label
                                  className={`${styles.filterItem} rounded-pill`}
                                  htmlFor={`status_${status?.key}`}
                                  style={{
                                    backgroundColor:
                                      selectedStatuses === status?.key
                                        ? "var(--primaryColor)"
                                        : "",
                                    color:
                                      selectedStatuses === status?.key
                                        ? "var(--whiteColor)"
                                        : "var(--darkColor)",
                                  }}
                                >
                                  {status?.label}
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
              <div
                key={domainItem?.domain_name}
                className={`${styles.historyCard} ${styles.sectionCard} ${styles.domainSection}`}
              >
                <div className={styles.cardHeader}>
                  {/* <div className={styles.titleGroup}>
                  <p className={styles.sectionLabel}>SUBSCRIPTION HISTORY :</p>
                  <h2 className={styles.pageTitle}>
                    {domainItem?.domain_name}
                  </h2>
                </div> */}
                  <div className={styles.historyBtn}>
                    {/* <button type="button" className="shareBtn small">
                    <GoShareAndroid size={16} /> Share
                  </button> */}
                    <DownloadExcel
                      data={domainItem?.history}
                      columns={domainHistoryColumns}
                      fileName={`${domainItem?.domain_name}-history`}
                      className="downloadBtn small"
                      buttonText="Download"
                    />
                  </div>
                </div>

                {domainItem?.history?.length > 0 ? (
                  domainItem?.history?.map((item) => (
                    <div className={styles.historyRow} key={item?.id}>
                      <div className={styles.colDateMeta}>
                        <p className={styles.txDate}>20 Mar 2026</p>
                        <span className={styles.txIdBadge}>{item?.order_no || "-"}</span>
                      </div>

                      <div className={styles.rowLeft}>
                        <div className={styles.statusIcon}>
                          {getPlanIcon(
                            item?.plan_name,
                            domainItem?.domain_name,
                          )}
                        </div>
                        <div className={styles.productInfo}>
                          <p className={styles.productName}>
                            {item?.plan_name || "-"}
                          </p>
                          <p className={styles.productPrice}>₹{item?.price || "-"} <span className={styles.productPricePer}>Per User / Per Year</span></p>
                        </div>
                      </div>

                      <div className={styles.rowGrid}>
                        <div className={styles.rowValue}>
                          <span className={styles.fieldLabel}>
                            Enrollment Type
                          </span>
                          <span className={styles.valueText}>{item?.order_category || "-"}</span>
                        </div>
                        <div className={styles.rowValue}>
                          <span className={styles.fieldLabel}>License</span>
                          <span className={styles.valueText}>
                            {item?.license ?? "-"}
                          </span>
                        </div>
                        <div className={styles.rowValue}>
                          <span className={styles.fieldLabel}>Period</span>
                          <span className={styles.valueText}>
                            {item?.period ||
                              (item?.start_date && item?.end_date
                                ? `${item.start_date} - ${item.end_date}`
                                : "-")}
                          </span>
                        </div>
                      </div>

                      <span className={styles.statusLabel}>
                        {formatHistoryStatus(item?.status)}
                      </span>
                      <FaChevronRight size={12} className={styles.colArrow} />
                    </div>
                  ))
                ) : (
                  <p className={styles.emptyState}>
                    No history found for this domain.
                  </p>
                )}
              </div>
            </>
          ))
        ) : (
          <div className={`${styles.sectionCard} ${styles.emptyState}`}>
            No subscription history available.
          </div>
        )}
      </div>
    </div>
  );
};

export default AllDomainHistory;
