import React, { useEffect, useState } from "react";
import styles from "@/components/customers/renew-plans/renew-cart/RenewCart.module.css";
import Link from "next/link";
import CustomPopup from "@/common-components/custom-popup/CustomPopup";
import CustomerForm from "../../customer-form/CustomerForm";
import { useRouter } from "next/router";
import CustomDropdown from "@/common-components/custom-dropdown/CustomDropdown";
import Loader from "@/common-components/loader/Loader";
import Image from "next/image";
import { SIDEBAR_SERVICES_CONSTANTS } from "@/components/layout/sidebar/SidebarConstant";
import { useDeleteFromCartMutation } from "@/redux/apis/addToCartApi";
import { useToast } from "@/custom-hooks/toast/ToastProvider";
import { IoClose } from "react-icons/io5";
import { IoMdArrowDown } from "react-icons/io";
import { Calendar } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsPopupVisible,
  setIsPopupVisible,
} from "@/redux/slices/popupSlice";

const toDomainArray = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
};

const RenewCart = ({
  total,
  pricePerUser,
  setLisceneCounter,
  lisceneCounter,
  cartDetails,
  onLineLicensesChange,
  getAllCustomers,
  selectedCompany,
  onCompanyChange,
  domainNames,
  setDomainNames,
  isGettingCartDetails,
  hideInlineSubtotal = false,
  isPopupOpen,
  setIsPopupOpen,
  tempDomainNames,
  setTempDomainNames,
  onRemoveDomain,
  currentPlanDetails,
}) => {
  const router = useRouter();
  const { showToast } = useToast();
  const isPopupVisiblle = useSelector(selectIsPopupVisible);
  const dispatch = useDispatch();
  console.log(isPopupVisiblle);
  useEffect(() => {
    console.log("cartDetails", cartDetails);
    console.log("transfer_domain", cartDetails?.[0]?.transfer_domain);
  }, [cartDetails]);

  const [cartToDelete, setCartToDelete] = useState({
    cart_id: null,
    main_cart_id: null,
  });
  const [deleteFromCart, { isLoading: isDeletingFromCart }] =
    useDeleteFromCartMutation();
  const handleClosePopup = () => {
    setIsPopupOpen("");
    dispatch(setIsPopupVisible(""));
  };
  const companyNames = getAllCustomers?.data?.customers?.map(
    (customer, index) => ({
      label: customer?.company,
      value: customer?.id || customer?.customer_id || customer?.company,
      idx: index,
    }),
  );

  const cartItemList = Array.isArray(cartDetails)
    ? cartDetails
    : cartDetails &&
        typeof cartDetails === "object" &&
        Object.keys(cartDetails).length > 0
      ? [cartDetails]
      : [];

  const listMode = Array.isArray(cartDetails);
  const domainList = toDomainArray(tempDomainNames);

  const handleDeleteFromCart = async (cart_id, main_cart_id) => {
    try {
      const res = await deleteFromCart({
        body: {
          cart_id,
          main_cart_id,
        },
      });
      if (res?.data?.success) {
        showToast("Plan deleted from cart", "success");
        router.reload();
      } else {
        showToast("Error deleting plan from cart", "error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteDomain = (domainToDelete) => {
    const updatedDomains = domainList.filter(
      (domain) => domain !== domainToDelete,
    );
    setTempDomainNames(updatedDomains);
    onRemoveDomain?.(updatedDomains);
  };

  useEffect(() => {
    if (cartItemList?.length > 0) {
      setTempDomainNames(toDomainArray(cartItemList[0]?.domain_name));
    }
  }, [cartItemList?.[0]?.cart_id]);

  console.log(currentPlanDetails, "currentPlanDetails");

  return (
    <>
      {isGettingCartDetails ? (
        <div className="d-flex justify-content-center align-items-center w-max-content mx-auto">
          <Loader />
        </div>
      ) : (
        <div>
          {(router?.query?.type === "upgrade" ||
            router?.query?.type === "downgrade") && (
            <div>
              <p>Company Name: {selectedCompany}</p>
            </div>
          )}
          {!router?.query?.type && (
            <>
              <div className={styles.customerDetailsCard}>
                <div className={styles.customerDetailsHeader}>
                  <h3 className={styles.customerDetailsTitle}>
                    CUSTOMER DETAILS
                  </h3>
                  <button
                    type="button"
                    className={styles.newCustomerBtn}
                    onClick={() => dispatch(setIsPopupVisible("new-customer"))}
                    disabled={selectedCompany}
                  >
                    + New Customer
                  </button>
                </div>

                <div className={styles.customerFieldsRow}>
                  {/* <CustomDropdown
                    options={companyNames}
                    value={selectedCompany || ""}
                    placeholder="Select Company Name"
                    label="Company Name"
                    onChange={(option) =>
                      onCompanyChange?.(option?.label || "", option?.value)
                    }
                  /> */}
                  <CustomDropdown
                    options={companyNames}
                    value={selectedCompany || ""}
                    placeholder="Select Company Name"
                    label="Company Name"
                    onChange={(option) =>
                      onCompanyChange?.(
                        option?.label || "",
                        option?.value || null,
                      )
                    }
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

                  {/* <div className={styles.fieldGroup}>
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
              </div> */}
                  {/* {cartItemList?.map(
                    (item) => item?.domain_name?.length > 0,
                  ) && ( */}
                  <div>
                    {domainList?.length > 0 && (
                      <div>
                        <p className={styles.domainNamesLabel}>
                          Domain Names{" "}
                          <span className={styles.required}>*</span>
                        </p>

                        {domainList?.map((domain, index) => (
                          <div
                            key={`${domain}-${index}`}
                            className={styles.domainNamesMainContainer}
                          >
                            <div className={styles.domainNameContainer}>
                              <p className="m-0">{domain}</p>

                              <button
                                type="button"
                                onClick={() => handleDeleteDomain(domain)}
                              >
                                <IoClose />
                              </button>
                            </div>
                          </div>
                        ))}
                        {/* {cartDetails?.[0]?.plan?.provider_id === 2 &&
                          domainList?.length < 3 && (
                            <button
                              type="button"
                              onClick={() => {
                                setDomainNames((prev) =>
                                  prev?.length > 0
                                    ? prev
                                    : [{ id: Date.now(), prefix: "" }],
                                );
                                setIsPopupOpen("new-service");
                              }}
                              className={styles.addDomainBtn}
                            >
                              Add New Domain +
                            </button>
                          )} */}
                        {cartDetails?.[0]?.plan?.provider_id === 2 &&
                          cartDetails?.[0]?.transfer_domain !== "yes" &&
                          domainList?.length < 3 && (
                            <button
                              type="button"
                              onClick={() => {
                                setDomainNames((prev) =>
                                  prev?.length > 0
                                    ? prev
                                    : [{ id: Date.now(), prefix: "" }],
                                );
                                setIsPopupOpen("new-service");
                              }}
                              className={styles.addDomainBtn}
                            >
                              Add New Domain +
                            </button>
                          )}
                      </div>
                    )}

                    {cartDetails?.[0]?.plan?.provider_id === 1 &&
                      domainList?.length < 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setDomainNames((prev) =>
                              prev?.length > 0
                                ? prev
                                : [{ id: Date.now(), prefix: "" }],
                            );
                            setIsPopupOpen("new-service");
                          }}
                          disabled={selectedCompany?.length < 1}
                          className={styles.addDomainBtn}
                          style={{
                            opacity: selectedCompany?.length < 1 ? 0.5 : 1,
                            cursor:
                              selectedCompany?.length < 1
                                ? "not-allowed"
                                : "pointer",
                          }}
                        >
                          Add New Domain +
                        </button>
                      )}
                  </div>
                </div>
              </div>
            </>
          )}
          {(router?.query?.type === "upgrade" ||
            router?.query?.type === "downgrade") && (
            <div className={styles.upgradePlansSection}>
              <div className={styles.upgradePlanCard}>
                <div className={styles.planCardHeader}>
                  <span className={styles.planCardTitle}>CURRENT PLAN</span>
                  <span className={styles.planCardDate}>
                    {currentPlanDetails?.subscription_start_date} –{" "}
                    {currentPlanDetails?.subscription_end_date}
                  </span>
                </div>
                <div className={styles.cartRow}>
                  <div>
                    <span className={styles.iconCircle}>
                      {SIDEBAR_SERVICES_CONSTANTS?.find(
                        (menu) =>
                          menu?.id ===
                          Number(
                            currentPlanDetails?.plan?.provider_id ||
                              currentPlanDetails?.plan_info?.provider_id ||
                              currentPlanDetails?.provider_id,
                          ),
                      )?.image || "-"}
                    </span>
                  </div>
                  <div className={styles.productInfo}>
                    <div className={styles.productName}>
                      {currentPlanDetails?.item_name || "-"}
                    </div>
                    {toDomainArray(currentPlanDetails?.domain_name)?.map(
                      (domain, index) => (
                        <p
                          key={`${domain}-${index}`}
                          className={`${styles.productLink} m-0`}
                        >
                          {domain || "-"}
                        </p>
                      ),
                    )}
                  </div>
                  <div className={styles.priceCol}>
                    <div className={styles.colLabel}>Price</div>
                    <div className={styles.priceVal}>
                      ₹ {Number(currentPlanDetails?.unit_price)?.toFixed(2)}
                    </div>
                    <div className={styles.priceSub}>per user/year</div>
                  </div>
                  <div className={styles.licenseCol}>
                    <div className={styles.colLabel}>License</div>
                    <div className={styles.licenseValue}>
                      {currentPlanDetails?.quantity || 1}
                    </div>
                  </div>
                  <div className={styles.totalCol}>
                    <div className={styles.colLabel}>Total</div>
                    <div className={styles.priceVal}>
                      ₹ {Number(currentPlanDetails?.total_amount)?.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className={styles.remainingBanner}>
                  Remaining :{" "}
                  <strong>{cartDetails?.[0]?.remaining_days || 0} days</strong>{" "}
                  |{" "}
                  <strong>
                    ₹{" "}
                    {Number(cartDetails?.[0]?.pro_rata_adjustment || 0).toFixed(
                      2,
                    )}
                  </strong>
                </div>
                <p className={styles.remainingNote}>
                  Note : Above amount is adjusted in your updated plan pricing,
                  while billing.
                </p>
              </div>

              <div className={styles.upgradeDivider}>
                <span className={styles.upgradeBadge}>
                  <IoMdArrowDown />
                  {router?.query?.type === "upgrade"
                    ? "Upgrading to"
                    : "Downgrading to"}
                </span>
              </div>

              {cartItemList?.map((item, idx) => {
                const customerLimit =
                  item?.customerLimit ?? item?.customer_limit ?? undefined;
                const lineKey = item?.cart_id ?? item?.id ?? idx;
                const unitPrice =
                  Number(item?.price_per_unit ?? item?.unit_price ?? 0) || 0;
                const lineLicenses = Math.max(
                  1,
                  Number(item?.licenses) || Number(lisceneCounter) || 1,
                );
                const lineTotal = unitPrice * lineLicenses;

                return (
                  <div
                    className={`${styles.upgradePlanCard} ${styles.upgradeNewPlanCard}`}
                    key={lineKey}
                  >
                    <div className={styles.planCardHeader}>
                      <span className={styles.planCardTitle}>NEW PLAN</span>
                    </div>
                    <div className={styles.cartRow}>
                      <div>
                        <span className={styles.iconCircle}>
                          {SIDEBAR_SERVICES_CONSTANTS?.find(
                            (menu) =>
                              menu?.id ===
                              Number(
                                item?.plan?.provider_id ||
                                  item?.plan_info?.provider_id ||
                                  item?.provider_id,
                              ),
                          )?.image || "-"}
                        </span>
                      </div>
                      <div className={styles.productInfo}>
                        <div className={styles.productName}>
                          {item?.plan_name || "-"}
                        </div>
                        <div className={styles.productDate}>
                          {item?.subscription_start_date} –{" "}
                          {item?.subscription_end_date}
                        </div>
                      </div>
                      <div className={styles.priceCol}>
                        <div className={styles.colLabel}>Price</div>
                        <div className={styles.priceVal}>
                          ₹ {unitPrice.toFixed(2)}
                        </div>
                        <div className={styles.priceSub}>per user/year</div>
                      </div>
                      <div className={styles.licenseCol}>
                        <div className={styles.colLabel}>License</div>
                        <div
                          className={`${styles.qtyCtrl} ${styles.planDetailQtyCtrl}`}
                        >
                          <button
                            disabled={lineLicenses <= 1}
                            onClick={() => {
                              const next = lineLicenses - 1;
                              onLineLicensesChange?.(lineKey, next);
                              setLisceneCounter(next);
                            }}
                            className={styles.qtyBtn}
                          >
                            −
                          </button>
                          <input
                            type="text"
                            value={lineLicenses}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              if (
                                customerLimit == null ||
                                value <= customerLimit
                              ) {
                                const next = Number.isFinite(value) ? value : 1;
                                onLineLicensesChange?.(lineKey, next);
                                setLisceneCounter(next);
                              }
                            }}
                            className={styles.qtyInput}
                            min={1}
                            max={customerLimit}
                          />
                          <button
                            onClick={() => {
                              if (customerLimit != null) {
                                if (lineLicenses < customerLimit) {
                                  const next = lineLicenses + 1;
                                  onLineLicensesChange?.(lineKey, next);
                                  setLisceneCounter(next);
                                }
                              } else {
                                const next = lineLicenses + 1;
                                onLineLicensesChange?.(lineKey, next);
                                setLisceneCounter(next);
                              }
                            }}
                            className={styles.qtyBtn}
                            disabled={
                              customerLimit != null &&
                              lineLicenses === customerLimit
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className={styles.totalCol}>
                        <div className={styles.colLabel}>Total</div>
                        <div className={styles.priceVal}>
                          ₹ {lineTotal.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {router?.query?.type !== "upgrade" &&
            router?.query?.type !== "downgrade" &&
            cartItemList?.length > 0 && (
              <div className={styles.planDetailSection}>
                <div className={styles.planDetailHeader}>
                  <h3 className={styles.planDetailTitle}>Plan Detail</h3>
                  {(cartItemList[0]?.subscription_start_date ||
                    cartItemList[0]?.subscription_end_date) && (
                    <span className={styles.billingCycleBadge}>
                      <Calendar size={14} />
                      Billing Cycle: {
                        cartItemList[0]?.subscription_start_date
                      }{" "}
                      - {cartItemList[0]?.subscription_end_date}
                    </span>
                  )}
                </div>

                <div className={styles.planDetailList}>
                  {cartItemList.map((item, idx) => {
                    const customerLimit =
                      item?.customerLimit ?? item?.customer_limit ?? undefined;
                    const lineKey = item?.cart_id ?? item?.id ?? idx;
                    const unitPrice = listMode
                      ? Number(item?.price_per_unit ?? item?.unit_price ?? 0) ||
                        0
                      : Number(pricePerUser) || 0;
                    const lineLicenses = listMode
                      ? Math.max(1, Number(item?.licenses) || 1)
                      : Number(lisceneCounter) || 0;
                    const lineTotal = unitPrice * lineLicenses;

                    return (
                      <div className={styles.planDetailItem} key={lineKey}>
                        <div className={styles.cartRow}>
                          <div>
                            <span className={styles.iconCircle}>
                              {SIDEBAR_SERVICES_CONSTANTS?.find(
                                (menu) =>
                                  menu?.id ===
                                  Number(
                                    item?.plan?.provider_id ||
                                      item?.plan_info?.provider_id ||
                                      item?.provider_id,
                                  ),
                              )?.image || "-"}
                            </span>
                          </div>
                          <div className={styles.productInfo}>
                            <div className={styles.productName}>
                              {item?.plan_name || "-"}
                            </div>
                            {item?.domain_name &&
                              toDomainArray(item?.domain_name)?.map(
                                (domain, index) => (
                                  <p
                                    key={`${domain}-${index}`}
                                    className={`${styles.productLink} m-0`}
                                  >
                                    {domain || "-"}
                                  </p>
                                ),
                              )}
                            <div className={styles.productDate}>
                              {item?.subscription_start_date} –{" "}
                              {item?.subscription_end_date}
                            </div>
                          </div>

                          <div className={styles.priceCol}>
                            <div className={styles.colLabel}>Price</div>
                            <div className={styles.priceVal}>
                              ₹ {unitPrice.toFixed(2)}
                            </div>
                            <div className={styles.priceSub}>per user/year</div>
                          </div>

                          <div className={styles.licenseCol}>
                            <div className={styles.colLabel}>License</div>
                            <div
                              className={`${styles.qtyCtrl} ${styles.planDetailQtyCtrl}`}
                            >
                              <button
                                disabled={
                                  (listMode
                                    ? lineLicenses <= 1
                                    : lisceneCounter === 1) ||
                                  router?.query?.variant === "upgrade" ||
                                  router?.query?.variant === "downgrade"
                                }
                                onClick={() => {
                                  if (listMode) {
                                    if (lineLicenses > 1) {
                                      onLineLicensesChange?.(
                                        lineKey,
                                        lineLicenses - 1,
                                      );
                                    }
                                  } else if (lisceneCounter > 1) {
                                    setLisceneCounter((prev) => prev - 1);
                                  }
                                }}
                                className={styles.qtyBtn}
                              >
                                −
                              </button>
                              <input
                                type="text"
                                value={
                                  listMode ? lineLicenses || 1 : lisceneCounter
                                }
                                onChange={(e) => {
                                  const value = Number(e.target.value);
                                  if (
                                    customerLimit == null ||
                                    value <= customerLimit
                                  ) {
                                    if (listMode) {
                                      onLineLicensesChange?.(
                                        lineKey,
                                        Number.isFinite(value) ? value : 1,
                                      );
                                    } else {
                                      setLisceneCounter(value);
                                    }
                                  }
                                }}
                                className={styles.qtyInput}
                                min={1}
                                max={customerLimit}
                                disabled={
                                  router?.query?.variant === "upgrade" ||
                                  router?.query?.variant === "downgrade"
                                }
                              />
                              <button
                                onClick={() => {
                                  if (listMode) {
                                    if (customerLimit != null) {
                                      if (lineLicenses < customerLimit) {
                                        onLineLicensesChange?.(
                                          lineKey,
                                          lineLicenses + 1,
                                        );
                                      }
                                    } else {
                                      onLineLicensesChange?.(
                                        lineKey,
                                        lineLicenses + 1,
                                      );
                                    }
                                  } else if (customerLimit != null) {
                                    if (lisceneCounter < customerLimit) {
                                      setLisceneCounter((prev) => prev + 1);
                                    }
                                  } else {
                                    setLisceneCounter((prev) => prev + 1);
                                  }
                                }}
                                className={styles.qtyBtn}
                                disabled={
                                  (listMode
                                    ? lineLicenses === customerLimit
                                    : lisceneCounter === customerLimit) ||
                                  router?.query?.variant === "upgrade" ||
                                  router?.query?.variant === "downgrade"
                                }
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className={styles.totalCol}>
                            <div className={styles.colLabel}>Plan Total</div>
                            <div className={styles.planTotalBox}>
                              ₹ {lineTotal.toFixed(2)}
                            </div>
                          </div>

                          {router?.query?.type !== "renew-plan" && (
                            <button
                              className={styles.removeBtn}
                              onClick={() => {
                                setIsPopupOpen("delete-cart");
                                setCartToDelete({
                                  cart_id: item?.cart_id,
                                  main_cart_id: item?.main_cart_id,
                                });
                              }}
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {!hideInlineSubtotal && (
                  <>
                    <hr className={styles.planDetailDivider} />
                    <div className={styles.planDetailSubtotal}>
                      <span className={styles.planDetailSubtotalLabel}>
                        Subtotal ({cartItemList.length})
                      </span>
                      <span className={styles.planDetailSubtotalVal}>
                        ₹ {(Number(total) || 0).toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}
          {!router?.query?.type &&
            cartDetails?.[0]?.plan?.provider_id !== 3 && (
              <>
                <button
                  className={`${styles.addMorePlansBtn} d-flex bg-transparent border-0  p-0 justify-content-end w-100`}
                  onClick={() => {
                    if (cartDetails?.[0]?.plan?.provider_id === 1) {
                      router.push("/services/tizzy");
                    } else if (cartDetails?.[0]?.plan?.provider_id === 2) {
                      router.push("/services/microsoft-solution-partner");
                    } else if (cartDetails?.[0]?.plan?.provider_id === 3) {
                      router.push("/services/google-workspace");
                    }
                  }}
                  style={{
                    cursor: "pointer",
                    color: "#0355ac",
                  }}
                >
                  + Add More Plans
                </button>
              </>
            )}

          {!hideInlineSubtotal && router?.query?.type === "upgrade" && (
            <>
              <hr className={styles.divider} />

              <div className={styles.subtotalRow}>
                <span className={styles.subtotalLabel}>SUBTOTAL</span>
                <span className={styles.subtotalVal}>
                  ₹ {(Number(total) || 0).toFixed(2)}
                </span>
              </div>
            </>
          )}

          {isPopupVisiblle === "new-customer" && (
            <CustomPopup onClose={handleClosePopup}>
              <h3 className="fs-5 fw-600 mb-3 border-bottom pb-3">
                Add New Customer
              </h3>
              <CustomerForm />
            </CustomPopup>
          )}
          {isPopupOpen === "delete-cart" && (
            <CustomPopup onClose={handleClosePopup}>
              <h3 className="fs-5 fw-600 mb-3 border-bottom pb-3">
                Delete Cart
              </h3>
              <p>Are you sure you want to delete the plan from the cart?</p>
              <div className="d-flex gap-2 justify-content-end">
                <button
                  onClick={() =>
                    handleDeleteFromCart(
                      cartToDelete?.cart_id,
                      cartToDelete?.main_cart_id,
                    )
                  }
                  className={`${styles.deleteBtn}`}
                >
                  Yes, Delete
                </button>
                <button
                  onClick={handleClosePopup}
                  className={`${styles.cancelBtn}`}
                >
                  Cancel
                </button>
              </div>
            </CustomPopup>
          )}
        </div>
      )}
    </>
  );
};

export default RenewCart;
