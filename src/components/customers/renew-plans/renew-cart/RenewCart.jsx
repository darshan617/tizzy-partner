import React, { useState } from "react";
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

const RenewCart = ({
  total,
  pricePerUser,
  setLisceneCounter,
  lisceneCounter,
  cartDetails,
  onLineLicensesChange,
  getAllCustomers,
  selectedCompany,
  setSelectedCompany,
  domainName,
  setDomainName,
  isGettingCartDetails,
  hideInlineSubtotal = false,
}) => {
  console.log("cartDetails", cartDetails);
  const router = useRouter();
  const { showToast } = useToast();
  const [isPopupOpen, setIsPopupOpen] = useState("");
  const [cartIdToDelete, setCartIdToDelete] = useState(null);
  const [deleteFromCart, { isLoading: isDeletingFromCart }] =
    useDeleteFromCartMutation();
  const handleClosePopup = () => {
    setIsPopupOpen("");
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

  const handleDeleteFromCart = async (cart_id) => {
    try {
      const res = await deleteFromCart({
        body: {
          cart_id,
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

  return (
    <>
      {isGettingCartDetails ? (
        <div className="d-flex justify-content-center align-items-center w-max-content mx-auto">
          <Loader />
        </div>
      ) : (
        <div>
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
                    onClick={() => setIsPopupOpen("new-customer")}
                  >
                    + New Customer
                  </button>
                </div>

                <div className={styles.customerFieldsRow}>
                  <CustomDropdown
                    options={companyNames}
                    value={selectedCompany || ""}
                    placeholder="Select Company Name"
                    label="Company Name"
                    onChange={(option) =>
                      setSelectedCompany(option?.label || "")
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
                </div>
              </div>
            </>
          )}

          {cartItemList.map((item, idx) => {
            console.log("item", item);
            const customerLimit =
              item?.customerLimit ?? item?.customer_limit ?? undefined;
            const lineKey = item?.cart_id ?? item?.id ?? idx;
            const unitPrice = listMode
              ? Number(item?.price_per_unit ?? item?.unit_price ?? 0) || 0
              : Number(pricePerUser) || 0;
            const lineLicenses = listMode
              ? Math.max(1, Number(item?.licenses) || 1)
              : Number(lisceneCounter) || 0;
            const lineTotal = unitPrice * lineLicenses;
            return (
              <div className={styles.card} key={lineKey}>
                <div className={styles.cartRow}>
                  {/* <div
                    className={`${styles.servBadge} ${styles.tizzy}  flex-shrink-0`}
                    title="Tizzy Mail"
                  ></div> */}
                  <div>
                    <span className={`${styles.iconCircle} `}>
                      {SIDEBAR_SERVICES_CONSTANTS.find(
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
                      router?.query?.variant !== "new-plan" && (
                        <p className={`${styles.productLink} m-0`}>
                          {item?.domain_name || "-"}
                        </p>
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
                    <div className={styles.qtyCtrl}>
                      <button
                        disabled={
                          (listMode
                            ? lineLicenses <= 1
                            : lisceneCounter === 1) ||
                          router?.query?.variant === "upgrade" ||
                          router?.query?.variant === "downgrade" ||
                          router?.query?.type === "renew-plan"
                        }
                        onClick={() => {
                          if (listMode) {
                            if (lineLicenses > 1) {
                              onLineLicensesChange?.(lineKey, lineLicenses - 1);
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
                        value={listMode ? lineLicenses || 1 : lisceneCounter}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (customerLimit == null || value <= customerLimit) {
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
                          router?.query?.variant === "downgrade" ||
                          router?.query?.type === "renew-plan"
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
                              onLineLicensesChange?.(lineKey, lineLicenses + 1);
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
                          router?.query?.variant === "downgrade" ||
                          router?.query?.type === "renew-plan"
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

                  <button
                    className={styles.removeBtn}
                    onClick={() => {
                      setIsPopupOpen("delete-cart");
                      setCartIdToDelete(item?.cart_id);
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })}
          {!hideInlineSubtotal && (
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

          {isPopupOpen === "new-customer" && (
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
                  onClick={() => handleDeleteFromCart(cartIdToDelete)}
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
