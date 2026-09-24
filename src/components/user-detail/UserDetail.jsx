import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaCheck, FaPen } from "react-icons/fa";
import { MdInfoOutline } from "react-icons/md";
import styles from "@/components/user-detail/UserDetail.module.css";
import createBtnBg from "@/assets/summary-count/createBtnBg.svg";
import { FiSmartphone } from "react-icons/fi";
import { RiMacbookLine } from "react-icons/ri";
import Image from "next/image";
import {
  useGetPartnerUserDetailMutation,
  useUpdatePartnerUserMutation,
  useUserManagementUpdateMutation,
} from "@/redux/apis/userDetail";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import CustomPopup from "@/common-components/custom-popup/CustomPopup";
import { useToast } from "@/custom-hooks/toast/ToastProvider";

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

const actionColumns = ["View", "Add", "Edit", "Edit"];

// Maps the API permission row into the UI model:
// - access = current permission value to save to the API
// - visibleAccess = which checkboxes are allowed to be clicked
const mapPermissionsToGroups = (apiPermissions = []) => {
  const groupMap = new Map();

  apiPermissions.forEach((perm) => {
    const groupName = perm.group_name || "General";

    if (!groupMap.has(groupName)) {
      groupMap.set(groupName, {
        category: groupName,
        items: [],
      });
    }

    groupMap.get(groupName).items.push({
      label: perm.module_name || perm.module_key || "Untitled Module",
      module_id: perm.module_id,
      module_key: perm.module_key,
      access: [
        Boolean(perm.can_view ?? false),
        Boolean(perm.can_add ?? false),
        Boolean(perm.can_edit ?? false),
        Boolean(perm.can_delete ?? false),
      ],
      visibleAccess: [
        Boolean(perm.is_visible_view ?? true),
        Boolean(perm.is_visible_add ?? true),
        Boolean(perm.is_visible_edit ?? true),
        Boolean(perm.is_visible_delete ?? true),
      ],
    });
  });

  return Array.from(groupMap.values());
};

