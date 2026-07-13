import React from "react";
import Link from "next/link";
import Image from "next/image";
import createBtnBg from "@/assets/summary-count/createBtnBg.svg";
import styles from "./BillingCredit.module.css";
import TransactionsList from "../transactions/TransactionsList";
import { useSelector } from "react-redux";

const BillingCredit = () => {
  const balanceAndCartData = useSelector(
    (state) => state.balanceCart.balanceAndCartData,
  );
  console.log(balanceAndCartData);
  const formatAmount = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    });
  return (
    <div className={styles.billingCreditPage}>
      <div className={styles.pageHeader}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/dashboard" className={styles.breadcrumbLink}>
            Dashboard
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>My Account</span>
        </nav>
        <h1 className={styles.pageTitle}>Billing &amp; Credits</h1>
      </div>

      <section className={`sectionCard ${styles.billingCard}`}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Billing &amp; Credits</h2>
          <span
            className={`statusBadge ${balanceAndCartData?.is_sufficient_balance ? "subtleSuccess" : "subtleDanger"}`}
          >
            {balanceAndCartData?.is_sufficient_balance
              ? "Sufficient Credit"
              : "Insufficient Credit"}{" "}
          </span>
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
              <p className={styles.creditBalanceAmount}>
                ₹ {formatAmount(balanceAndCartData?.wallet_balance)}
              </p>
            </div>

            <button type="button" className={styles.payNowBtn}>
              Pay Now
            </button>
          </div>

          <div className={styles.statsGroup}>
            <div className={styles.statItem}>
              <p className={styles.statLabel}>Credit Used</p>
              <p className={styles.statValue}>
                ₹{" "}
                {formatAmount(
                  balanceAndCartData?.credit_limit -
                    balanceAndCartData?.wallet_balance,
                )}
              </p>
            </div>

            <span className={styles.statDivider} aria-hidden />

            <div className={styles.statItem}>
              <p className={styles.statLabel}>Credit Limit</p>
              <p className={styles.statValue}>
                {formatAmount(balanceAndCartData?.credit_limit)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <TransactionsList variant="billing" limit={8} />
    </div>
  );
};

export default BillingCredit;
