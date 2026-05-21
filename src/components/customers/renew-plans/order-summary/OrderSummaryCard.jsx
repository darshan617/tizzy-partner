import React, { useEffect, useRef, useState } from "react";
import styles from "@/components/customers/renew-plans/order-summary/OrderSummaryCard.module.css";
import { FiCopy, FiInfo, FiPlus } from "react-icons/fi";
import { useToast } from "@/custom-hooks/toast/ToastProvider";
import CustomPopup from "@/common-components/custom-popup/CustomPopup";
import Image from "next/image";
import requestCredit from "@/assets/cart/request_credit.svg";
import { useRouter } from "next/router";
import {
  useCheckIsDomainAvailableQuery,
  useTransferCodeMutation,
} from "@/redux/apis/addToCartApi";
import { BiCheck, BiX } from "react-icons/bi";

const toDomainArray = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
};

const MAX_DOMAINS = 3;
const DOMAIN_DEBOUNCE_MS = 500;

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
  transferCode,
  setTransferCode,
}) => {
  const router = useRouter();
  const { showToast } = useToast();
  const savedDomainCount = toDomainArray(tempDomainNames).length;
  const pendingDomainCount = domainNames?.length || 0;
  const totalDomainCount = savedDomainCount + pendingDomainCount;
  const isMaxDomainsReached = totalDomainCount >= MAX_DOMAINS;
  const gst = +(total * _gstRate_).toFixed(2);
  const totals = +(total + gst - promoCode).toFixed(2);
  const isInsufficient = _creditBalance_ < totals;
  const [isPromoCodeAdded, setIsPromoCodeAdded] = useState(false);
  const [domainInput, setDomainInput] = useState("");
  const [domainFromApi, setDomainFromApi] = useState(null);
  const [transferDomainInput, setTransferDomainInput] = useState("");

  const providerId = Number(cartDetails?.[0]?.plan?.provider_id);
  const skipDomainVerification = providerId === 2;
  const tizzyProviderId = providerId === 1;

  const [transerCode, { isLoading: isLoadingTransferCode }] =
    useTransferCodeMutation();

  const {
    currentData: domainCheckData,
    error: domainCheckError,
    isFetching: isCheckingDomainAvailable,
    isLoading: isLoadingDomainChecking,
  } = useCheckIsDomainAvailableQuery(
    { domain_name: domainFromApi },
    {
      skip: skipDomainVerification || !domainFromApi?.trim(),
    },
  );

  const domainCheckResult = domainCheckError ?? domainCheckData;
  const trimmedDomainInput = domainInput?.trim() || "";
  const trimmedTransferInput = transferDomainInput?.trim() || "";
  const activeDomainPrefix =
    isPopupOpen === "transfer-service"
      ? trimmedTransferInput
      : isPopupOpen === "new-service"
        ? trimmedDomainInput
        : "";
  const trimmedDomainFromApi = domainFromApi?.trim() || "";
  const isDomainDebouncing =
    Boolean(activeDomainPrefix) && activeDomainPrefix !== trimmedDomainFromApi;
  const isDomainCheckInProgress =
    isDomainDebouncing || isLoadingDomainChecking || isCheckingDomainAvailable;
  const isDomainCheckSynced =
    Boolean(activeDomainPrefix) && activeDomainPrefix === trimmedDomainFromApi;
  const isDomainAvailable =
    isDomainCheckSynced &&
    (domainCheckResult?.data?.data?.available ||
      domainCheckResult?.data?.available);
  const domainCheckMessage =
    domainCheckResult?.message || domainCheckError?.data?.message;
  const hasDomainPrefixInput = domainNames?.some((row) =>
    Boolean(row?.prefix?.trim()),
  );
  const canConfirmDomain = skipDomainVerification
    ? hasDomainPrefixInput
    : isDomainAvailable;
  const canConfirmTransferDomain = skipDomainVerification
    ? Boolean(trimmedTransferInput)
    : isDomainAvailable;
  const showDomainCheckStatus =
    !skipDomainVerification &&
    Boolean(activeDomainPrefix) &&
    (isDomainCheckInProgress || Boolean(domainCheckResult));

  const handleClosePopup = () => {
    setIsPopupOpen("");
    setDomainInput("");
    setDomainFromApi(null);
    setTransferDomainInput("");
  };

  const handleCopyTransferIdentifier = async () => {
    if (!transferCode) return;
    try {
      await navigator.clipboard.writeText(String(transferCode));
      showToast("Identifier copied to clipboard", "success");
    } catch {
      showToast("Unable to copy identifier", "error");
    }
  };

  const handleTransferAccount = () => {
    const prefix = transferDomainInput?.trim();
    if (!prefix || !canConfirmTransferDomain) return;

    const domain = skipDomainVerification ? `${prefix}${domainSuffix}` : prefix;
    handleUpdateCart(resolvedCartId, domain);
    setTransferDomainInput("");
    setDomainFromApi(null);
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

  const handleTransferCode = async () => {
    try {
      const res = await transerCode({
        body: {
          provider_type: tizzyProviderId ? 1 : skipDomainVerification ? 2 : 3,
        },
      });
      if (res.data.success) {
        setTransferCode(res.data.data.code);
      } else {
        showToast("Failed to apply transfer code", "error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isPopupOpen !== "new-service" && isPopupOpen !== "transfer-service") {
      setDomainInput("");
      setDomainFromApi(null);
      return;
    }

    if (skipDomainVerification || !activeDomainPrefix) {
      setDomainFromApi(null);
      return;
    }

    const timer = setTimeout(() => {
      setDomainFromApi(activeDomainPrefix);
    }, DOMAIN_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [isPopupOpen, activeDomainPrefix, skipDomainVerification]);

  useEffect(() => {
    if (isPopupOpen === "new-service") {
      const activePrefix = domainNames?.[0]?.prefix ?? "";
      setDomainInput(activePrefix);
    }
  }, [isPopupOpen, domainNames]);

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
            tempDomainNames?.length > 0 && (
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
            )
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
          disabled={
            router?.query?.type === "renew-plan" ||
            router?.query?.type === "upgrade"
              ? false
              : selectedCompany?.length < 1
                ? true
                : false
          }
          style={{
            opacity: selectedCompany?.length < 1 ? 0.5 : 1,
            cursor: selectedCompany?.length < 1 ? "not-allowed" : "pointer",
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
                if (tizzyProviderId) {
                  ensureDomainInputRow();
                  setIsPopupOpen("new-service");
                } else {
                  setIsPopupOpen("proceed");
                }
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
                onClick={() => {
                  handleClosePopup();
                  setIsPopupOpen("transfer-service");
                  handleTransferCode();
                }}
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
                      onChange={(e) => {
                        const value = e.target.value;
                        handleDomainPrefixChange(row.id, value);
                        setDomainInput(value);
                      }}
                      aria-label="Domain prefix"
                    />
                    {skipDomainVerification && (
                      <span className={styles.domainFieldSuffix}>
                        {domainSuffix}
                      </span>
                    )}
                  </div>

                  {showDomainCheckStatus && (
                    <span
                      className={styles.domainFieldSuffix}
                      style={{
                        color: isDomainCheckInProgress
                          ? "#6b7280"
                          : isDomainAvailable
                            ? "green"
                            : "red",
                      }}
                    >
                      {isDomainCheckInProgress ? (
                        <span style={{ color: "#6b7280" }}>Checking...</span>
                      ) : (
                        <>
                          {isDomainAvailable ? <BiCheck /> : <BiX />}
                          {domainCheckMessage}
                        </>
                      )}
                    </span>
                  )}
                </>
              ))}
            </div>
            {skipDomainVerification && (
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
                disabled={!canConfirmDomain}
                style={{
                  opacity: !canConfirmDomain ? 0.5 : 1,
                  cursor: !canConfirmDomain ? "not-allowed" : "pointer",
                }}
                onClick={() => {
                  handleUpdateCart(resolvedCartId);
                  setDomainInput("");
                  setDomainFromApi(null);
                  setIsPopupOpen("");
                }}
              >
                Done
              </button>
            </div>
          </div>
        </CustomPopup>
      )}

      {isPopupOpen === "transfer-service" && (
        <CustomPopup onClose={handleClosePopup} maxWidth="900px">
          <div className={styles.transferServicePopup}>
            <div className={styles.transferServicePopupHeader}>
              <h3 className={styles.transferServicePopupTitle}>
                Transfer your{" "}
                {!skipDomainVerification ? "Google Workspace" : "Microsoft 365"}{" "}
                account
              </h3>
            </div>
            <div className={styles.transferServicePopupBody}>
              <div className={styles.transferServicePopupLeft}>
                <div className={styles.transferServiceSection}>
                  <p className={styles.transferServiceLabel}>Copy Identifier</p>
                  <p className={styles.transferServiceHint}>
                    {`Use this identifier to initiate the transfer from your
                    existing ${!skipDomainVerification ? "Google Workspace" : "Microsoft 365"} admin panel.`}
                  </p>
                  <div className={styles.transferIdentifierBox}>
                    <span className={styles.transferIdentifierValue}>
                      {isLoadingTransferCode
                        ? "Loading..."
                        : transferCode || "—"}
                    </span>
                    <button
                      type="button"
                      className={styles.transferCopyBtn}
                      onClick={handleCopyTransferIdentifier}
                      disabled={!transferCode}
                      aria-label="Copy identifier"
                    >
                      <FiCopy size={16} />
                    </button>
                  </div>
                </div>

                <div className={styles.transferServiceSection}>
                  <label
                    htmlFor="transferDomainInput"
                    className={styles.transferServiceLabel}
                  >
                    Enter your domain name
                  </label>
                  <div className={styles.domainFieldRow}>
                    <input
                      id="transferDomainInput"
                      type="text"
                      className={styles.domainFieldInput}
                      placeholder="Choose domain"
                      value={transferDomainInput}
                      onChange={(e) => setTransferDomainInput(e.target.value)}
                      aria-label="Domain prefix"
                    />
                    {skipDomainVerification && (
                      <span className={styles.domainFieldSuffix}>
                        {domainSuffix}
                      </span>
                    )}
                  </div>
                  {isPopupOpen === "transfer-service" &&
                    showDomainCheckStatus && (
                      <span
                        className={styles.domainFieldSuffix}
                        style={{
                          color: isDomainCheckInProgress
                            ? "#6b7280"
                            : isDomainAvailable
                              ? "green"
                              : "red",
                        }}
                      >
                        {isDomainCheckInProgress ? (
                          <span style={{ color: "#6b7280" }}>Checking...</span>
                        ) : (
                          <>
                            {isDomainAvailable ? <BiCheck /> : <BiX />}
                            {domainCheckMessage}
                          </>
                        )}
                      </span>
                    )}
                </div>

                <button
                  type="button"
                  className={styles.proceedPopupActionBtn}
                  disabled={!canConfirmTransferDomain}
                  style={{
                    opacity: !canConfirmTransferDomain ? 0.5 : 1,
                    cursor: !canConfirmTransferDomain
                      ? "not-allowed"
                      : "pointer",
                  }}
                  onClick={handleTransferAccount}
                >
                  Transfer My Account
                </button>
              </div>

              <div className={styles.transferServicePopupRight}>
                <div className={styles.transferInfoSection}>
                  <p className={styles.transferInfoTitle}>How does it work?</p>
                  <p className={styles.transferInfoText}>
                    We securely migrate all your email accounts from your
                    current provider
                  </p>
                  <p className={styles.transferInfoText}>
                    <strong>No data loss</strong> - all emails, files, and
                    settings remain intact
                  </p>
                  <p className={styles.transferInfoText}>
                    Your admin account and login credentials stay unchanged
                  </p>
                  <p className={styles.transferInfoText}>
                    Minimal to zero downtime during the transfer
                  </p>
                  <p className={styles.transferInfoText}>
                    <strong>Note:</strong> Your existing subscription tenure
                    with the previous provider will not be carried forward.
                  </p>
                </div>

                <div className={styles.transferInfoSection}>
                  <p className={styles.transferInfoTitle}>
                    Still have questions?
                  </p>
                  <p className={styles.transferInfoText}>
                    Our support team is here to assist you at every step.
                  </p>
                  <a href="#" className={styles.transferSupportLink}>
                    Contact our Support Team
                  </a>
                </div>
              </div>
            </div>
          </div>
        </CustomPopup>
      )}
    </div>
  );
};

export default OrderSummaryCard;
