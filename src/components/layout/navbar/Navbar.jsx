import React, { useEffect, useState, useRef } from "react";
import { BiChevronDown, BiPowerOff, BiSearch, BiX } from "react-icons/bi";
import { BsHandbag } from "react-icons/bs";
import { FiBell, FiPackage, FiTrash2 } from "react-icons/fi";
import logo from "@/assets/signup/signupLogo.png";
import createBtnBg from "@/assets/summary-count/createBtnBg.svg";
import Image from "next/image";
import Cookies from "js-cookie";
import { RxHamburgerMenu } from "react-icons/rx";
import Link from "next/link";
import styles from "@/components/layout/navbar/Navbar.module.css";
import { useRouter } from "next/router";
import { useToast } from "@/custom-hooks/toast/ToastProvider";
import { createPortal } from "react-dom";
import {
  useDeleteNotificationMutation,
  useGetNotificationListMutation,
  useMarkNotificationAsReadMutation,
} from "@/redux/apis/notificationApi";
import { useDispatch, useSelector } from "react-redux";
import { selectUserData } from "@/redux/slices/userSlice";
import { useGetBalanceAndCartDetailsQuery } from "@/redux/apis/balanceAndCartApi";
import usePermissions from "@/custom-hooks/permissions/usePermissions";
import { ACCOUNT_MENU_CONSTANTS } from "../sidebar/SidebarConstant";
import { useSearchQuery } from "@/redux/apis/searchApi";

const formatNotificationTime = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

