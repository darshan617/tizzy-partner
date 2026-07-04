import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaPen } from "react-icons/fa";
import createBtnBg from "@/assets/summary-count/createBtnBg.svg";
import styles from "@/components/account-info/AccountInfo.module.css";

const AccountInfo = () => {
  return (
    <div className="container">
      <div className={styles.breadcrumbs} aria-label="Breadcrumb">
        <span
          style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
        >
          <Link href="/dashboard" className={styles.breadcrumbLink}>
            Dashboard
          </Link>
          <span className={styles.separator}>/</span>
          <span className={styles.crumbCurrent}>My Account</span>
        </span>
      </div>

      <div className={styles.title}>
        <h1>Account Information</h1>
      </div>

      <div className={styles.pageWrap}>
        <div className="row gy-4">
          <div className="col-lg-4 col-12">
            <div className={styles.profCard}>
              <div className={`${styles.profHeader} position-relative`}>
                <Image
                  src={createBtnBg}
                  alt=""
                  width={500}
                  height={500}
                  className={styles.createBtnBg}
                />
                <Image
                  src={createBtnBg}
                  alt=""
                  width={500}
                  height={500}
                  className={styles.createBtnBg2}
                />
                <div className={`${styles.profAvatarLg} text-capitalize`}>S</div>
                <h2 className={`${styles.profName} text-capitalize`}>Saif Shaikh</h2>
                <p className={`${styles.profCompany} text-capitalize`}>
                  Goyal Infotech Pvt. Ltd.
                </p>
                <div className={styles.profFooter}>
                  <span className={styles.profId}>Partner ID : P123456</span>
                  <span className={`statusBadge primaryBg ${styles.adminBadge}`}>
                    Admin
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Company detail card */}
          <div className="col-lg-8 col-12">
            <div className={`${styles.detailCard} p-sm-4 p-3`}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardHead}>Company Detail</h2>
                <button
                  type="button"
                  className={styles.cardEditBtn}
                  aria-label="Edit company detail"
                >
                  <FaPen />
                </button>
              </div>

              <div className="row gy-3">
                <div className="col-md-6">
                  <div className={styles.infoItem}>
                    <small className={styles.infoLabel}>Company Name</small>
                    <div className={`${styles.infoValue} d-flex align-items-center flex-wrap gap-2`}>
                      <span className="text-capitalize">Goyal Infotech Pvt. Ltd.</span>
                      <span className={`statusBadge subtleSuccess ${styles.verifiedBadge}`}>
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className={styles.infoItem}>
                    <small className={styles.infoLabel}>Company Address</small>
                    <div className={styles.infoValue}>
                      Office No. 410, 9 Business Bay, <br /> Mindspace, Malad West,
                      Mumbai - <br /> 400064. Maharashtra, India.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal information card */}
          <div className="col-12">
            <div className={`${styles.detailCard} p-sm-4 p-3`}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardHead}>Personal information</h2>
                <button
                  type="button"
                  className={styles.cardEditBtn}
                  aria-label="Edit personal information"
                >
                  <FaPen />
                </button>
              </div>

              <div className="row gy-3">
                <div className="col-md-6">
                  <div className={styles.infoItem}>
                    <small className={styles.infoLabel}>Full Name</small>
                    <div className={`${styles.infoValue} text-capitalize`}>
                      Saif Shaikh
                    </div>
                  </div>
                  <div className={`${styles.infoItem} mb-0`}>
                    <small className={styles.infoLabel}>Mobile No.</small>
                    <div className={styles.infoValue}>+91 98123 46780</div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className={styles.infoItem}>
                    <small className={styles.infoLabel}>Email</small>
                    <div className={styles.infoValue}>saif@goyalinfotech.com</div>
                  </div>
                  <div className={`${styles.infoItem} mb-0`}>
                    <small className={styles.infoLabel}>GSTIN</small>
                    <div className={`${styles.infoValue} text-uppercase`}>
                      AA00001234W548
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;
