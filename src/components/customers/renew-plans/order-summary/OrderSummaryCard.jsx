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
  useCreditRequestMutation,
  useGenerateUpgradeOrderMutation,
  usePromoCodeMutation,
  useTransferCodeMutation,
} from "@/redux/apis/addToCartApi";
import { BiCheck, BiX } from "react-icons/bi";
import Cookies from "js-cookie";
import {
  selectIsPopupVisible,
  setIsPopupVisible,
} from "@/redux/slices/popupSlice";
import { useDispatch, useSelector } from "react-redux";
import { useGenerateNewOrderMutation } from "@/redux/apis/draftPoApi";

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
  handleAadharNumber,
  isAadharNumberLoading,
}) => {
  console.log("cartDetails", cartDetails);
  const dispatch = useDispatch();
  const isPopupVisible = useSelector(selectIsPopupVisible);
  const router = useRouter();
  const { showToast } = useToast();
  const userData = Cookies?.get("userData")
    ? JSON.parse(decodeURIComponent(Cookies?.get("userData")))
    : {};
  const savedDomainCount = toDomainArray(tempDomainNames).length;
  const pendingDomainCount = domainNames?.length || 0;
  const totalDomainCount = savedDomainCount + pendingDomainCount;
  const isMaxDomainsReached = totalDomainCount >= MAX_DOMAINS;
  const gst = +(total * _gstRate_).toFixed(2);

  const [isPromoCodeAdded, setIsPromoCodeAdded] = useState(false);
  const [domainInput, setDomainInput] = useState("");
  const [domainFromApi, setDomainFromApi] = useState(null);
  const [transferDomainInput, setTransferDomainInput] = useState("");
  const [discountedPercent, setDiscountedPercent] = useState(0);
  const [isTermsAndConditionsChecked, setIsTermsAndConditionsChecked] =
    useState(false);

  const providerId = Number(cartDetails?.[0]?.plan?.provider_id);
  const skipDomainVerification = providerId === 2;
  const tizzyProviderId = providerId === 1;
  const totals = +(total + gst - (discountedPercent / 100) * total).toFixed(2);
  const isInsufficient = _creditBalance_ < totals;

  const discountedAmount = (discountedPercent / 100) * total;

  const [transerCode, { isLoading: isLoadingTransferCode }] =
    useTransferCodeMutation();

  const [applyPromoCode, { isLoading: isLoadingPromoCode }] =
    usePromoCodeMutation();

  const [creditRequest, { isLoading: isLoadingCreditRequest }] =
    useCreditRequestMutation();

  const [generateNewOrder, { isLoading: isGeneratingNewOrder }] =
    useGenerateNewOrderMutation();

  const [generateUpgradeOrder, { isLoading: isGeneratingUpgradeOrder }] =
    useGenerateUpgradeOrderMutation();

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
    handleUpdateCart(resolvedCartId, domain, true);
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

  const mainCartId = Array.isArray(cartDetails)
    ? cartDetails[0]?.main_cart_id
    : cartDetails?.main_cart_id;

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

  const handlePromoCode = async () => {
    try {
      if (!promoCode) return;
      const res = await applyPromoCode({
        body: {
          code: promoCode,
        },
      });
      if (res?.data?.success) {
        setDiscountedPercent(res?.data?.data?.discount_percent);
        showToast("Promo code applied successfully", "success");
      } else {
        showToast("Failed to apply promo code", "error");
      }
    } catch (error) {
      console.log(error);
      showToast("Failed to apply promo code", "error");
    }
  };

  const handleRequestCredit = async () => {
    try {
      const res = await creditRequest({
        body: {
          partner_id: userData?.id,
          order_id: router?.query?.order_id,
          requested_amount: (totals - _creditBalance_).toFixed(2),
          main_cart_id: mainCartId,
        },
      });
      if (res?.data?.success) {
        showToast("Credit request sent successfully", "success");
        setIsPopupOpen("request-credit");
      } else {
        showToast("Failed to send credit request", "error");
      }
    } catch (error) {
      console.log(error);
      showToast("Failed to send credit request", "error");
    }
  };
  const isAadharRequired =
    router?.query?.type === "renew-plan" ||
    router?.query?.type === "upgrade" ||
    tempDomainNames?.length > 0;

  const handelProceed = async () => {
    try {
      const res = await generateNewOrder({
        body: {
          partner_id: userData?.id,
          main_cart_id: cartDetails?.[0]?.main_cart_id || cartDetails?.[0]?.renew_plan?.main_cart_id,
        },
      });
      if (res?.data?.success) {
        console.log("res?.data?.data", res?.data?.data);

        router?.push({
          pathname: "/draft-po",
          query: {
            pl: res?.data?.data?.po_link,
            sr: res?.data?.data?.sign_required === "yes" ? true : false,
            ordId: res?.data?.data?.order_id,
          },
        });
      } else {
        console.log(res?.error?.data?.message);
        showToast(res?.error?.data?.message, "error");
      }
    } catch (error) {
      console.log(error);
      showToast(error?.data?.message, "error");
    }
  };

  const handelUpgradeProceed = async () => {
    try {
      const res = await generateUpgradeOrder({
        body: {
          partner_id: userData?.id,
          main_cart_id: cartDetails?.[0]?.main_cart_id,
        },
      });
      if (res?.data?.success) {
        router?.push({
          pathname: "/draft-po",
          query: {
            pl: res?.data?.data?.po_link,
            sr: res?.data?.data?.sign_required === "yes" ? true : false,
            ordId: res?.data?.data?.order_id,
          },
        });
      } else {
        console.log(res?.error?.data?.message);
        showToast(res?.error?.data?.message, "error");
      }
    } catch (error) {
      console.log(error);
      showToast(error?.data?.message, "error");
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
              onClick={() => {
                if (isPromoCodeAdded) {
                  setPromoCode("");
                  setDiscountedPercent(0);
                  setIsPromoCodeAdded(false);
                } else {
                  setIsPromoCodeAdded(true);
                }
              }}
              className={styles.addLinkBtn}
            >
              ({isPromoCodeAdded ? "Remove" : "Add"})
            </button>
          </span>

          <span
            className={styles.value}
            style={{
              color:
                cartDetails?.[0]?.cart_discount_amount || discountedAmount > 0
                  ? "#2dc718"
                  : "#444444",
            }}
          >
            ₹ -
            {cartDetails?.[0]?.cart_discount_amount
              ? cartDetails?.[0]?.cart_discount_amount
              : discountedAmount?.toFixed(2) || 0}
          </span>
        </div>

        {isPromoCodeAdded && (
          <div className={styles.promoBox}>
            <input
              type="text"
              placeholder="Enter Promo Code"
              className={styles.promoInput}
              value={promoCode}
              onChange={(e) => setPromoCode(e?.target?.value)}
            />

            <button
              type="button"
              className={styles.applyBtn}
              onClick={handlePromoCode}
              disabled={isLoadingPromoCode || !promoCode?.trim()}
              style={{
                opacity: isLoadingPromoCode || !promoCode?.trim() ? 0.5 : 1,
                cursor:
                  isLoadingPromoCode || !promoCode?.trim()
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {isLoadingPromoCode ? "Applying..." : "Apply"}
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
            // (router?.query?.type === "renew-plan" ||
            //   router?.query?.type === "upgrade" ||
            //   tempDomainNames?.length > 0) && (
            //   <form
            //     className={styles.singleInputForm}
            //     style={{ marginBottom: "16px" }}
            //   >
            //     <label
            //       htmlFor="aadhaarInput"
            //       style={{
            //         display: "block",
            //         marginBottom: "4px",
            //         fontSize: "12px",
            //         color: "#666666",
            //         fontWeight: 400,
            //       }}
            //       className="text-start"
            //     >
            //       Enter Aadhar No. <span style={{ color: "red" }}>*</span>
            //     </label>
            //     <input
            //       id="aadhaarInput"
            //       type="text"
            //       placeholder="XXXX-XXXX-XXXX"
            //       maxLength={14}
            //       inputMode="numeric"
            //       pattern="[0-9]*"
            //       title="Enter Aadhar number"
            //       className={styles.inputField}
            //       style={{
            //         width: "100%",
            //         padding: "10px 12px",
            //         borderRadius: "6px",
            //         border: "1px solid #d1d5db",
            //         outline: "none",
            //         fontSize: "15px",
            //       }}
            //       // value={aadharNumber}
            //       value={aadharNumber.replace(/(\d{4})(?=\d)/g, "$1 ")}
            //       // onChange={(e) => {
            //       //   const value = e.target.value.replace(/\D/g, "");
            //       //   setAadharNumber(value);
            //       // }}
            //       onChange={(e) => {
            //         const digits = e.target.value
            //           .replace(/\D/g, "")
            //           .slice(0, 12);
            //         setAadharNumber(digits);
            //       }}
            //     />

            //     <div className="form-check">
            //       <input
            //         type="checkbox"
            //         className="form-check-input"
            //         checked={isConcernedAboutAadhar}
            //         onChange={(e) =>
            //           setIsConcernedAboutAadhar(e.target.checked)
            //         }
            //       />
            //       <label className="form-check-label m-0 mt-1 small text-secondary text-start">
            //         I have read and agree to the{" "}
            //         <span
            //           className="text-primary"
            //           style={{ cursor: "pointer" }}
            //           onClick={() =>
            //             dispatch(setIsPopupVisible("terms-and-conditions"))
            //           }
            //         >
            //           {" "}
            //           Aadhaar Verification Consent.
            //         </span>{" "}
            //       </label>
            //     </div>
            //   </form>
            // )
            ""
          )}
        </div>

        <button
          className={styles.btnPrimary}
          // disabled={
          //   isInsufficient ||
          //   (router?.query?.type !== "renew-plan" &&
          //     router?.query?.type !== "upgrade" &&
          //     selectedCompany?.length < 1)
          // }
          disabled={
            (router?.query?.type !== "renew-plan" &&
              router?.query?.type !== "upgrade" &&
              selectedCompany?.length < 1) ||
            // (isAadharRequired && !isConcernedAboutAadhar) ||
            // isAadharNumberLoading
            isGeneratingUpgradeOrder ||
            isGeneratingNewOrder
          }
          style={{
            opacity:
              (router?.query?.type !== "renew-plan" &&
                router?.query?.type !== "upgrade" &&
                selectedCompany?.length < 1) ||
              isGeneratingUpgradeOrder ||
              isGeneratingNewOrder
                ? // (isAadharRequired && !isConcernedAboutAadhar) ||
                  // isAadharNumberLoading
                  0.5
                : 1,

            cursor:
              (router?.query?.type !== "renew-plan" &&
                router?.query?.type !== "upgrade" &&
                selectedCompany?.length < 1) ||
              isGeneratingUpgradeOrder ||
              isGeneratingNewOrder
                ? // (isAadharRequired && !isConcernedAboutAadhar) ||
                  // isAadharNumberLoading
                  "not-allowed"
                : "pointer",
          }}
          onClick={() => {
            // if (tempDomainNames?.length >= 1) {
            //   handleAadharNumber();
            // } else if (isInsufficient) {
            //   router?.push("/invoice");
            // } else {
            //   if (
            //     router?.query?.type === "renew-plan" ||
            //     router?.query?.type === "upgrade"
            //   ) {
            //     handleAadharNumber();
            //   } else {
            //     if (tizzyProviderId) {
            //       ensureDomainInputRow();
            //       setIsPopupOpen("new-service");
            //     } else {
            //       setIsPopupOpen("proceed");
            //     }
            //   }
            // }
            if (tempDomainNames?.length >= 1) {
              handelProceed();
            } else if (
              router?.query?.type === "renew-plan" ||
              router?.query?.type === "upgrade"
            ) {
              handelUpgradeProceed();
            } else if (isInsufficient) {
              router?.push("/invoice");
            } else {
              setIsPopupOpen("proceed");
            }
          }}
        >
          {isInsufficient
            ? "Clear Pending Invoices"
            : router?.query?.type === "renew-plan" ||
                router?.query?.type === "upgrade"
              ? isInsufficient
                ? "Clear Pending Invoices"
                : isGeneratingUpgradeOrder || isGeneratingNewOrder
                  ? "Processing..."
                  : "Proceed"
              : isGeneratingUpgradeOrder || isGeneratingNewOrder
                ? "Processing..."
                : "Proceed"}
        </button>

        {isInsufficient && (
          <div className={styles.requestBox}>
            <p>Want to complete purchase urgently?</p>
            <button
              className={styles.requestLink}
              onClick={handleRequestCredit}
            >
              Request Credits
            </button>
          </div>
        )}
      </div>
      {isPopupOpen === "request-credit" && (
        <CustomPopup onClose={handleClosePopup} maxWidth="500px">
          <div className={styles.creditRequestPopup}>
            <Image src={requestCredit} className="mb-3" alt="" />
            <h3 className={styles.creditRequestAmount}>
              ₹ {(totals - _creditBalance_).toFixed(2)}
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
                <div className="d-flex align-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    id="termsAndConditions"
                    name="termsAndConditions"
                    checked={isTermsAndConditionsChecked}
                    onChange={(e) =>
                      setIsTermsAndConditionsChecked(e.target.checked)
                    }
                  />
                  <label htmlFor="termsAndConditions">
                    I consent to the{" "}
                    <span
                      className="text-primary"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        dispatch(
                          setIsPopupVisible(
                            "terms-and-conditions-transfer-service",
                          ),
                        )
                      }
                    >
                      Terms and Conditions of Transfer Service
                    </span>
                  </label>
                </div>
                <button
                  type="button"
                  className={styles.proceedPopupActionBtn}
                  disabled={
                    !canConfirmTransferDomain || !isTermsAndConditionsChecked
                  }
                  style={{
                    opacity:
                      !canConfirmTransferDomain || !isTermsAndConditionsChecked
                        ? 0.5
                        : 1,
                    cursor:
                      !canConfirmTransferDomain || !isTermsAndConditionsChecked
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
      {/* {isPopupVisible === "terms-and-conditions" && (
        <CustomPopup
          onClose={() => dispatch(setIsPopupVisible(""))}
          maxWidth="400px"
        >
          <div className={styles.termsAndConditionsPopup}>
            <h4 className={styles.termsAndConditionsPopupTitle}>
              Aadhaar Verification Consent
            </h4>
            <p className="m-0 mt-3  text-secondary text-start">
              I hereby provide my voluntary consent to verify my identity using
              my Aadhaar number as per applicable regulations. I understand that
              my Aadhaar details will be used solely for identity verification
              purposes and will be handled securely in accordance with
              applicable data protection and privacy requirements.
            </p>
          </div>
        </CustomPopup>
      )} */}
      {isPopupVisible === "terms-and-conditions-transfer-service" && (
        <CustomPopup
          onClose={() => dispatch(setIsPopupVisible(""))}
          maxWidth="500px"
        >
          <div className={styles.termsAndConditionsPopup}>
            <h4 className={styles.termsAndConditionsPopupTitle}>
              Transfer Service Terms and Conditions
            </h4>
            <p className="m-0 mt-3  text-secondary text-start">
              We securely migrate all your email accounts from your current
              provider. No data loss - all emails, files, and settings remain
              intact. Your admin account and login credentials stay unchanged.
              Minimal to zero downtime during the transfer. <br />
              <strong>Note:</strong> Your existing subscription tenure with the
              previous provider will not be carried forward.
            </p>
          </div>
        </CustomPopup>
      )}
    </div>
  );
};

export default OrderSummaryCard;
