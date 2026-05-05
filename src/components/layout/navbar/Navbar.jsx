import React, { useEffect, useState, useRef } from "react";
import { BiChevronDown, BiKey, BiPowerOff, BiSearch } from "react-icons/bi";
import { BsHandbag } from "react-icons/bs";
import { FiBell } from "react-icons/fi";
import { FaRegCircleUser } from "react-icons/fa6";
import logo from "@/assets/signup/signupLogo.png";
import Image from "next/image";
import Cookies from "js-cookie";
import { RxHamburgerMenu } from "react-icons/rx";
import Link from "next/link";
import { RiUserAddLine } from "react-icons/ri";
import styles from "@/components/layout/navbar/Navbar.module.css";
import { LuPencilRuler, LuUserRoundPen } from "react-icons/lu";
import { useRouter } from "next/router";
import { useToast } from "@/custom-hooks/toast/ToastProvider";

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const router = useRouter();
  const { showToast } = useToast();
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  const handleSignOut = () => {
    Cookies.remove("userData");
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

  return (
    <>
      <header className={styles.pageHeader}>
        <div className="row align-items-center">
          <div className="col-auto">
            <div className={styles.pageLogoBox}>
              <a href="index.html" className="d-inline-block">
                <Image
                  src={logo}
                  alt="logo"
                  className={styles.pageLogoImg}
                  title="Tizzy Partners"
                />
              </a>
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
                    />
                    <button className={styles.searchBtn}>
                      <Link className="icon" href="#">
                        <BiSearch size={18} />
                      </Link>
                    </button>
                  </search>
                  <button
                    type="button"
                    className="btn-close d-md-none"
                    data-bs-dismiss="offcanvas"
                    data-bs-target="#pageSearchMain"
                    aria-label="Close"
                  ></button>
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
                  <div className="">
                    <button className={styles.navBtns}>
                      <FiBell size={20} />
                      <span className={styles.navLabel}>5</span>
                    </button>
                  </div>
                  <div className="">
                    <button className={styles.navBtns}>
                      <BsHandbag size={20} />
                      <span className={`${styles.navLabel} d-none`}></span>
                    </button>
                  </div>
                  <div className="vr  "></div>
                  <div className={styles.profHolder} ref={dropdownRef}>
                    <div
                      className={`d-flex align-items-center ${styles.profDropdownToggle}`}
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <div
                        className={`${styles.profAvatar} ${styles.avatarColor_3} flex-shrink-0`}
                      >
                        {user?.name ? user?.name[0] : ""}
                      </div>
                      <div
                        className={`${styles.profUser} mx-2 d-none d-lg-block`}
                      >
                        <div
                          className={`${styles.profName} text-nowrap text-truncate`}
                        >
                          {user?.name ? user?.name : ""}
                        </div>
                      </div>
                      <div className={`${styles.profArw} d-none d-lg-block`}>
                        <BiChevronDown />
                      </div>
                    </div>

                    <div
                      className={`${styles.dropdownMenu} shadow-lg ${isDropdownOpen ? styles.show : ""}`}
                    >
                      <div className="d-flex flex-column justify-content-center align-items-center p-3 mb-3 gap-1 text-white bg-dark">
                        <div
                          className={`${styles.profAvatar} ${styles.avatarColor_3}`}
                        >
                          {user?.name ? user?.name[0] : ""}
                        </div>
                        <div className={styles.profName}>
                          {" "}
                          {user?.name ? user?.name : ""}
                        </div>
                        <div className={styles.profComp}>
                          {user?.company_name ? user?.company_name : ""}
                        </div>
                        <div className={styles.profDesg}>
                          <span className={styles.profID}>
                            {user?.id ? `Partner ID : ${user?.id}` : ""}
                          </span>
                          <div className="statusBadge primaryBg profAdmin ms-1">
                            Admin
                          </div>
                        </div>
                      </div>
                      <ul className="my-3">
                        <li>
                          <a href="#">
                            <FaRegCircleUser
                              className={`${styles.icon} me-2`}
                              size={20}
                            />
                            My Account
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <BiKey
                              className={`${styles.icon} me-2`}
                              size={20}
                            />
                            Change Password
                          </a>
                        </li>
                        <li>
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
                        </li>
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
                  <div className="d-lg-none">
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
    </>
  );
};

export default Navbar;
