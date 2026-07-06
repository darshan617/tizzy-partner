import React from "react";
import Link from "next/link";
import { GoShieldCheck } from "react-icons/go";
import styles from "./AccountDetailForm.module.css";

const AccountDetailForm = () => {
  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/dashboard" className={styles.breadcrumbLink}>
            Dashboard
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>My Account</span>
        </nav>
        <h1 className={styles.pageTitle}>Bank Details</h1>
      </header>

      <section className={`sectionCard ${styles.formCard}`}>
        <form className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="accountHolderName">
                Account Holder Name
                <span className={styles.required}>*</span>
              </label>
              <input
                id="accountHolderName"
                type="text"
                name="accountHolderName"
                className="form-control"
                placeholder=""
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="accountNumber">
                Account Number
                <span className={styles.required}>*</span>
              </label>
              <input
                id="accountNumber"
                type="number"
                name="accountNumber"
                className="form-control"
                placeholder=""
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="ifscCode">
                IFSC Code
                <span className={styles.required}>*</span>
              </label>
              <input
                id="ifscCode"
                type="text"
                name="ifscCode"
                className="form-control"
                placeholder=""
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="bankName">
                Bank Name
                <span className={styles.required}>*</span>
              </label>
              <input
                id="bankName"
                type="text"
                name="bankName"
                className="form-control"
                placeholder=""
                required
              />
            </div>

            <div className={`${styles.formGroup} ${styles.halfWidth}`}>
              <label className={styles.label} htmlFor="branch">
                Branch
                <span className={styles.required}>*</span>
              </label>
              <input
                id="branch"
                type="text"
                name="branch"
                className="form-control"
                placeholder=""
                required
              />
            </div>
          </div>

          <div className={styles.infoBanner} role="note">
            <span className={styles.infoIcon} aria-hidden>
              <GoShieldCheck size={18} />
            </span>
            <p className={styles.infoText}>
              Your bank details are masked for safety. While editing, enter the
              IFSC code to auto-fetch bank details before saving.
            </p>
          </div>

          <div className={styles.submitWrap}>
            <button className={styles.saveBtn} >
              Save
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AccountDetailForm;
