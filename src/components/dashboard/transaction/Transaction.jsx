import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/components/dashboard/transaction/Transaction.module.css";
import { FiChevronsDown, FiChevronsUp, FiGlobe } from "react-icons/fi";

const getStatusClass = (status) => {
  const key = status?.toLowerCase()?.replace(/\s+/g, "");
  if (["pending", "expiring"].includes(key)) return styles.expiring;
  if (["overdue", "expired", "cancelled", "rejected"].includes(key))
    return styles.expired;
  if (["completed", "success", "unpaid", "active"].includes(key))
    return styles.active;
  return styles.draft;
};

const formatDisplayDate = (item) => {
  if (item?.date) return item.date;
  if (item?.renewal_date) return item.renewal_date;
  if (item?.subscription_end_date) return item.subscription_end_date;
  if (item?.subscription_start_date) return item.subscription_start_date;
  return "-";
};

const getCompanyName = (item) =>
  item?.customer_name ||
  item?.company_name ||
  item?.customer ||
  item?.owner ||
  item?.order_no ||
  "-";

const getTransactionDescription = (item) =>
  item?.description ||
  item?.plan ||
  item?.plan_name ||
  (item?.invoice_no
    ? `Received payment for invoice no. INV${item.invoice_no}`
    : "-");

const formatAmount = (amount) => {
  const num = Number(amount ?? 0);
  return `₹ ${num.toFixed(2)}`;
};

export default function TransactionSection({ data, isDataLoading }) {
  const [activeTab, setActiveTab] = useState("transactions");
  const [currentData, setCurrentData] = useState(data?.transaction_history);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setCurrentData(
      activeTab === "transactions"
        ? data?.transaction_history
        : data?.renewals_history,
    );
  }, [data?.transaction_history, data?.renewals_history, activeTab]);

  const visibleData = currentData?.slice(0, showAll ? 10 : 5) || [];
  const viewAllHref =
    activeTab === "transactions" ? "/transactions" : "/renewals";
  const isRenewals = activeTab === "renewals";

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowAll(false);
    setCurrentData(
      tab === "transactions"
        ? data?.transaction_history
        : data?.renewals_history,
    );
  };

  const renderTransactionRow = (item, index) => (
    <div className={styles.contentRow} key={item?.order_id || index}>
      <div className="row align-items-center g-2">
        <div className="col-12 col-md-2 col-lg-2">
          <div className={styles.colDateMeta}>
            <p className={styles.txDate}>{formatDisplayDate(item)}</p>
            <span className={styles.txIdBadge}>{item?.order_no || "-"}</span>
          </div>
        </div>

        <div className="col-12 col-md-3 col-lg-4">
          <div className={styles.colDomainBlock}>
            <div className={`${styles.avatar} ${styles[`avatar${index % 5}`]}`}>
              {item?.company_name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div className={styles.domainInfo}>
              <p className={styles.subText}>{getCompanyName(item)}</p>
              <div className={styles.domainNameContainer}>
                <FiGlobe className={styles.domainIcon} size={16} />
                <p className={styles.domainName}>{item?.domain}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-3 col-lg-3">
          <div className={styles.txMeta}>
            <div className={styles.txPlanName}>{item?.plan}</div>
            <div className={styles.categoryName}>{item?.category}</div>
          </div>
        </div>

        <div className="col-6 col-md-2 col-lg-2 text-md-center">
          <span
            className={`${styles.statusBadge} ${getStatusClass(item?.status)}`}
          >
            {item?.status}
          </span>
        </div>

        <div className="col-6 col-md-2 col-lg-1 text-end">
          <span className={styles.amountValue}>
            {formatAmount(item?.amount)}
          </span>
        </div>
      </div>
    </div>
  );

  const renderRenewalRow = (item, index) => (
    <div className={styles.contentRow} key={item?.order_id || index}>
      <div className={styles.renewalRowInner}>
        <div className={styles.colDateMeta}>
          <p className={styles.txDate}>{formatDisplayDate(item)}</p>
          <span className={styles.txIdBadge}>
            {item?.order_no || item?.order_id || "-"}
          </span>
        </div>

        <div className={styles.colDomainBlock}>
          <div className={`${styles.avatar} ${styles[`avatar${index % 5}`]}`}>
            {item?.domain?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div className={styles.domainInfo}>
            <p className={styles.companyName}>{getCompanyName(item)}</p>
            <div className={styles.domainNameContainer}>
              <FiGlobe className={styles.domainIcon} size={16} />
              <p className={styles.domainName}>{item?.domain || "-"}</p>
            </div>
          </div>
        </div>

        <div className={styles.colPlan}>
          <div className={styles.planNameRow}>
            <span className={styles.planText}>
              {item?.plan || item?.plan_name || item?.description}
            </span>
            <span className={styles.plansCount}>
              {(item?.plans_count ?? item?.plan_count) > 1
                ? ` (+${(item?.plans_count ?? item?.plan_count) - 1} more)`
                : ""}
            </span>
          </div>
          <p className={styles.subText}>
            {item?.subscription_end_date || item?.renewal_date || "-"}
          </p>
        </div>

        <div className={styles.colLicense}>
          <div className={styles.metaHead}>License</div>
          <div className={styles.metaValue}>{item?.license_count ?? "-"}</div>
        </div>

        <div className={styles.colStatus}>
          <span
            className={`${styles.statusBadge} ${getStatusClass(item?.status)}`}
          >
            {item?.status}
          </span>
        </div>

        <div className={styles.colArrow}>
          <Link
            href={{
              pathname: "/subscriptions/subscriptions-details",
              query: { orderId: item?.order_id, type: "renewals" },
            }}
            className={styles.arrowBtn}
            aria-label="View renewal details"
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
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.transactionWrapper}>
      <div className={styles.transactionCard}>
        <div className={styles.headerBar}>
          <div className={styles.tabTrack}>
            <button
              type="button"
              className={`${styles.tab} ${activeTab === "transactions" ? styles.tabActive : ""}`}
              onClick={() => handleTabChange("transactions")}
            >
              Recent Transactions
            </button>
            <button
              type="button"
              className={`${styles.tab} ${activeTab === "renewals" ? styles.tabActive : ""}`}
              onClick={() => handleTabChange("renewals")}
            >
              Upcoming Renewals
            </button>
          </div>
          <Link href={viewAllHref} className={styles.viewAllLink}>
            View All
          </Link>
        </div>

        <div className={styles.contentBody}>
          {isDataLoading ? (
            <p className={styles.emptyState}>Loading...</p>
          ) : visibleData?.length > 0 ? (
            <>
              <div className={styles.contentList}>
                {visibleData?.map((item, index) =>
                  isRenewals
                    ? renderRenewalRow(item, index)
                    : renderTransactionRow(item, index),
                )}
              </div>

              {currentData?.length > 5 && (
                <button
                  type="button"
                  onClick={() => setShowAll(!showAll)}
                  className={styles.loadMoreBtn}
                >
                  {showAll ? (
                    <>
                      <FiChevronsUp className={styles.loadMoreIcon} /> Load Less
                    </>
                  ) : (
                    <>
                      <FiChevronsDown className={styles.loadMoreIcon} /> Load
                      More
                    </>
                  )}
                </button>
              )}
            </>
          ) : (
            <p className={styles.emptyState}>No Data Found</p>
          )}
        </div>
      </div>
    </div>
  );
}
