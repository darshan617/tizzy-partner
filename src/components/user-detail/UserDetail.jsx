import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaCheck, FaPen } from "react-icons/fa";
import { MdInfoOutline } from "react-icons/md";
import styles from "@/components/user-detail/UserDetail.module.css";
import createBtnBg from "@/assets/summary-count/createBtnBg.svg";
import { FiSmartphone } from "react-icons/fi";
import { RiMacbookLine } from "react-icons/ri";
import Image from "next/image";
import { useGetPartnerUserDetailMutation, useUpdatePartnerUserMutation } from "@/redux/apis/userDetail";
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

// Transforms the flat `permissions` array from the API response
// (module_id, module_key, module_name, group_name, can_view, can_add, can_edit, can_delete)
// into the grouped { category, items: [{ label, access: [bool,bool,bool,bool] }] } shape
// that the permission table below already renders.
const mapPermissionsToGroups = (apiPermissions = []) => {
  const groupMap = new Map();

  apiPermissions.forEach((perm) => {
    if (!groupMap.has(perm.group_name)) {
      groupMap.set(perm.group_name, {
        category: perm.group_name,
        items: [],
      });
    }

    groupMap.get(perm.group_name).items.push({
      label: perm.module_name,
      module_id: perm.module_id,
      module_key: perm.module_key,
      access: [perm.can_view, perm.can_add, perm.can_edit, perm.can_delete],
    });
  });

  return Array.from(groupMap.values());
};

const UserDetail = () => {
  const userData = Cookies.get("userData")
    ? JSON.parse(Cookies.get("userData"))
    : null;
  const { partner_user_id } = useRouter().query;
  const [partnerUserDetail, setPartnerUserDetail] = useState(null);
  const { showToast } = useToast();
  const [permissionGroups, setPermissionGroups] = useState([]);
  const [showEditUserPopup, setShowEditUserPopup] = useState(false);
  const [getPartnerUserDetail, { isLoading }] =
    useGetPartnerUserDetailMutation();
  const [updatePartnerUser, { isLoading: isUpdating }] =
    useUpdatePartnerUserMutation();
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
        setPermissionGroups(mapPermissionsToGroups(response?.data?.permissions));
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
              <Image
                src={createBtnBg}
                alt=""
                aria-hidden
                width={100}
                height={100}
              />
            </div>
            <div className={styles.profileHeader}>
              <div className={styles.avatar}>J</div>
              <div className={styles.profileMeta}>
                <div className={styles.nameRow}>
                  <h2 className={styles.profileName}>
                    {partnerUserDetail?.name}
                  </h2>
                  {/* <span className={styles.employeeTag}>EMP-1042</span> */}
                </div>
                <p className={styles.profileRole}>
                  Senior Sales Executive - B2B Portal
                </p>
              </div>
              <button type="button" className={styles.profileEditBtn}>
                <FaPen
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
                />
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

                        <div
                          className={`${styles.formGroup} ${styles.halfWidth}`}
                        >
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
                          onClick={()=>{
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
              </button>
            </div>

            <div className={styles.profileInfoPanel}>
              <div className={styles.profileInfoGrid}>
                <div className={styles.infoBox}>
                  <span className={styles.infoLabel}>User ID</span>
                  <span className={styles.infoValue}>{partnerUserDetail?.employee_id}</span>
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