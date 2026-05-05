import React from "react";
import styles from "@/components/customers/renew-plans/order-summary/OrderSummaryCard.module.css";
import { FiInfo } from "react-icons/fi";
import Link from "next/link";

const OrderSummaryCard = ({
  _subtotal_ = 10589.0,
  _gstRate_ = 0.18,
  _creditBalance_ = 9245.4,
}) => {
  const gst = +(_subtotal_ * _gstRate_).toFixed(2);
  const total = +(_subtotal_ + gst).toFixed(2);
  const isInsufficient = _creditBalance_ < total;

  return (
    <div>
      <div className={styles.card}>
        <div className={styles.cardTitle}>Order Summary</div>

        <div _className_={styles.summaryRow}>
          <span className={styles.label}>Subtotal</span>
          <span className={styles.value}>₹ {_subtotal_.toFixed(2)}</span>
        </div>

        <div className={styles.summaryRow}>
          <span className={styles.label}>
            Promo Code{" "}
            <Link href="#" className={styles.addLink}>
              ( Add )
            </Link>
          </span>
          <span className={styles.value}>₹ 0.00</span>
        </div>

        <div className={styles.summaryRow}>
          <span className={styles.label}>GST 18%</span>
          <span className={styles.value}>₹ {gst.toFixed(2)}</span>
        </div>

        <hr className={styles.divider} />

        <div className={styles.totalRow}>
          <span>TOTAL</span>
          <span>₹ {total.toFixed(2)}</span>
        </div>

        <hr className={styles.dividerHeavy} />

        <div className={styles.creditBox}>
          <div className={styles.creditBalance}>
            <FiInfo size={15} />
            Credit Balance ₹{" "}
            {_creditBalance_.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}
          </div>
          {isInsufficient && (
            <div className={styles.creditWarning}>
              Insufficient credits to complete this purchase.
            </div>
          )}
        </div>
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

        <button className={styles.btnPrimary}>Clear Pending Invoices</button>

        <div className={styles.requestBox}>
          <p>Want to complete purchase urgently?</p>
          <button className={styles.requestLink}>Request Credits</button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryCard;
