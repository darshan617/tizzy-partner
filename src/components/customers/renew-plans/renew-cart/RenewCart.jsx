import React, { useState } from "react";
import styles from "@/components/customers/renew-plans/renew-cart/RenewCart.module.css";
import Link from "next/link";
import CustomPopup from "@/common-components/custom-popup/CustomPopup";
import CustomerForm from "../../customer-form/CustomerForm";
import { useRouter } from "next/router";
import CustomDropdown from "@/common-components/custom-dropdown/CustomDropdown";

const RenewCart = ({
  total,
  pricePerUser,
  setLisceneCounter,
  lisceneCounter,
  cartDetails,
  getAllCustomers,
  selectedCompany,
  setSelectedCompany,
  domainName,
  setDomainName,
}) => {
  console.log(cartDetails, "cartDetails");
  const router = useRouter();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };
  const companyNames = getAllCustomers?.data?.customers?.map(
    (customer, index) => ({
      label: customer?.company,
      value: customer?.id || customer?.customer_id || customer?.company,
      idx: index,
    }),
  );
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
              {cartDetails?.plan_name || "-"}
            </div>
            {cartDetails?.domain_name &&
              router?.query?.variant !== "new-plan" && (
                <p className={`${styles.productLink} m-0`}>
                  {cartDetails?.domain_name || "-"}
                </p>
              )}
            <div className={styles.productDate}>
              {cartDetails?.subscription_start_date} –{" "}
              {cartDetails?.subscription_end_date}
            </div>
          </div>

          <div className={styles.priceCol}>
            <div className={styles.colLabel}>Price</div>
            <div className={styles.priceVal}>
              ₹ {(Number(pricePerUser) || 0).toFixed(2)}
            </div>
            <div className={styles.priceSub}>per user/year</div>
          </div>

          <div className={styles.licenseCol}>
            <div className={styles.colLabel}>License</div>
            <div className={styles.qtyCtrl}>
              <button
                disabled={
                  lisceneCounter === 1 ||
                  router?.query?.variant === "upgrade" ||
                  router?.query?.variant === "downgrade"
                }
                onClick={() =>
                  lisceneCounter > 1 && setLisceneCounter((prev) => prev - 1)
                }
                className={styles.qtyBtn}
              >
                −
              </button>
              <input
                type="text"
                value={lisceneCounter}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value <= cartDetails?.customerLimit) {
                    setLisceneCounter(value);
                  }
                }}
                className={styles.qtyInput}
                min={1}
                max={cartDetails?.customerLimit}
                disabled={
                  router?.query?.variant === "upgrade" ||
                  router?.query?.variant === "downgrade"
                }
              />
              <button
                onClick={() => {
                  if (cartDetails?.customerLimit) {
                    if (lisceneCounter < cartDetails.customerLimit) {
                      setLisceneCounter((prev) => prev + 1);
                    }
                  } else {
                    setLisceneCounter((prev) => prev + 1);
                  }
                }}
                className={styles.qtyBtn}
                disabled={
                  lisceneCounter === cartDetails?.customerLimit ||
                  router?.query?.variant === "upgrade" ||
                  router?.query?.variant === "downgrade"
                }
              >
                +
              </button>
            </div>
          </div>

          <div className={styles.totalCol}>
            <div className={styles.colLabel}>Total</div>
            <div className={styles.priceVal}>
              ₹ {(Number(total) || 0).toFixed(2)}
            </div>
          </div>

          {/* <button className={styles.removeBtn}>×</button> */}
        </div>

        <hr className={styles.divider} />

        <div className={styles.subtotalRow}>
          <span className={styles.subtotalLabel}>SUBTOTAL</span>
          <span className={styles.subtotalVal}>
            ₹ {(Number(total) || 0).toFixed(2)}
          </span>
        </div>
      </div>

      {router?.query?.variant === "new-plan" && (
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
            <CustomDropdown
              options={companyNames}
              value={selectedCompany}
              placeholder="Select Company Name"
              label="Company Name"
              onChange={(option) => setSelectedCompany(option?.label || "")}
            />
            {/* <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="companyName">
                Company Name <span className={styles.required}>*</span>
              </label>
              <input
                id="companyName"
                type="text"
                className={styles.fieldInput}
                placeholder="Enter Company Name"
              />
            </div> */}

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="domainName">
                Domain <span className={styles.required}>*</span>
              </label>
              <input
                id="domainName"
                type="text"
                className={styles.fieldInput}
                placeholder="Enter Domain Name"
                value={domainName}
                onChange={(e) => setDomainName(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {isPopupOpen && (
        <CustomPopup onClose={handleClosePopup}>
          <h3 className="fs-5 fw-600 mb-3 border-bottom pb-3">
            Add New Customer
          </h3>
          <CustomerForm />
        </CustomPopup>
      )}
    </div>
  );
};

export default RenewCart;
