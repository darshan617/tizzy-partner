import React, { useState } from "react";
import styles from "@/components/customers/renew-plans/order-summary/OrderSummaryCard.module.css";
import { FiInfo, FiPlus } from "react-icons/fi";
import CustomPopup from "@/common-components/custom-popup/CustomPopup";
import Image from "next/image";
import requestCredit from "@/assets/cart/request_credit.svg";
import { useRouter } from "next/router";

const toDomainArray = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
};

const MAX_DOMAINS = 3;

const OrderSummaryCard = ({
  _gstRate_ = 0.18,
  _creditBalance_ = 0,
  total,
  pricePerUser,
  setLisceneCounter,
  lisceneCounter,
  promoCode = 0,
  setPromoCode,
  cartDetails,
  handleUpdateCart,
  setDomainNames,
  domainNames,
  domainSuffix,
  isPopupOpen,
  setIsPopupOpen,
  tempDomainNames,
  aadharNumber,
  setAadharNumber,
  selectedCompany,
}) => {
  const router = useRouter();
  const savedDomainCount = toDomainArray(tempDomainNames).length;
  const pendingDomainCount = domainNames?.length || 0;
  const totalDomainCount = savedDomainCount + pendingDomainCount;
  const isMaxDomainsReached = totalDomainCount >= MAX_DOMAINS;
  const gst = +(total * _gstRate_).toFixed(2);
  const totals = +(total + gst - promoCode).toFixed(2);
  const isInsufficient = _creditBalance_ < totals;
  const [isPromoCodeAdded, setIsPromoCodeAdded] = useState(false);

  const handleClosePopup = () => {
    setIsPopupOpen("");
  };

  const ensureDomainInputRow = () => {
    if (isMaxDomainsReached) return;
    setDomainNames((prev) =>
      prev?.length > 0 ? prev : [{ id: Date.now(), prefix: "" }],
    );
  };

  const handleAddDomainRow = () => {
    if (isMaxDomainsReached) return;
    setDomainNames((prev) => [...prev, { id: Date.now(), prefix: "" }]);
  };

  const resolvedCartId = Array.isArray(cartDetails)
    ? cartDetails[0]?.cart_id
    : cartDetails?.cart_id;

  const handleDomainPrefixChange = (id, value) => {
    setDomainNames((prev) =>
      prev.map((row) => (row.id === id ? { ...row, prefix: value } : row)),
    );
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
                value={aadharNumber}
                onChange={(e) => setAadharNumber(e.target.value)}
              />
            </form>
          )}
        </div>

        {/* <button
          className={styles.btnPrimary}
          onClick={() => {
            !isInsufficient && setIsPopupOpen("proceed");
          }}
        >
          {isInsufficient ? "Clear Pending Invoices" : "Proceed"}
        </button> */}
        <button
          className={styles.btnPrimary}
          disabled={aadharNumber?.length < 1 || selectedCompany?.length < 1}
          style={{
            opacity:
              aadharNumber?.length < 1 || selectedCompany?.length < 1 ? 0.5 : 1,
            cursor:
              aadharNumber?.length < 1 || selectedCompany?.length < 1
                ? "not-allowed"
                : "pointer",
          }}
          onClick={() => {
            if (tempDomainNames?.length >= 1) {
              router.push({
                pathname: "/verify-otp",
                query: {
                  type: "order",
                },
              });
            } else {
              if (
                router?.query?.type === "renew-plan" ||
                router?.query?.type === "upgrade"
              ) {
                router.push({
                  pathname: "/verify-otp",
                  query: {
                    type: "order",
                  },
                });
              } else {
                setIsPopupOpen("proceed");
              }
            }
          }}
        >
          {isInsufficient
            ? "Clear Pending Invoices"
            : router?.query?.type === "renew-plan" ||
                router?.query?.type === "upgrade"
              ? isInsufficient
                ? "Clear Pending Invoices"
                : "Proceed"
              : "Proceed"}
        </button>
        {isInsufficient && (
          <div className={styles.requestBox}>
            <p>Want to complete purchase urgently?</p>
            <button
              className={styles.requestLink}
              onClick={() => setIsPopupOpen("request-credit")}
            >
              Request Credits
            </button>
          </div>
        )}
      </div>
      {isPopupOpen === "request-credit" && (
        <CustomPopup onClose={handleClosePopup} maxWidth="200px">
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
      {isPopupOpen === "proceed" && (
        <CustomPopup onClose={handleClosePopup} maxWidth="400px">
          <div className={styles.proceedPopup}>
            <div className={styles.proceedPopupContent}>
              <h3 className={styles.proceedPopupTitle}>
                How would you like to continue?
              </h3>
              <p className={styles.proceedPopupSubtitle}>
                Choose an option to proceed with your order.
              </p>
            </div>
            <div className={styles.proceedPopupActions}>
              <button
                type="button"
                className={styles.proceedPopupActionBtn}
                onClick={handleClosePopup}
              >
                Transfer Service
              </button>
              <button
                type="button"
                className={styles.proceedPopupActionBtn}
                onClick={() => {
                  ensureDomainInputRow();
                  setIsPopupOpen("new-service");
                }}
              >
                New Service
              </button>
            </div>
          </div>
        </CustomPopup>
      )}
      {isPopupOpen === "new-service" && (
        <CustomPopup onClose={handleClosePopup} maxWidth="420px">
          <div className={styles.newServicePopup}>
            <div className={styles.newServicePopupHeader}>
              <h3 className={styles.newServicePopupTitle}>Add Domain</h3>
            </div>
            <div className={styles.newServicePopupBody}>
              {domainNames?.map((row) => (
                <>
                  <div key={row.id} className={styles.domainFieldRow}>
                    <input
                      type="text"
                      className={styles.domainFieldInput}
                      placeholder="Choose domain"
                      value={row.prefix}
                      onChange={(e) =>
                        handleDomainPrefixChange(row.id, e.target.value)
                      }
                      aria-label="Domain prefix"
                    />
                    {cartDetails?.[0]?.plan?.provider_id === 2 && (
                      <span className={styles.domainFieldSuffix}>
                        {domainSuffix}
                      </span>
                    )}
                  </div>
                </>
              ))}
            </div>
            {cartDetails?.[0]?.plan?.provider_id === 2 && (
              <div className={styles.addDomainIconBtnContainer}>
                <button
                  type="button"
                  className={styles.addDomainIconBtn}
                  onClick={handleAddDomainRow}
                  disabled={isMaxDomainsReached}
                >
                  {isMaxDomainsReached
                    ? "Maximum domains reached"
                    : "Add New Domain +"}
                </button>
              </div>
            )}

            <div className={styles.newServicePopupFooter}>
              <button
                type="button"
                className={styles.proceedPopupActionBtn}
                onClick={() => {
                  handleUpdateCart(resolvedCartId);
                  setIsPopupOpen("");
                }}
              >
                Done
              </button>
            </div>
          </div>
        </CustomPopup>
      )}
    </div>
  );
};

export default OrderSummaryCard;
