import React, { useMemo } from "react";
import CommonOrderSummary from "@/common-components/common-order-summary/CommonOrderSummary";
import styles from "./AllCart.module.css";
import { useRouter } from "next/router";

const CART_TABS = [
  { id: "microsoft", label: "Microsoft 365" },
  { id: "tizzy", label: "Tizzy Mail" },
];

const AllCart = () => {
  // const router = useRouter();
  // const activeTab = useMemo(() => {
  //   if (!router.isReady) return "";
  //   const t = router.query?.tab;
  //   if (typeof t === "string") return t;
  //   if (Array.isArray(t) && t[0]) return t[0];
  //   return "";
  // }, [router.isReady, router.query?.tab]);

  return (
    <div>
      {/* <div className={styles.toolbar}>
        <div className={styles.segmented}>
          <div
            className={styles.tabs}
            role="tablist"
            aria-label="Cart product type"
          >
            {CART_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`cart-tab-${tab.id}`}
                  aria-selected={isActive}
                  aria-controls="cart-order-panel"
                  tabIndex={isActive ? 0 : -1}
                  className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
                  onClick={() => {
                    router.push(`/my-cart?tab=${tab.id}`);
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div> */}

      <div
      // role="tabpanel"
      // id="cart-order-panel"
      // aria-labelledby={`cart-tab-${activeTab}`}
      // className={styles.tabPanel}
      >
        <CommonOrderSummary />
      </div>
    </div>
  );
};

export default AllCart;
