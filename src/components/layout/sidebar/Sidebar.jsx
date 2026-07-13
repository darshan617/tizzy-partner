import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import styles from "@/components/layout/sidebar/Sidebar.module.css";
import {
  ACCOUNT_MENU_CONSTANTS,
  ACCOUNT_PATHS,
  SIDEBAR_MENU_CONSTANTS,
  SIDEBAR_SERVICES_CONSTANTS,
} from "./SidebarConstant";
import { useRouter } from "next/router";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, balanceAndCartData }) => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const sidebarRef = useRef(null);

  const creditLimit = Number(balanceAndCartData?.credit_limit || 0);
  const walletBalance = Number(balanceAndCartData?.wallet_balance || 0);
  const usedAmount = Math.max(creditLimit - walletBalance, 0);
  const creditUsed = Number(balanceAndCartData?.credit_used || 0);

  const usedPercentage = creditLimit > 0 ? (creditUsed / creditLimit) * 100 : 0;
  const isAccountPage = ACCOUNT_PATHS.includes(router?.pathname);

  const formatBalance = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatAmount = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    });

  const creditsCard = (
    <div className={styles.creditBox}>
      <div
        className={`${styles.titleBar} d-flex align-items-center justify-content-between`}
      >
        <span>CREDITS</span>
        <Link href="/invoice">PAY NOW</Link>
      </div>

      <div className={styles.creditBody}>
        <div className={styles.credBaln}>
          Balance
          <span className={styles.credBalnvalue}>
            ₹ {formatBalance(walletBalance)}
          </span>
        </div>

        <div className={styles.credScale}>
          <div
            className={styles.credscaleBar}
            style={{
              width: `${Math.min(usedPercentage, 100)}%`,
            }}
          />
        </div>

        <div className={styles.credLimits}>
          Used ₹{formatAmount(creditUsed)} of ₹{formatAmount(creditLimit)}
        </div>
      </div>
    </div>
  );

  const iconRail = (
    <div className={styles.iconRail}>
      <div>
        <div className={`${styles.sideMenuHead} mb-2`}>MENU</div>
        <ul className={`${styles.iconRailList} d-flex flex-column gap-1`}>
          {SIDEBAR_MENU_CONSTANTS?.map((menu, idx) => {
            const ICON = menu?.icon || "";
            const isActive = router?.pathname === menu?.href;
            return (
              <li key={idx}>
                <Link
                  href={menu?.href}
                  className={`${styles.iconRailItem} ${isActive ? styles.iconRailItemActive : ""}`}
                  title={menu?.title}
                >
                  <ICON size={18} />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <div className={`${styles.sideMenuHead} mb-2`}>SERVICES</div>
        <ul className={`${styles.iconRailList} d-flex flex-column gap-1`}>
          {SIDEBAR_SERVICES_CONSTANTS?.map((menu, idx) => {
            const isActive = `/services/${router?.query?.slug}` === menu?.href;
            return (
              <li key={idx}>
                <Link
                  href={menu?.href}
                  className={`${styles.iconRailItem} ${isActive ? styles.iconRailItemActive : ""}`}
                  title={menu?.title}
                >
                  <span className={styles.iconRailService}>{menu?.image}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );

  const accountPanel = (
    <div className={styles.accountPanel}>
      <ul className={styles.accountMenuList}>
        {ACCOUNT_MENU_CONSTANTS.map((item) => {
          const ICON = item.icon;
          const isActive = router?.pathname === item.href;
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                className={`${styles.accountMenuItem} ${isActive ? styles.accountMenuItemActive : ""}`}
              >
                <ICON size={20} className={styles.accountMenuIcon} />
                <span>{item.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      {creditsCard}
    </div>
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen, setIsSidebarOpen]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [router.pathname, setIsSidebarOpen]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <>
      {isSidebarOpen && (
        <div
          className={`${styles.sidebarOverlay} ${isSidebarOpen ? styles.show : ""}`}
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div
        ref={sidebarRef}
        className={`${styles.sideBar} ${isAccountPage ? styles.accountMode : ""} ${isSidebarOpen ? styles.open : ""}`}
      >
        <div
          className={`d-lg-none d-flex justify-content-end p-2 ${styles.closeButtonWrapper}`}
        >
          <button
            type="button"
            className="btn-close"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close"
          ></button>
        </div>

        {isAccountPage ? (
          <div className={styles.accountSidebarInner}>
            {iconRail}
            {accountPanel}
          </div>
        ) : (
          <>
            <div className="d-flex flex-column gap-4 p-3">
              <div>
                <div className={`${styles.sideMenuHead} mb-2`}>MENU</div>

                <ul
                  className={`${styles.sideMenuList} d-flex flex-column gap-1`}
                >
                  {SIDEBAR_MENU_CONSTANTS?.map((menu, idx) => {
                    const ICON = menu?.icon || "";
                    const isActive = router?.pathname === menu?.href;
                    return (
                      <Link
                        href={menu?.href}
                        className={`${styles.sideMenuItem} ${isActive ? styles.active : ""}`}
                        key={idx}
                        style={{
                          background: isActive
                            ? "var(--primaryColor)"
                            : "transparent",
                        }}
                      >
                        <button
                          className={`${styles.menuLink} d-flex align-items-center gap-3`}
                        >
                          <span className={`${styles.iconWrapper}`}>
                            <ICON size={20} />
                          </span>
                          <span
                            className={`${styles.menuLabel}`}
                            style={{
                              color: isActive
                                ? "var(--whiteColor)"
                                : "var(--textBody)",
                            }}
                          >
                            {menu?.title}
                          </span>
                        </button>
                      </Link>
                    );
                  })}
                </ul>
              </div>

              <div>
                <div className={`${styles.sideMenuHead} mb-2`}>SERVICES</div>

                <ul
                  className={`${styles.sideMenuList} d-flex flex-column gap-1`}
                >
                  {SIDEBAR_SERVICES_CONSTANTS?.map((menu, idx) => {
                    const isActive =
                      `/services/${router?.query?.slug}` === menu?.href;
                    return (
                      <Link
                        href={menu?.href}
                        className={`${styles.sideMenuItem} ${isActive ? styles.active : ""}`}
                        key={idx}
                        style={{
                          background: isActive
                            ? "var(--primaryColor)"
                            : "transparent",
                        }}
                      >
                        <button
                          className={`${styles.menuLink} d-flex align-items-center gap-3`}
                        >
                          <span
                            className={`${styles.iconCircle} ${isActive ? styles.active : ""}`}
                          >
                            {menu?.image}
                          </span>
                          <span
                            className={`${styles.menuLabel}`}
                            style={{
                              color: isActive
                                ? "var(--whiteColor)"
                                : "var(--textBody)",
                            }}
                          >
                            {menu?.title}
                          </span>
                        </button>
                      </Link>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="d-flex flex-column gap-4 p-3 mt-auto">
              {creditsCard}
            </div>
          </>
        )}
      </div>
    </>,
    document.body,
  );
};

export default Sidebar;
