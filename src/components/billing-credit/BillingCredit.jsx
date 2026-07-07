import React from "react";
import Link from "next/link";
import Image from "next/image";
import createBtnBg from "@/assets/summary-count/createBtnBg.svg";
import styles from "./BillingCredit.module.css";
import TransactionsList from "../transactions/TransactionsList";

const BillingCredit = () => {
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

      <TransactionsList variant="billing" limit={8} />
    </div>
  );
};

export default BillingCredit;
