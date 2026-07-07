import React, { useState } from "react";
import Link from "next/link";
import { FaCheck, FaPen } from "react-icons/fa";
import { MdInfoOutline } from "react-icons/md";
import styles from "@/components/user-detail/UserDetail.module.css";
import createBtnBg from "@/assets/summary-count/createBtnBg.svg";
import { FiSmartphone } from "react-icons/fi";
import { RiMacbookLine } from "react-icons/ri";
import Image from "next/image";

const devices = [
  {
    name: "iPhone 15 Pro",
    location: "Dobivali, India",
    loginTime: "Today, 10:32AM",
    status: "Active",
  },
  {
    name: "MacBook Pro M2",
    location: "Dobivali, India",
    loginTime: "Today, 10:32AM",
    status: "1 hr ago",
  },
  {
    name: "iPhone 15 Pro",
    location: "Dobivali, India",
    loginTime: "Today, 10:32AM",
    status: "3 hr ago",
  },
];

const permissions = [
  {
    category: "Catalog Management",
    items: [
      { label: "Provider", access: [true, true, true, true] },
      { label: "Plan", access: [true, true, true, true] },
      { label: "Variant", access: [true, true, true, true] },
    ],
  },
  {
    category: "User Management",
    items: [
      { label: "Users", access: [true, true, true, true] },
      { label: "Role", access: [true, true, true, true] },
      { label: "Variants", access: [true, true, true, true] },
    ],
  },
  {
    category: "Master Data Management",
    items: [
      { label: "Popular Apps", access: [true, true, true, true] },
      { label: "Plan Categories", access: [true, true, true, true] },
      { label: "Subscriptions", access: [true, true, true, true] },
      { label: "Partner Approvals", access: [true, true, true, true] },
      { label: "Renewals", access: [true, true, true, true] },
      { label: "Transfer Order", access: [true, true, true, true] },
      { label: "Ticket List", access: [true, true, true, true] },
    ],
  },
  {
    category: "System Settings",
    items: [{ label: "General Settings", access: [true, true, true, true] }],
  },
  {
    category: "Transaction",
    items: [
      { label: "Orders", access: [true, false, true, true] },
      { label: "Billing & Invoices", access: [true, false, true, true] },
      { label: "Promocode", access: [true, false, true, true] },
      { label: "Credit Request", access: [true, false, true, true] },
    ],
  },
];

const actionColumns = ["View", "Add", "Edit", "Edit"];

