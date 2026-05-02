import React, { useEffect, useRef } from "react";
import Link from "next/link";
import styles from "@/components/layout/sidebar/Sidebar.module.css";
import {
  SIDEBAR_MENU_CONSTANTS,
  SIDEBAR_SERVICES_CONSTANTS,
} from "./SidebarConstant";
import { useRouter } from "next/router";
import { MdOutlineContactSupport } from "react-icons/md";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const router = useRouter();
  const sidebarRef = useRef(null);

  // Handle click outside to close sidebar
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

  return (
    <>
      {isSidebarOpen && (
        <div
          className={`${styles.sidebarOverlay} ${isSidebarOpen ? styles.show : ""}`}
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div
        ref={sidebarRef}
        className={`${styles.sideBar} ${isSidebarOpen ? styles.open : ""}`}
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
        <div className="d-flex flex-column gap-4 p-3">
          <div>
            <div className={`${styles.sideMenuHead} mb-2`}>MENU</div>

            <ul className={`${styles.sideMenuList} d-flex flex-column gap-1`}>
              {SIDEBAR_MENU_CONSTANTS?.map((menu, idx) => {
                const ICON = menu?.icon || "";
                return (
                  <li
                    className={`${styles.sideMenuItem}`}
                    key={idx}
                    onClick={() => router.push(menu?.href)}
                    style={{
                      background:
                        router?.pathname === menu?.href
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
                          color:
                            router?.pathname === menu?.href
                              ? "var(--whiteColor)"
                              : "var(--textBody)",
                        }}
                      >
                        {menu?.title}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* SERVICES */}
          <div>
            <div className={`${styles.sideMenuHead} mb-2`}>SERVICES</div>

            <ul className={`${styles.sideMenuList} d-flex flex-column gap-1`}>
              {SIDEBAR_SERVICES_CONSTANTS?.map((menu, idx) => {
                return (
                  <li
                    className={`${styles.sideMenuItem}`}
                    key={idx}
                    onClick={() => {
                      router.push(menu?.href);
                    }}
                    style={{
                      background:
                        `/services/${router?.query?.slug}` === menu?.href
                          ? "var(--primaryColor)"
                          : "transparent",
                    }}
                  >
                    <button
                      className={`${styles.menuLink} d-flex align-items-center gap-3`}
                    >
                      <span className={`${styles.iconCircle} `}>
                        {menu?.image}
                      </span>
                      <span
                        className={`${styles.menuLabel}`}
                        style={{
                          color:
                            `/services/${router?.query?.slug}` === menu?.href
                              ? "var(--whiteColor)"
                              : "var(--textBody)",
                        }}
                      >
                        {menu?.title}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="d-flex flex-column gap-4 p-3 mt-auto">
          <Link href="#" className="btn btnWhite">
            <MdOutlineContactSupport size={18} className="me-2" />
            <span>SUPPORT</span>
          </Link>

          <div className={`${styles.creditBox} py-2`}>
            <div
              className={` ${styles.titleBar} px-3 py-1 mb-2 d-flex align-items-center`}
            >
              <span className="col">CREDITS</span>
              <Link href="#">PAY NOW</Link>
            </div>

            <div className="px-3">
              <div className={styles.credBaln}>
                Balance
                <span className={`${styles.credBalnvalue} d-block`}>
                  ₹ 5,50,00.00
                </span>
              </div>

              <div className={`${styles.credScale} my-2`}>
                <div
                  className={styles.credscaleBar}
                  style={{ width: "55%" }}
                ></div>
              </div>

              <div
                className={`${styles.credLimits} d-flex justify-content-between`}
              >
                <div>Used ₹ 4,50,000 of ₹ 10,00,000</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
