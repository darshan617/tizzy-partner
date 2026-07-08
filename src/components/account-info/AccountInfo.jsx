import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import { FaPen } from "react-icons/fa";
import createBtnBg from "@/assets/summary-count/createBtnBg.svg";
import CustomPopup from "@/common-components/custom-popup/CustomPopup";
import styles from "@/components/account-info/AccountInfo.module.css";
import { useGetAccountDetailQuery } from "@/redux/apis/accountDetailApi";

const INITIAL_PROFILE = {
  fullName: "",
  companyName: "",
  companyAddress: "",
  mobile: "",
  email: "",
  gstin: "",
};

const AccountInfo = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [formData, setFormData] = useState(INITIAL_PROFILE);
  const userData = Cookies?.get("userData")
    ? JSON.parse(decodeURIComponent(Cookies?.get("userData")))
    : {};

  const handleOpenEdit = () => {
    setFormData({
      fullName: accountData?.name || "",
      companyName: accountData?.company_name || "",
      companyAddress: accountData?.company_address || "",
      mobile: accountData?.mobile || "",
      email: accountData?.email || "",
      gstin: accountData?.gstin || "",
    });
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const { data: accountDetail } = useGetAccountDetailQuery(
    {
      body: {
        partner_id: userData?.id,
      },
    },
    {
      skip: !userData?.id,
    },
  );

  console.log(accountDetail);
  const accountData = accountDetail?.data || {};
  const displayProfile = {
    fullName: accountData?.name || "",
    companyName: accountData?.company_name || "",
    companyAddress: accountData?.company_address || "",
    mobile: accountData?.mobile || "",
    email: accountData?.email || profile.email,
    gstin: accountData?.gstin || "",
    partnerCode: accountData?.partner_code || "",
    role: accountData?.role || "",
    isVerified: accountData?.is_verified ?? "",
  };

  return (
    <div className="container">
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
                <button
                  type="button"
                  className={styles.cardEditBtn}
                  aria-label="Edit profile"
                  onClick={handleOpenEdit}
                >
                  <FaPen />
                </button>
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
                <div className={`${styles.profAvatarLg} text-capitalize`}>
                  {accountDetail?.data?.name?.charAt(0) || "U"}
                </div>
                <h2 className={`${styles.profName} text-capitalize`}>
                  {accountDetail?.data?.name}
                </h2>
                <p className={`${styles.profCompany} text-capitalize`}>
                  {accountDetail?.data?.company_name}
                </p>
                <div className={styles.profFooter}>
                  <span className={styles.profId}>
                    Partner ID : {accountDetail?.data?.partner_id}
                  </span>
                  <span
                    className={`statusBadge primaryBg ${styles.adminBadge}`}
                  >
                    {accountDetail?.data?.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-8 col-12">
            <div className={`${styles.detailCard} p-sm-4 p-3`}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardHead}>Company Detail</h2>
              </div>

              <div className="row gy-3">
                <div className="col-md-6">
                  <div className={styles.infoItem}>
                    <small className={styles.infoLabel}>Company Name</small>
                    <div
                      className={`${styles.infoValue} d-flex align-items-center flex-wrap gap-2`}
                    >
                      <span className="text-capitalize">
                        {displayProfile.companyName}
                      </span>
                      {displayProfile.isVerified && (
                        <span
                          className={`statusBadge subtleSuccess ${styles.verifiedBadge}`}
                        >
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className={styles.infoItem}>
                    <small className={styles.infoLabel}>Company Address</small>
                    <div className={styles.infoValue}>
                      {displayProfile.companyAddress}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className={`${styles.detailCard} p-sm-4 p-3`}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardHead}>Personal information</h2>
              </div>

              <div className="row gy-3">
                <div className="col-md-6">
                  <div className={styles.infoItem}>
                    <small className={styles.infoLabel}>Full Name</small>
                    <div className={`${styles.infoValue} text-capitalize`}>
                      {displayProfile.fullName}
                    </div>
                  </div>
                  <div className={`${styles.infoItem} mb-0`}>
                    <small className={styles.infoLabel}>Mobile No.</small>
                    <div className={styles.infoValue}>{displayProfile.mobile}</div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className={styles.infoItem}>
                    <small className={styles.infoLabel}>Email</small>
                    <div className={styles.infoValue}>{displayProfile.email}</div>
                  </div>
                  <div className={`${styles.infoItem} mb-0`}>
                    <small className={styles.infoLabel}>GSTIN</small>
                    <div className={`${styles.infoValue} text-uppercase`}>
                      {displayProfile.gstin}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditOpen && (
        <CustomPopup
          onClose={handleCloseEdit}
          maxWidth="560px"
          title="Edit Profile"
        >
          <form className={styles.editForm}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="fullName">
                  Full Name
                  <span className={styles.required}>*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  className="form-control"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="companyName">
                  Company Name
                  <span className={styles.required}>*</span>
                </label>
                <input
                  id="companyName"
                  type="text"
                  name="companyName"
                  className="form-control"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  disabled
                />
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.formLabel} htmlFor="companyAddress">
                  Company Address
                  <span className={styles.required}>*</span>
                </label>
                <textarea
                  id="companyAddress"
                  name="companyAddress"
                  className={`form-control ${styles.textarea}`}
                  value={formData.companyAddress}
                  onChange={handleChange}
                  required
                  disabled
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="mobile">
                  Mobile No.
                  <span className={styles.required}>*</span>
                </label>
                <input
                  id="mobile"
                  type="tel"
                  name="mobile"
                  className="form-control"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="email">
                  Email
                  <span className={styles.required}>*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.formLabel} htmlFor="gstin">
                  GSTIN
                  <span className={styles.required}>*</span>
                </label>
                <input
                  id="gstin"
                  type="text"
                  name="gstin"
                  className="form-control text-uppercase"
                  value={formData.gstin}
                  onChange={handleChange}
                  required
                  disabled
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={handleCloseEdit}
              >
                Cancel
              </button>
              <button type="button" className={styles.saveBtn}>
                Update
              </button>
            </div>
          </form>
        </CustomPopup>
      )}
    </div>
  );
};

export default AccountInfo;
