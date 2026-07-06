import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import createBtnBg from "@/assets/summary-count/createBtnBg.svg";
import { useGetTransactionHistoryMutation } from "@/redux/apis/transactionsApi";
import styles from "./BillingCredit.module.css";

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
  return "-";
};

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

const BillingCredit = () => {
  const userData = Cookies.get("userData")
    ? JSON.parse(decodeURIComponent(Cookies.get("userData")))
    : {};

  const [transactions, setTransactions] = useState([]);
  const [getTransactionsList, { isLoading }] =
    useGetTransactionHistoryMutation();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await getTransactionsList({
          body: { partner_id: userData?.id },
        });
        if (res?.data?.success) {
          const list = res?.data?.data?.data || res?.data?.data || [];
          setTransactions(Array.isArray(list) ? list : []);
        }
      } catch (error) {
        console.log("Error fetching transactions:", error);
      }
    };

    if (userData?.id) {
      fetchTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.id]);

  const visibleTransactions = transactions.slice(0, 5);

  const renderTransactionRow = (item, index) => (
    <div className={styles.contentRow} key={item?.order_id || index}>
      <div className={styles.transactionRowInner}>
        <div className={styles.colDateMeta}>
          <p className={styles.txDate}>{formatDisplayDate(item)}</p>
          <span className={styles.txIdBadge}>{item?.order_no || "-"}</span>
        </div>

        <div className={styles.colDomainBlock}>
          <div className={`${styles.avatar} ${styles[`avatar${index % 5}`]}`}>
            {item?.domain?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div className={styles.domainInfo}>
            <p className={styles.domainName}>{item?.domain}</p>
            <p className={styles.subText}>{getTransactionDescription(item)}</p>
          </div>
        </div>

        <div className={styles.colStatus}>
          <span
            className={`${styles.statusBadge} ${getStatusClass(item?.status)}`}
          >
            {item?.status}
          </span>
        </div>

        <div className={styles.colAmount}>
          <span className={styles.amountValue}>
            {formatAmount(item?.amount)}
          </span>
        </div>

        <div className={styles.colArrow}>
          <Link
            href="/transactions"
            className={styles.arrowBtn}
            aria-label="View transaction details"
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
    <div className={styles.billingCreditPage}>
      <header className={styles.pageHeader}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/dashboard" className={styles.breadcrumbLink}>
            Dashboard
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>My Account</span>
        </nav>
        <h1 className={styles.pageTitle}>Billing &amp; Credits</h1>
      </header>

      <section className={`sectionCard ${styles.billingCard}`}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Billing &amp; Credits</h2>
          <span className="statusBadge subtleSuccess">Sufficient Credit</span>
        </div>

        <div className={styles.cardBody}>
          <div className={styles.creditBalanceBox}>
            <Image
              src={createBtnBg}
              alt=""
              aria-hidden
              width={500}
              height={500}
              className={styles.creditPatternRight}
            />

            <div className={styles.creditBalanceContent}>
              <p className={styles.creditBalanceLabel}>Credit Balance</p>
              <p className={styles.creditBalanceAmount}>₹ 36,458.00</p>
            </div>

            <button type="button" className={styles.payNowBtn}>
              Pay Now
            </button>
          </div>

          <div className={styles.statsGroup}>
            <div className={styles.statItem}>
              <p className={styles.statLabel}>Credit Used</p>
              <p className={styles.statValue}>₹16,254.00</p>
            </div>

            <span className={styles.statDivider} aria-hidden />

            <div className={styles.statItem}>
              <p className={styles.statLabel}>Credit Limit</p>
              <p className={styles.statValue}>₹50,000.00</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.transactionCard}>
        <div className={styles.headerBar}>
          <h2 className={styles.sectionTitle}>Transaction History</h2>
          <Link href="/transactions" className={styles.viewAllLink}>
            View All
          </Link>
        </div>

        <div className={styles.contentBody}>
          {isLoading ? (
            <p className={styles.emptyState}>Loading...</p>
          ) : visibleTransactions?.length > 0 ? (
            <div className={styles.contentList}>
              {visibleTransactions.map((item, index) =>
                renderTransactionRow(item, index),
              )}
            </div>
          ) : (
            <p className={styles.emptyState}>No Data Found</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default BillingCredit;