const Navbar = ({ isSidebarOpen, setIsSidebarOpen, balanceAndCartData }) => {
  const router = useRouter();
  const userData = Cookies.get("userData")
    ? JSON.parse(decodeURIComponent(Cookies.get("userData")))
    : {};
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationSidebarOpen, setIsNotificationSidebarOpen] =
    useState(false);
  const [notificationFilter, setNotificationFilter] = useState("all");
  const [isClient, setIsClient] = useState(false);
  const dropdownRef = useRef(null);
  const userInfo = useSelector(selectUserData);
  const { canAdd, canDelete, canEdit, canView } = usePermissions();
  const [searchQuery, setSearchQuery] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");

  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);

  const {
    currentData: searchData,
    isFetching: isSearchLoading,
    isError: isSearchError,
  } = useSearchQuery(
    { query: debounceSearch },
    { skip: debounceSearch === "" },
  );

  const searchPayload = searchData?.data || searchData;
  const searchResults = Array.isArray(searchPayload?.list)
    ? searchPayload.list
    : searchPayload?.results?.flatMap((item) => item?.items || []) || [];

  const [
    getNotificationList,
    {
      data: notificationList,
      isLoading: isNotificationListLoading,
      isError,
      error,
    },
  ] = useGetNotificationListMutation();

  const { data: balanceAndCartDatas, refetch: balanceCartRefetch } =
    useGetBalanceAndCartDetailsQuery(
      { partner_id: userData?.id },
      {
        skip: !userData?.id,
      },
    );
  const [
    markNotificationAsRead,
    { isLoading: isMarkNotificationAsReadLoading },
  ] = useMarkNotificationAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const navmenu = ACCOUNT_MENU_CONSTANTS?.filter?.((item) =>
    canView(item?.key),
  );

  useEffect(() => {
    try {
      const cookie = Cookies.get("userData");
      if (cookie) {
        setUser(JSON.parse(cookie));
      }
    } catch (err) {
      console.log("Invalid cookie");
    }
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSignOut = () => {
    Cookies.remove("userData");
    Cookies.remove("customerData");
    Cookies.remove("partnerApproval");
    Cookies.remove("userToken");
    localStorage.removeItem("UP");
    router?.push("/auth/login");
    showToast("Signed Out successfully", "success");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    if (!isNotificationSidebarOpen) return undefined;

    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setIsNotificationSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isNotificationSidebarOpen]);

  useEffect(() => {
    if (!user?.id) return;

    getNotificationList({
      body: {
        partner_id: user?.id,
      },
    });
    balanceCartRefetch();
  }, [user?.id]);

  const handleDeleteNotification = async (notificationId, event) => {
    event.stopPropagation();
    if (!user?.id) return;

    try {
      const response = await deleteNotification({
        body: {
          partner_id: user?.id,
          notification_id: notificationId,
        },
      });
      console.log(response);
      if (response?.data?.success) {
        showToast("Notification deleted successfully", "success");
        getNotificationList({
          body: {
            partner_id: user?.id,
          },
        });
        setIsNotificationSidebarOpen(false);
      } else {
        showToast(
          response?.data?.message || "Failed to delete notification",
          "error",
        );
      }
    } catch (error) {
      console.log(error?.data?.message);
      showToast(
        error?.data?.message || "Failed to delete notification",
        "error",
      );
    }
  };

  const handleMarkNotificationAsRead = async (notification, event) => {
    event.stopPropagation();
    if (!user?.id) return;
    try {
      const {
        notification_id,
        customer_id,
        order_id,
        main_cart_id,
        order_sub_id,
        type,
        licenses,
        plan_id,
      } = notification;
      const response = await markNotificationAsRead({
        body: {
          partner_id: user?.id,
          notification_id: notification_id,
        },
      });
      console.log(response);
      if (response?.data?.success) {
        showToast("Notification marked as read", "success");

        if (type === "credit-note") {
          router.push({
            pathname: "/credit-notes",
            query: {
              customer_id: customer_id,
              order_id: order_id,
            },
          });
        } else if (main_cart_id) {
          router.push({
            pathname: "/order-summary",
            query: {
              type: type,
              order_id: order_id,
              order_sub_id: order_sub_id,
              licenses: licenses,
              customer_id: customer_id,
              main_cart_id: main_cart_id,
              planId: plan_id,
            },
          });
        } else {
          router.push(
            `/subscriptions/subscriptions-details?customerId=${customer_id}&orderId=${order_id}`,
          );
        }

        setIsNotificationSidebarOpen(false);
      } else {
        showToast(
          response?.data?.message || "Failed to mark notification as read",
          "error",
        );
      }
    } catch (error) {
      console.log(error);
      showToast(
        error?.data?.message || "Failed to mark notification as read",
        "error",
      );
    }
  };

  const notifications = notificationList?.data || [];
  const unreadCount = notificationList?.unread_count ?? 0;
  const displayedNotifications =
    notificationFilter === "unread"
      ? notifications.filter((notification) => !notification.is_read)
      : notifications;

  const handleGetNotificationList = async () => {
    try {
      const response = await getNotificationList({
        body: {
          partner_id: user?.id,
        },
      }).unwrap();

      if (response?.success) {
        setIsNotificationSidebarOpen(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (error?.status === 401) {
      Cookies.remove("userData");
      Cookies.remove("customerData");
      Cookies.remove("partnerApproval");
      Cookies.remove("userToken");
      localStorage.removeItem("UP");
      router?.push("/auth/login");
    }
  }, [error?.status === 401]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceSearch(searchQuery.trim());
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchQuery]);
  const handleSearchResultClick = (item) => {
    const type = String(item?.type || "").toLowerCase();

    if (type.includes("ticket")) {
      router.push(
        `/support/ticket-details?ticket_id=${encodeURIComponent(
          item?.ticket_id ?? item?.id ?? "",
        )}`,
      );
    } else if (type.includes("order")) {
      router.push({
        pathname: "/subscriptions/subscriptions-details",
        query: {
          orderId: item?.order_id ?? item?.id,
          customerId: item?.customer_id,
        },
      });
    } else if (type.includes("customers")) {
      router.push({
        pathname: "/customers/customer-details",
        query: {
          customerId: item?.customer_id,
        },
      });
    } else if (type.includes("users")) {
      router.push({
        pathname: "/user-detail",
        query: {
          partner_user_id: item?.id,
        },
      });
    } else {
      return;
    }

    setIsSearchDropdownOpen(false);
  };

  return (
    <>
      <header className={styles.pageHeader}>
        <div className="row align-items-center">
          <div className="col-auto">
            <div className={styles.pageLogoBox}>
              <Link href="/dashboard" className="d-inline-block">
                <Image
                  src={logo}
                  alt="logo"
                  className={styles.pageLogoImg}
                  title="Tizzy Partners"
                />
              </Link>
            </div>
          </div>
          <div className="col d-flex justify-content-end d-md-block ps-lg-4">
            <div className="row justify-content-md-between justify-content-end align-items-center">
              <div className="col-auto">
                <div
                  className={`${styles.pgSearchWrap} offcanvas-md offcanvas-top gap-3 gap-md-0`}
                  id="pageSearchMain"
                >
                  <search className={styles.pageSearchBox}>
                    <input
                      type="text"
                      className={`form-control ${styles.pageSearch}`}
                      placeholder="Search"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsSearchDropdownOpen(Boolean(e.target.value.trim()));
                      }}
                    />
                    <button
                      type="button"
                      className={styles.searchBtn}
                      aria-label="Search"
                    >
                      <BiSearch size={18} />
                    </button>
                  </search>
                  <button
                    type="button"
                    className="btn-close d-md-none"
                    data-bs-dismiss="offcanvas"
                    data-bs-target="#pageSearchMain"
                    aria-label="Close"
                  ></button>
                  {isSearchDropdownOpen &&
                    searchQuery.trim() === debounceSearch &&
                    debounceSearch &&
                    searchResults.length > 0 && (
                      <div className={styles.searchDd}>
                        {searchResults.map((item, index) => (
                          <button
                            type="button"
                            className={styles.searchResult}
                            key={`${item?.type || "result"}-${item?.id || index}`}
                            onClick={() => handleSearchResultClick(item)}
                          >
                            <BiSearch
                              className={styles.searchResultIcon}
                              size={16}
                            />
                            <span className={styles.searchResultText}>
                              <span className={styles.searchResultTitle}>
                                {item?.title}
                              </span>
                              {item?.subtitle && (
                                <span className={styles.searchResultSubtitle}>
                                  {item.subtitle}
                                </span>
                              )}
                            </span>
                            <span className={styles.searchResultType}>
                              {item?.type
                                ? `${String(item.type).charAt(0).toUpperCase()}${String(item.type).slice(1)}`
                                : ""}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  {isSearchDropdownOpen &&
                    searchQuery.trim() === debounceSearch &&
                    debounceSearch &&
                    !isSearchLoading &&
                    searchResults.length === 0 && (
                      <div className={styles.searchDd}>
                        <p className={styles.searchEmpty}>
                          {isSearchError
                            ? "Unable to load search results"
                            : "No results found"}
                        </p>
                      </div>
                    )}
                </div>
              </div>
              <div className="col-auto d-flex align-items-center">
                <div className="d-flex justify-content-between align-items-center headNavBtns gap-md-3 gap-2">
                  <div className="d-md-none">
                    <button
                      className={styles.navBtns}
                      data-bs-toggle="offcanvas"
                      data-bs-target="#pageSearchMain"
                    >
                      <BiSearch size={22} />
                    </button>
                  </div>
                  {canView("notification") && (
                    <div className="">
                      <button
                        className={styles.navBtns}
                        type="button"
                        onClick={handleGetNotificationList}
                      >
                        <FiBell size={20} />
                        {unreadCount > 0 && (
                          <span className={styles.navLabel}>{unreadCount}</span>
                        )}
                      </button>
                    </div>
                  )}
                  {canAdd("subscriptions") && (
                    <div className="">
                      <Link className={styles.navBtns} href="/order-summary">
                        <BsHandbag size={20} color="#000" />
                        <span className={`${styles.navLabel} `}>
                          {balanceAndCartData?.cart_item_count || 0}
                        </span>
                      </Link>
                    </div>
                  )}

                  <div className="vr"></div>
                  <div className={styles.profHolder} ref={dropdownRef}>
                    <div
                      className={`d-flex align-items-center ${styles.profDropdownToggle}`}
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <div
                        className={`${styles.profAvatar} ${styles.avatarColor_3} flex-shrink-0`}
                      >
                        {userInfo?.name?.[0] || user?.name?.[0]}
                      </div>
                      <div
                        className={`${styles.profUser} mx-2 d-none d-lg-block`}
                      >
                        <div
                          className={`${styles.profName} text-nowrap text-truncate`}
                        >
                          {userInfo?.name || user?.name}
                        </div>
                      </div>
                      <div className={`${styles.profArw} d-none d-lg-block`}>
                        <BiChevronDown />
                      </div>
                    </div>

                    <div
                      className={`${styles.dropdownMenu} shadow-lg ${isDropdownOpen ? styles.show : ""}`}
                    >
                      <div
                        className={`${styles.profDropdownMenu} position-relative d-flex flex-column justify-content-center align-items-center p-3 mb-3 gap-1 text-white`}
                      >
                        <Image
                          src={createBtnBg}
                          alt=""
                          width={500}
                          height={500}
                          className={styles.createBtnBg}
                        />
                        <Image
                          src={createBtnBg}
                          alt=""
                          width={500}
                          height={500}
                          className={styles.createBtnBg2}
                        />
                        <div
                          className={`${styles.profAvatar} ${styles.avatarColor_3}`}
                        >
                          {userInfo?.name?.[0] || user?.name?.[0] || "-"}
                        </div>
                        <div className={styles.profName}>
                          {" "}
                          {userInfo?.name || user?.name || "-"}
                        </div>
                        <div className={styles.profComp}>
                          {userInfo?.company_name || user?.company_name || "-"}
                        </div>
                        <div className={styles.profDesg}>
                          <span className={styles.profID}>
                            {`${user?.login_as === "partner_user" ? "User ID :" : "Partner ID :"} ${user?.login_as === "partner_user" ? user?.partner_user_id : userInfo?.id || user?.id || "-"}`}
                          </span>
                          <div className="statusBadge primaryBg profAdmin ms-1">
                            {user?.login_as?.replace("_", " ")?.toUpperCase()}
                          </div>
                        </div>
                      </div>
                      <ul className="my-3">
                        {navmenu?.map((item) => {
                          const ICON = item.icon;
                          return (
                            <li>
                              <Link href={item.href}>
                                <ICON
                                  className={`${styles.icon} me-2`}
                                  size={20}
                                />
                                <span>{item.title}</span>
                              </Link>
                            </li>
                          );
                        })}

                        {/* <li>
                          <a href="#">
                            <RiUserAddLine
                              className={`${styles.icon} me-2`}
                              size={20}
                            />
                            Add New User
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <LuUserRoundPen
                              className={`${styles.icon} me-2`}
                              size={20}
                            />
                            Manage Users
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <LuPencilRuler
                              className={`${styles.icon} me-2`}
                              size={20}
                            />
                            Customize Profile
                          </a>
                        </li> */}
                      </ul>
                      <div className="p-3 text-center subtleBg">
                        <button
                          type="button"
                          className="btn btnWhite w-100"
                          onClick={handleSignOut}
                        >
                          <BiPowerOff
                            className="icon"
                            size={20}
                            strokeWidth={0}
                          />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className={`${styles.hamburgerMenu}`}>
                    <button
                      className={`${styles.navBtns} p-1`}
                      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                      <RxHamburgerMenu size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {isClient &&
        createPortal(
          <>
            <div
              className={`${styles.cartSidebarOverlay} ${isNotificationSidebarOpen ? styles.showCartSidebar : ""}`}
              onClick={() => setIsNotificationSidebarOpen(false)}
            />
            <aside
              className={`${styles.cartSidebar} ${isNotificationSidebarOpen ? styles.showCartSidebar : ""}`}
            >
              <div className={styles.cartSidebarHeader}>
                <div className={styles.notificationHeaderTitle}>
                  <h6 className="mb-0">Notifications</h6>
                  {unreadCount > 0 && (
                    <span className={styles.notificationUnreadBadge}>
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  className={styles.cartSidebarCloseBtn}
                  onClick={() => setIsNotificationSidebarOpen(false)}
                  aria-label="Close notifications"
                >
                  <BiX size={20} />
                </button>
                <div className={styles.notificationFilterButtonsContainer}>
                  <button
                    type="button"
                    className={`${styles.notificationFilterButton} ${
                      notificationFilter === "all"
                        ? styles.notificationFilterButtonActive
                        : ""
                    }`}
                    onClick={() => setNotificationFilter("all")}
                  >
                    All
                    {notifications.length > 0 && (
                      <span className={styles.notificationFilterBadge}>
                        ({notifications.length})
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    className={`${styles.notificationFilterButton} ${
                      notificationFilter === "unread"
                        ? styles.notificationFilterButtonActive
                        : ""
                    }`}
                    onClick={() => setNotificationFilter("unread")}
                  >
                    Unread
                    {unreadCount > 0 && (
                      <span className={styles.notificationFilterBadge}>
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              <div className={styles.notificationSidebarBody}>
                {isNotificationListLoading ? (
                  <div className={styles.notificationLoading}>
                    {[1, 2, 3].map((item) => (
                      <div key={item} className={styles.notificationSkeleton} />
                    ))}
                  </div>
                ) : displayedNotifications.length === 0 ? (
                  <div className={styles.notificationEmpty}>
                    <FiBell size={36} />
                    <p>
                      {notificationFilter === "unread"
                        ? "No unread notifications"
                        : "No notifications yet"}
                    </p>
                    <span>
                      {notificationFilter === "unread"
                        ? "You're all caught up."
                        : "We'll notify you when something arrives."}
                    </span>
                  </div>
                ) : (
                  <ul className={styles.notificationList}>
                    {displayedNotifications?.map((notification) => (
                      <li
                        key={notification?.id}
                        className={`${styles.notificationItem} ${
                          !notification?.is_read
                            ? styles.notificationItemUnread
                            : ""
                        }`}
                        onClick={(e) => {
                          handleMarkNotificationAsRead(notification, e);
                        }}
                      >
                        <div className={styles.notificationIcon}>
                          <FiPackage size={16} />
                        </div>
                        <div className={styles.notificationContent}>
                          <div className={styles.notificationTopRow}>
                            <h6 className={styles.notificationTitle}>
                              {notification?.title}
                            </h6>
                            {!notification?.is_read && (
                              <span
                                className={styles.notificationDot}
                                aria-label="Unread"
                              />
                            )}
                          </div>
                          <p className={styles.notificationMessage}>
                            {notification?.message}
                          </p>
                          <span className={styles.notificationTime}>
                            {formatNotificationTime(notification?.created_at)}
                          </span>
                        </div>
                        {canDelete("notification") && (
                          <button
                            type="button"
                            className={styles.notificationDeleteBtn}
                            aria-label="Delete notification"
                            onClick={(e) =>
                              handleDeleteNotification(
                                notification?.notification_id,
                                e,
                              )
                            }
                          >
                            <FiTrash2 size={18} />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </aside>
          </>,
          document.body,
        )}
    </>
  );
};

export default Navbar;
