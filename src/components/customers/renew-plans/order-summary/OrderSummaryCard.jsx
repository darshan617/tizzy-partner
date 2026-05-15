import React, { useState } from "react";
import styles from "@/components/customers/renew-plans/order-summary/OrderSummaryCard.module.css";
import { FiCheck, FiInfo } from "react-icons/fi";
import CustomPopup from "@/common-components/custom-popup/CustomPopup";
import Image from "next/image";
import requestCredit from "@/assets/cart/request_credit.svg";

const OrderSummaryCard = ({
  _gstRate_ = 0.18,
  _creditBalance_ = 0,
  total,
  pricePerUser,
  setLisceneCounter,
  lisceneCounter,
  promoCode = 0,
  setPromoCode,
}) => {
  const gst = +(total * _gstRate_).toFixed(2);
  const totals = +(total + gst - promoCode).toFixed(2);
  const isInsufficient = _creditBalance_ < totals;
  const [isPromoCodeAdded, setIsPromoCodeAdded] = useState(false);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };
  return (
    <div>
      <div className={styles.card}>
        <div className={styles.cardTitle}>Order Summary</div>

        <div className={styles.summaryRow}>
          <span className={styles.label}>Subtotal</span>
          <span className={styles.value}>₹ {total?.toFixed(2)}</span>
        </div>

        <div className={styles.summaryRow}>
          <span className={styles.label}>
            Promo Code{" "}
            <button
              type="button"
              onClick={() => setIsPromoCodeAdded(!isPromoCodeAdded)}
              className={styles.addLinkBtn}
            >
              ({isPromoCodeAdded ? "Remove" : "Add"})
            </button>
          </span>

          <span className={styles.value}>₹ {promoCode.toFixed(2)}</span>
        </div>

        {isPromoCodeAdded && (
          <div className={styles.promoBox}>
            <input
              type="text"
              placeholder="Enter Promo Code"
              className={styles.promoInput}
            />

            <button type="button" className={styles.applyBtn}>
              Apply
            </button>
          </div>
        )}

        <div className={styles.summaryRow}>
          <span className={styles.label}>GST 18%</span>
          <span className={styles.value}>₹ {gst.toFixed(2)}</span>
        </div>

        <hr className={styles.divider} />

        <div className={styles.totalRow}>
          <span>TOTAL</span>
          <span>₹ {totals.toFixed(2)}</span>
        </div>

        <hr className={styles.dividerHeavy} />

        <div className={styles.creditBox}>
          {isInsufficient ? (
            <>
              <div className={`${styles.creditBalance}`}>
                <FiInfo size={15} />
                Credit Balance ₹{" "}
                {_creditBalance_.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </div>
              <div className={styles.creditWarning}>
                Insufficient credits to complete this purchase.
              </div>
            </>
          ) : (
            <form
              className={styles.singleInputForm}
              style={{ marginBottom: "16px" }}
            >
              <label
                htmlFor="aadhaarInput"
                style={{
                  display: "block",
                  marginBottom: "4px",
                  fontSize: "12px",
                  color: "#666666",
                  fontWeight: 400,
                }}
              >
                Enter Aadhar No. <span style={{ color: "red" }}>*</span>
              </label>
              <input
                id="aadhaarInput"
                type="text"
                placeholder=""
                title="Enter Aadhar number"
                className={styles.inputField}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  outline: "none",
                  fontSize: "15px",
                }}
              />
            </form>
          )}
        </div>

        <button className={styles.btnPrimary}>
          {isInsufficient ? "Clear Pending Invoices" : "Proceed"}
        </button>
        {isInsufficient && (
          <div className={styles.requestBox}>
            <p>Want to complete purchase urgently?</p>
            <button
              className={styles.requestLink}
              onClick={() => setIsPopupOpen(true)}
            >
              Request Credits
            </button>
          </div>
        )}
      </div>
      {isPopupOpen && (
        <CustomPopup onClose={handleClosePopup}>
          <div className={styles.creditRequestPopup}>
            <Image src={requestCredit} className="mb-3" alt="" />
            <h3 className={styles.creditRequestAmount}>
              ₹ {totals.toFixed(2)}
            </h3>
            <p className={styles.creditRequestTitle}>
              YOUR CREDIT REQUEST IS SENT SUCCESSFULLY.
            </p>
            <p className={styles.creditRequestDescription}>
              Your request has been sent for approval.
              <br />
              {"We'll notify you once it's approved."}
            </p>
          </div>
        </CustomPopup>
      )}
    </div>
  );
};

export default OrderSummaryCard;