const UserDetail = () => {
  const [permissionGroups, setPermissionGroups] = useState(permissions);

  const togglePermission = (groupCategory, itemLabel, accessIndex) => {
    setPermissionGroups((currentGroups) =>
      currentGroups.map((group) => {
        if (group.category !== groupCategory) {
          return group;
        }

        return {
          ...group,
          items: group.items.map((item) => {
            if (item.label !== itemLabel) {
              return item;
            }

            return {
              ...item,
              access: item.access.map((enabled, index) =>
                index === accessIndex ? !enabled : enabled,
              ),
            };
          }),
        };
      }),
    );
  };

  const togglePermissionRow = (groupCategory, itemLabel) => {
    setPermissionGroups((currentGroups) =>
      currentGroups.map((group) => {
        if (group.category !== groupCategory) {
          return group;
        }

        return {
          ...group,
          items: group.items.map((item) => {
            if (item.label !== itemLabel) {
              return item;
            }

            const nextValue = !item.access.every(Boolean);

            return {
              ...item,
              access: item.access.map(() => nextValue),
            };
          }),
        };
      }),
    );
  };

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/dashboard" className={styles.breadcrumbLink}>
          Dashboard
        </Link>
        <span className={styles.separator}>/</span>
        <span className={styles.breadcrumbMuted}>My Account</span>
        <span className={styles.separator}>/</span>
        <span className={styles.breadcrumbCurrent}>User Management</span>
      </div>

      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}>User detail</h1>
        </div>

        {/* <div className={styles.headerActions}>
          <button type="button" className={styles.editUserBtn}>
            <FaPen />
            Edit User
          </button>
        </div> */}
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <section className={styles.profileCard}>
            <div className={styles.creditPatternRight}>
                <Image src={createBtnBg} alt="" aria-hidden width={100} height={100} />
            </div>
            <div className={styles.profileHeader}>
              <div className={styles.avatar}>J</div>
              <div className={styles.profileMeta}>
                <div className={styles.nameRow}>
                  <h2 className={styles.profileName}>Priya Sharma</h2>
                  <span className={styles.employeeTag}>EMP-1042</span>
                </div>
                <p className={styles.profileRole}>
                  Senior Sales Executive - B2B Portal
                </p>
              </div>
              <button type="button" className={styles.profileEditBtn}>
                <FaPen />
              </button>
            </div>

            <div className={styles.profileInfoPanel}>
              <div className={styles.profileInfoGrid}>
                <div className={styles.infoBox}>
                  <span className={styles.infoLabel}>User ID</span>
                  <span className={styles.infoValue}>EMP-0112</span>
                </div>
                <div className={styles.infoBox}>
                  <span className={styles.infoLabel}>Mobile No.</span>
                  <span className={styles.infoValue}>+91 98123 46780</span>
                </div>
                <div className={styles.infoBox}>
                  <span className={styles.infoLabel}>Email</span>
                  <span className={styles.infoValue}>
                    janak@goyalinfotech.com
                  </span>
                </div>
                <div className={styles.infoBox}>
                  <span className={styles.infoLabel}>Last Login</span>
                  <span className={styles.infoValue}>Today, 10:32AM</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="col-lg-6">
          <section className={styles.deviceCard}>
            <div className={styles.cardHeadRow}>
              <h2 className={styles.cardTitle}>
                Device &amp; Login Information
              </h2>
              <button type="button" className={styles.deactivateBtn}>
            Deactivate
          </button>
            </div>

            <div className={styles.deviceList}>
              {devices.map((device) => (
                <article
                  key={`${device.name}-${device.status}`}
                  className={styles.deviceItem}
                >
                  <div className={styles.deviceIcon}>
                    {device.name === "iPhone 15 Pro" ? <FiSmartphone size={24} /> : <RiMacbookLine size={24} />}
                  </div>
                  <div className={styles.deviceContent}>
                    <p className={styles.deviceName}>{device.name}</p>
                    <p className={styles.deviceMeta}>
                      {device.location} . {device.loginTime}
                    </p>
                  </div>
                  <span
                    className={`${styles.deviceStatus} ${
                      device.status === "Active"
                        ? styles.deviceStatusActive
                        : styles.deviceStatusMuted
                    }`}
                  >
                    {device.status}
                  </span>
                </article>
              ))}
            </div>
          </section>
        </div>

        <div className="col-12">
          <section className={styles.permissionCard}>
            <div className={styles.permissionTable}>
              <div className={styles.tableHead}>
                <div className={styles.moduleHead}>Module</div>
                {actionColumns.map((label, index) => (
                  <div key={`${label}-${index}`} className={styles.actionHead}>
                    {label}
                  </div>
                ))}
              </div>

              {permissionGroups.map((group) => (
                <div key={group.category} className={styles.permissionGroup}>
                  <div className={styles.groupLabel}>{group.category}</div>

                  {group.items.map((item) => (
                    <div key={item.label} className={styles.permissionRow}>
                      <div className={styles.moduleCell}>
                        <button
                          type="button"
                          className={`${styles.moduleCheckbox} ${
                            item.access.every(Boolean)
                              ? styles.moduleCheckboxActive
                              : ""
                          }`}
                          onClick={() =>
                            togglePermissionRow(group.category, item.label)
                          }
                          aria-pressed={item.access.every(Boolean)}
                          aria-label={`Toggle all permissions for ${item.label}`}
                        >
                          {item.access.every(Boolean) ? <FaCheck /> : null}
                        </button>
                        <span>{item.label}</span>
                      </div>

                      {item.access.map((enabled, index) => (
                        <div
                          key={`${item.label}-${index}`}
                          className={styles.accessCell}
                        >
                          <button
                            type="button"
                            className={`${styles.permissionToggle} ${
                              enabled ? styles.checkBadge : styles.emptyCell
                            }`}
                            onClick={() =>
                              togglePermission(
                                group.category,
                                item.label,
                                index,
                              )
                            }
                            aria-pressed={enabled}
                            aria-label={`${enabled ? "Remove" : "Grant"} ${
                              actionColumns[index]
                            } access for ${item.label}`}
                          >
                            {enabled ? <FaCheck /> : null}
                          </button>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className={styles.permissionFooter}>
              <div className={styles.note}>
                <MdInfoOutline />
                <span>
                  You can update the notification preferences at any time.
                </span>
              </div>
              <button type="button" className={styles.saveBtn}>
                Save
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
