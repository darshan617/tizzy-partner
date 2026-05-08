import React, { useState } from "react";
import styles from "@/components/customers/renew-plans/renew-cart/RenewCart.module.css";
import Link from "next/link";
import CustomPopup from "@/common-components/custom-popup/CustomPopup";
import CustomerForm from "../../customer-form/CustomerForm";

const RenewCart = ({
  total,
  pricePerUser,
  setLisceneCounter,
  lisceneCounter,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };
  return (
    <div>
      <div className={styles.card}>
        <div className={styles.cartRow}>
          <div
            className={`${styles.servBadge} ${styles.tizzy}  flex-shrink-0`}
            title="Tizzy Mail"
          ></div>
          <div className={styles.productInfo}>
            <div className={styles.productName}>
              Tizzy® Mail Enterprise 100 GB
            </div>
            <Link
              href="https://goyalinfotech.com"
              className={styles.productLink}
            >
              goyalinfotech.com
            </Link>
            <div className={styles.productDate}>
              25 May, 2025 – 25 May, 2026
            </div>
          </div>

          <div className={styles.priceCol}>
            <div className={styles.colLabel}>Price</div>
            <div className={styles.priceVal}>₹ {pricePerUser?.toFixed(2)}</div>
            <div className={styles.priceSub}>per user/year</div>
          </div>

          <div className={styles.licenseCol}>
            <div className={styles.colLabel}>License</div>
            <div className={styles.qtyCtrl}>
              <button
                disabled={lisceneCounter === 1}
                onClick={() =>
                  lisceneCounter > 1 && setLisceneCounter((prev) => prev - 1)
                }
              >
                −
              </button>
              <input
                type="text"
                value={lisceneCounter}
                onChange={(e) => setLisceneCounter(Number(e.target.value))}
                className={styles.qtyInput}
                min={1}
              />
              <button onClick={() => setLisceneCounter((prev) => prev + 1)}>
                +
              </button>
            </div>
          </div>

          <div className={styles.totalCol}>
            <div className={styles.colLabel}>Total</div>
            <div className={styles.priceVal}>₹ {total.toFixed(2)}</div>
          </div>
          {/* 
          <button className={styles.removeBtn}>×</button> */}
        </div>

        <hr className={styles.divider} />

        <div className={styles.subtotalRow}>
          <span className={styles.subtotalLabel}>SUBTOTAL</span>
          <span className={styles.subtotalVal}>₹ {total.toFixed(2)}</span>
        </div>
      </div>

      <div className={styles.customerDetailsCard}>
        <div className={styles.customerDetailsHeader}>
          <h3 className={styles.customerDetailsTitle}>CUSTOMER DETAILS</h3>
          <button
            type="button"
            className={styles.newCustomerBtn}
            onClick={() => setIsPopupOpen(true)}
          >
            + New Customer
          </button>
        </div>

        <div className={styles.customerFieldsRow}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="companyName">
              Company Name <span className={styles.required}>*</span>
            </label>
            <input
              id="companyName"
              type="text"
              className={styles.fieldInput}
              placeholder="Enter Company Name"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="domainName">
              Domain <span className={styles.required}>*</span>
            </label>
            <input
              id="domainName"
              type="text"
              className={styles.fieldInput}
              placeholder="Enter Domain Name"
            />
          </div>
        </div>
      </div>

      {isPopupOpen && (
        <CustomPopup onClose={handleClosePopup}>
          <CustomerForm />
        </CustomPopup>
      )}
    </div>
  );
};

export default RenewCart;
