import Link from "next/link";
import React from "react";
import { BiKey } from "react-icons/bi";
import { FaRegCircleUser } from "react-icons/fa6";
import { RiBankLine } from "react-icons/ri";
import { LuCalendarCog } from "react-icons/lu";
import { IoHelpBuoyOutline } from "react-icons/io5";
import styles from "@/components/user-profile-layout/userProfileLayout.module.css";
import { useRouter } from "next/router";

const UserProfileLayout = ({ children }) => {
  const router = useRouter();
  return (
    <div className={styles.userProfileLayout}>
      <div className={styles.userProfileHeader}>
        <span style={{ fontSize: "12px" }}>Dashboard / My Account / </span>
        <p
          style={{
            textTransform: "capitalize",
            fontWeight: "600",
            fontSize: "20px",
          }}
        >
          {router?.pathname?.split("/")?.pop()?.replace("-", " ")}
        </p>
      </div>
      <div className={` ${styles.userProfileContentRow}`}>
        <div className={` ${styles.userProfileContent}`}>{children}</div>
        <div className={styles.userProfileMenuWrapper}>
          <ul className={`${styles.userProfileMenu} d-flex flex-column gap-3`}>
            <li>
              <Link href="/notifications">
                <FaRegCircleUser size={16} className="me-2" />
                Account Information
              </Link>
            </li>
            <li>
              <Link href="/notifications">
                <BiKey size={16} className="me-2" />
                Change Password
              </Link>
            </li>
            <li>
              <Link href="/notifications">
                <RiBankLine size={16} className="me-2" />
                Bank Details
              </Link>
            </li>
            <li>
              <Link href="/notifications">
                <LuCalendarCog size={16} className="me-2" />
                Notifications Settings
              </Link>
            </li>
            <li>
              <Link href="/notifications">
                <IoHelpBuoyOutline
                  size={16}
                  className="me-2"
                  style={{ transform: "rotate(45deg)" }}
                />
                Help Center
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserProfileLayout;