const UserDetail = () => {
  const userData = Cookies.get("userData")
    ? JSON.parse(Cookies.get("userData"))
    : null;
  const permissionsData = [
    {
      title: "Catalog Management",
      permissions: [
        {
          name: "Provider",
          selected: false,
          key: "provider",
          actions: [
            {
              name: "View",
              selected: false,
              key: "view",
            },
            {
              name: "Add",
              selected: false,
              key: "add",
            },
            {
              name: "Edit",
              selected: false,
              key: "edit",
            },
            {
              name: "Delete",
              selected: false,
              key: "delete",
            },
          ],
        },
        {
          name: "Plan",
          selected: false,
          key: "plan",
          actions: [
            {
              name: "View",
              selected: false,
              key: "view",
            },
            {
              name: "Add",
              selected: false,
              key: "add",
            },
            {
              name: "Edit",
              selected: false,
              key: "edit",
            },
            {
              name: "Delete",
              selected: false,
              key: "delete",
            },
          ],
        },
        {
          name: "Variant",
          selected: false,
          key: "variant",
          actions: [
            {
              name: "View",
              selected: false,
              key: "view",
            },
            {
              name: "Add",
              selected: false,
              key: "add",
            },
            {
              name: "Edit",
              selected: false,
              key: "edit",
            },
            {
              name: "Delete",
              selected: false,
              key: "delete",
            },
          ],
        },
      ],
    },
    {
      title: "User Management",
      permissions: [
        {
          name: "Users",
          selected: false,
          key: "users",
          actions: [
            {
              name: "View",
              selected: false,
              key: "view",
            },
            {
              name: "Add",
              selected: false,
              key: "add",
            },
            {
              name: "Edit",
              selected: false,
              key: "edit",
            },
            {
              name: "Delete",
              selected: false,
              key: "delete",
            },
          ],
        },
        {
          name: "Role",
          selected: false,
          key: "role",
          actions: [
            {
              name: "View",
              selected: false,
              key: "view",
            },
            {
              name: "Add",
              selected: false,
              key: "add",
            },
            {
              name: "Edit",
              selected: false,
              key: "edit",
            },
            {
              name: "Delete",
              selected: false,
              key: "delete",
            },
          ],
        },
        {
          name: "Variants",
          selected: false,
          key: "variants",
          actions: [
            {
              name: "View",
              selected: false,
              key: "view",
            },
            {
              name: "Add",
              selected: false,
              key: "add",
            },
            {
              name: "Edit",
              selected: false,
              key: "edit",
            },
            {
              name: "Delete",
              selected: false,
              key: "delete",
            },
          ],
        },
      ],
    },
    {
      title: "Master Data Management",
      permissions: [
        {
          name: "Popular Apps",
          selected: false,
          key: "popular_apps",
          actions: [
            {
              name: "View",
              selected: false,
              key: "view",
            },
            {
              name: "Add",
              selected: false,
              key: "add",
            },
            {
              name: "Edit",
              selected: false,
              key: "edit",
            },
            {
              name: "Delete",
              selected: false,
              key: "delete",
            },
          ],
        },
        {
          name: "Plan Categories",
          selected: false,
          key: "plan_categories",
          actions: [
            {
              name: "View",
              selected: false,
              key: "view",
            },
            {
              name: "Create",
              selected: false,
              key: "add",
            },
            {
              name: "Edit",
              selected: false,
              key: "edit",
            },
            {
              name: "Delete",
              selected: false,
              key: "delete",
            },
          ],
        },
        {
          name: "Subscriptions",
          selected: false,
          key: "subscriptions",
          actions: [
            {
              name: "View",
              selected: false,
              key: "view",
            },
            {
              name: "Add",
              selected: false,
              create: false,
              key: "add",
            },
            {
              name: "Edit",
              selected: false,
              key: "edit",
            },
            {
              name: "Delete",
              selected: false,
              key: "delete",
            },
          ],
        },
        {
          name: "Partner Approvals",
          selected: false,
          key: "partner_approvals",
          actions: [
            {
              name: "View",
              selected: false,
              key: "view",
            },
            {
              name: "Add",
              selected: false,
              key: "add",
            },
            {
              name: "Edit",
              selected: false,
              key: "edit",
            },
            {
              name: "Delete",
              selected: false,
              key: "delete",
            },
          ],
        },
        {
          name: "Renewals",
          selected: false,
          key: "renewals",
          actions: [
            {
              name: "View",
              selected: false,
              key: "view",
            },
            {
              name: "Add",
              selected: false,
              key: "add",
            },
            {
              name: "Edit",
              selected: false,
              key: "edit",
            },
            {
              name: "Delete",
              selected: false,
              key: "delete",
            },
          ],
        },
        {
          name: "Transfer Orders",
          selected: false,
          key: "transfer_orders",
          actions: [
            {
              name: "View",
              selected: false,
              key: "view",
            },
            {
              name: "Add",
              selected: false,
              key: "add",
            },
            {
              name: "Edit",
              selected: false,
              key: "edit",
            },
            {
              name: "Delete",
              selected: false,
              key: "delete",
            },
          ],
        },
        {
          name: "Ticket List",
          selected: false,
          key: "ticket_list",
          actions: [
            {
              name: "View",
              selected: false,
              key: "view",
            },
            {
              name: "Add",
              selected: false,
              key: "add",
            },
            {
              name: "Edit",
              selected: false,
              key: "edit",
            },
            {
              name: "Delete",
              selected: false,
              key: "delete",
            },
          ],
        },
      ],
    },
    {
      title: "System Settings",
      permissions: [
        {
          name: "General Settings",
          selected: false,
          key: "general_settings",
          actions: [
            {
              name: "View",
              selected: false,
              key: "view",
            },
            {
              name: "Add",
              selected: false,
              key: "add",
            },
            {
              name: "Edit",
              selected: false,
              key: "edit",
            },
            {
              name: "Delete",
              selected: false,
              key: "delete",
            },
          ],
        },
      ],
    },
    {
      title: "Transaction",
      permissions: [
        {
          name: "Orders",
          selected: false,
          key: "orders",
          actions: [
            {
              name: "View",
              selected: false,
              key: "view",
            },
            {
              name: "Add",
              selected: false,
              create: false,
              key: "add",
            },
            {
              name: "Edit",
              selected: false,
              key: "edit",
            },
            {
              name: "Delete",
              selected: false,
              key: "delete",
            },
          ],
        },
        {
          name: "Billing & Invoices",
          selected: false,
          key: "billing_invoices",
          actions: [
            {
              name: "View",
              selected: false,
              key: "view",
            },
            {
              name: "Add",
              selected: false,
              key: "add",
            },
            {
              name: "Edit",
              selected: false,
              key: "edit",
            },
            {
              name: "Delete",
              selected: false,
              key: "delete",
            },
          ],
        },
        {
          name: "Promocode",
          selected: false,
          key: "promocode",
          actions: [
            {
              name: "View",
              selected: false,
              key: "view",
            },
            {
              name: "Add",
              selected: false,
              key: "add",
            },
            {
              name: "Edit",
              selected: false,
              key: "edit",
            },
            {
              name: "Delete",
              selected: false,
              key: "delete",
            },
          ],
        },
        {
          name: "Credit Request",
          selected: false,
          key: "credit_request",
          actions: [
            {
              name: "View",
              selected: false,
              key: "view",
            },
            {
              name: "Add",
              selected: false,
              key: "add",
            },
            {
              name: "Edit",
              selected: false,
              key: "edit",
            },
            {
              name: "Delete",
              selected: false,
              key: "delete",
            },
          ],
        },
      ],
    },
  ];
  const { partner_user_id } = useRouter().query;
  const [partnerUserDetail, setPartnerUserDetail] = useState(null);
  const { showToast } = useToast();
  const [permissionGroups, setPermissionGroups] = useState([]);

  const [showEditUserPopup, setShowEditUserPopup] = useState(false);

  const [getPartnerUserDetail, { isLoading }] =
    useGetPartnerUserDetailMutation();
  const [updatePartnerUser, { isLoading: isUpdating }] =
    useUpdatePartnerUserMutation();
  const [userManagementUpdate, { isLoading: isUserManagementUpdateLoading }] =
    useUserManagementUpdateMutation();

  const buildPermissionPayload = () =>
    permissionGroups.flatMap((group) =>
      (group?.items || []).map((item) => ({
        module_key: item?.module_key || item?.label,
        module_name: item?.label,
        group_name: group?.category || "Main",
        can_view: Boolean(item?.access?.[0]),
        can_add: Boolean(item?.access?.[1]),
        can_edit: Boolean(item?.access?.[2]),
        can_delete: Boolean(item?.access?.[3]),
      })),
    );

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

            if (!item.visibleAccess?.[accessIndex]) {
              return item;
            }

            const nextAccess = [...item.access];
            nextAccess[accessIndex] = !nextAccess[accessIndex];

            return {
              ...item,
              access: nextAccess,
            };
          }),
        };
      }),
    );
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        partner_id: userData?.id,
        partner_user_id: partner_user_id,
        permissions: buildPermissionPayload(),
      };

      const response = await userManagementUpdate({ body: payload }).unwrap();

      if (response?.data || response?.success) {
        showToast("Permissions updated successfully", "success");
        getPartnerUserDetailData();
        return;
      }

      showToast(
        response?.message ||
          response?.error?.data?.message ||
          "Failed to update permissions",
        "error",
      );
    } catch (error) {
      console.log(error);
      showToast(
        error?.data?.message ||
          "Something went wrong while updating permissions",
        "error",
      );
    }
  };

  const [formData, setFormData] = useState({
    name: partnerUserDetail?.name || "",
    mobile: partnerUserDetail?.mobile || "",
    email: partnerUserDetail?.email || "",
    employee_id: partnerUserDetail?.employee_id || "",
    designation: partnerUserDetail?.designation || "",
  });

  const getPartnerUserDetailData = async () => {
    try {
      const response = await getPartnerUserDetail({
        body: {
          partner_id: userData?.id,
          partner_user_id: partner_user_id,
        },
      }).unwrap();
      if (response?.data) {
        setPartnerUserDetail(response?.data);
        setPermissionGroups(
          mapPermissionsToGroups(response?.data?.permissions || []),
        );
      } else {
        showToast(
          response?.error?.data?.message || "Failed to get partner user detail",
          "error",
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (partner_user_id) {
      getPartnerUserDetailData();
    }
  }, [partner_user_id]);

  const handleChange = (e) => {
    if (e.target.name === "mobile") {
      const value = e.target.value.replace(/\D/g, "");
      setFormData({ ...formData, [e.target.name]: value });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleUpdatePartnerUser = async () => {
    try {
      const response = await updatePartnerUser({
        body: {
          partner_id: userData?.id,
          partner_user_id: partner_user_id,
          name: formData.name,
          mobile: formData.mobile,
          email: formData.email,
          employee_id: formData.employee_id,
          designation: formData.designation,
        },
      }).unwrap();
      if (response?.data) {
        showToast("User updated successfully", "success");
        setShowEditUserPopup(false);
        getPartnerUserDetailData();
      } else {
        showToast(
          response?.error?.data?.message || "Failed to update user",
          "error",
        );
      }
    } catch (error) {
      console.log(error);
    }
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

            const allowedIndexes = item.visibleAccess
              .map((visible, index) => (visible ? index : -1))
              .filter((index) => index !== -1);

            if (!allowedIndexes.length) {
              return item;
            }

            const shouldEnable = !allowedIndexes.every(
              (index) => item.access[index],
            );

            return {
              ...item,
              access: item.access.map((value, index) =>
                allowedIndexes.includes(index) ? shouldEnable : value,
              ),
            };
          }),
        };
      }),
    );
  };

  const handleChangePermission = (groupCategory, itemLabel, accessIndex) => {
    togglePermission(groupCategory, itemLabel, accessIndex);
  };

  return (
    <>
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
                <Image
                  src={createBtnBg}
                  alt=""
                  aria-hidden
                  width={100}
                  height={100}
                />
              </div>
              <div className={styles.profileHeader}>
                <div className={styles.avatar}>
                  {partnerUserDetail?.name?.charAt(0)}
                </div>
                <div className={styles.profileMeta}>
                  <div className={styles.nameRow}>
                    <h2 className={styles.profileName}>
                      {partnerUserDetail?.name}
                    </h2>
                    {/* <span className={styles.employeeTag}>EMP-1042</span> */}
                  </div>
                  <p className={styles.profileRole}>
                    {partnerUserDetail?.designation ?? "-"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditUserPopup(true);
                    setFormData({
                      name: partnerUserDetail?.name || "",
                      mobile: partnerUserDetail?.mobile || "",
                      email: partnerUserDetail?.email || "",
                      employee_id: partnerUserDetail?.employee_id || "",
                      designation: partnerUserDetail?.designation || "",
                    });
                  }}
                  className={styles.profileEditBtn}
                >
                  <FaPen />
                </button>
              </div>

              <div className={styles.profileInfoPanel}>
                <div className={styles.profileInfoGrid}>
                  <div className={styles.infoBox}>
                    <span className={styles.infoLabel}>User ID</span>
                    <span className={styles.infoValue}>
                      {partnerUserDetail?.employee_id}
                    </span>
                  </div>
                  <div className={styles.infoBox}>
                    <span className={styles.infoLabel}>Mobile No.</span>
                    <span className={styles.infoValue}>
                      {partnerUserDetail?.mobile}
                    </span>
                  </div>
                  <div className={styles.infoBox}>
                    <span className={styles.infoLabel}>Email</span>
                    <span className={styles.infoValue}>
                      {partnerUserDetail?.email}
                    </span>
                  </div>
                  <div className={styles.infoBox}>
                    <span className={styles.infoLabel}>Last Login</span>
                    <span className={styles.infoValue}>
                      {partnerUserDetail?.last_login_at || "-"}
                    </span>
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
                      {device.name === "iPhone 15 Pro" ? (
                        <FiSmartphone size={24} />
                      ) : (
                        <RiMacbookLine size={24} />
                      )}
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
                    <div
                      key={`${label}-${index}`}
                      className={styles.actionHead}
                    >
                      {label}
                    </div>
                  ))}
                </div>

                {permissionGroups?.map((group) => (
                  <div key={group.category} className={styles.permissionGroup}>
                    <div className={styles.groupLabel}>{group.category}</div>

                    {group?.items?.map((item) => (
                      <div key={item.label} className={styles.permissionRow}>
                        <div className={styles.moduleCell}>
                          {/* <button
                            type="button"
                            className={`${styles.moduleCheckbox} ${
                              item?.access?.every(
                                (value, index) =>
                                  !item.canAccess?.[index] || value,
                              )
                                ? styles.moduleCheckboxActive
                                : ""
                            }`}
                            onClick={() =>
                              togglePermissionRow(group.category, item.label)
                            }
                            disabled={!item.canAccess?.some(Boolean)}
                            aria-pressed={item?.access?.some(
                              (value, index) =>
                                item.canAccess?.[index] && value,
                            )}
                            aria-label={`Toggle all allowed permissions for ${item.label}`}
                          >
                            {item?.access?.some(
                              (value, index) =>
                                item.canAccess?.[index] && value,
                            ) ? (
                              <FaCheck />
                            ) : null}
                          </button> */}
                          <span>{item?.label}</span>
                        </div>

                        {item?.access?.map((enabled, index) => (
                          <div
                            key={`${item?.label}-${index}`}
                            className={styles.accessCell}
                          >
                            <button
                              type="button"
                              className={`${styles.permissionToggle} ${
                                enabled ? styles.checkBadge : styles.emptyCell
                              } ${
                                !item.visibleAccess?.[index]
                                  ? styles.disabledCell
                                  : ""
                              }`}
                              onClick={() =>
                                handleChangePermission(
                                  group.category,
                                  item?.label,
                                  index,
                                )
                              }
                              aria-pressed={enabled}
                              disabled={!item.visibleAccess?.[index]}
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
                <button
                  type="button"
                  className={styles.saveBtn}
                  onClick={() => handleUpdate()}
                >
                  Save
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
      {showEditUserPopup && (
        <CustomPopup
          title="Update User"
          onClose={() => {
            setShowEditUserPopup(false);
          }}
        >
          <div className={styles.addUserForm}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="name">
                  Name
                  <span className={styles.required}>*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  className="form-control"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="mobile">
                  Mobile
                  <span className={styles.required}>*</span>
                </label>
                <input
                  id="mobile"
                  type="tel"
                  name="mobile"
                  className="form-control"
                  maxLength={10}
                  required
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="email">
                  Email
                  <span className={styles.required}>*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="form-control"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="employee_id">
                  Employee ID
                  <span className={styles.required}>*</span>
                </label>
                <input
                  id="employee_id"
                  type="text"
                  name="employee_id"
                  placeholder="eg. EMP-0112"
                  className="form-control"
                  required
                  value={formData.employee_id}
                  onChange={handleChange}
                />
              </div>

              <div className={`${styles.formGroup} ${styles.halfWidth}`}>
                <label className={styles.label} htmlFor="designation">
                  Designation
                  <span className={styles.required}>*</span>
                </label>
                <input
                  id="designation"
                  type="text"
                  name="designation"
                  className="form-control"
                  required
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="EMP-0112"
                />
              </div>
            </div>

            <div className={styles.submitWrap}>
              <button
                type="button"
                className={styles.saveBtn}
                onClick={() => {
                  handleUpdatePartnerUser();
                  setShowEditUserPopup(false);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </CustomPopup>
      )}
    </>
  );
};

export default UserDetail;
