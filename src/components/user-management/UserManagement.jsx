import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import CustomPopup from "@/common-components/custom-popup/CustomPopup";
import styles from "./UserManagement.module.css";
import {
  useGetPartnerUsersMutation,
  usePartnerUserAddMutation,
} from "@/redux/apis/userManagement";
import Cookies from "js-cookie";
import { useToast } from "@/custom-hooks/toast/ToastProvider";
import router from "next/router";
const MOCK_USERS = [
  {
    id: "EMP-1042",
    name: "Priya Sharma",
    role: "Senior Sales Executive",
    status: "Active",
  },
  {
    id: "EMP-1038",
    name: "Rahul Verma",
    role: "Senior Sales Executive",
    status: "Active",
  },
  {
    id: "EMP-1025",
    name: "Priya Patel",
    role: "Senior Sales Executive",
    status: "Active",
  },
  {
    id: "EMP-1019",
    name: "Neha Singh",
    role: "Senior Sales Executive",
    status: "Active",
  },
  {
    id: "EMP-1007",
    name: "Riya Kapoor",
    role: "Senior Sales Executive",
    status: "Active",
  },
];

const avatarColorClasses = [
  styles.avatarPurple,
  styles.avatarNavy,
  styles.avatarTeal,
  styles.avatarViolet,
  styles.avatarGold,
  styles.avatarBlue,
];

const UserManagement = () => {
  const userData = Cookies.get("userData")
    ? JSON.parse(Cookies.get("userData"))
    : null;

  const [getPartnerUsers, { isLoading }] = useGetPartnerUsersMutation();
  const { showToast } = useToast();
  const [partnerUserAdd, { isLoading: isAddingUser }] =
    usePartnerUserAddMutation();
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [partnerUserList, setPartnerUserList] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    employee_id: "",
    designation: "",
    permissions: [],
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleCloseAddUser = () => setIsAddUserOpen(false);
  const getPartnerUsersList = async () => {
    try {
      const response = await getPartnerUsers({
        body: {
          partner_id: userData?.id,
        },
      }).unwrap();

      if (response?.data) {
        setPartnerUserList(response?.data);
      } else {
        showToast(
          response?.error?.data?.message || "Failed to get partner users",
          "error",
        );
      }
    } catch (error) {
      showToast(error?.data?.message || "Failed to get partner users", "error");
    }
  };
  const handleAddUser = async () => {
    try {
      const response = await partnerUserAdd({
        body: {
          name: formData.name,
          mobile: formData.mobile,
          email: formData.email,
          employee_id: formData.employee_id,
          designation: formData.designation,
          permissions: formData.permissions,
          partner_id: userData?.id,
        },
      }).unwrap();

      console.log("SUCCESS:", response);

      if (response?.success) {
        showToast(response?.message || "User added successfully", "success");

        setIsAddUserOpen(false);

        setFormData({
          name: "",
          mobile: "",
          email: "",
          employee_id: "",
          designation: "",
          permissions: [],
        });
        getPartnerUsersList();
      } else {
        showToast(
          response?.error?.data?.message || "Failed to add user",
          "error",
        );
      }
    } catch (error) {
      console.log("API ERROR:", error);

      showToast(error?.data?.message || "Failed to add user", "error");
    }
  };

  useEffect(() => {
    getPartnerUsersList();
  }, []);

  return (
    <div className={styles.userManagementPage}>
      <header className={styles.pageHeader}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/dashboard" className={styles.breadcrumbLink}>
            Dashboard
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>My Account</span>
        </nav>
        <h1 className={styles.pageTitle}>User Management</h1>
      </header>

      <section className={`sectionCard ${styles.userListCard}`}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>
            User List ({partnerUserList?.length ?? 0})
          </h2>
          <button
            type="button"
            className={styles.addUserBtn}
            onClick={() => setIsAddUserOpen(true)}
          >
            <Plus size={16} strokeWidth={2.5} aria-hidden />
            Add User
          </button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th className={styles.colSrNo}>SR. NO.</th>
                <th className={styles.colUserName}>User Name</th>
                <th className={styles.colStatus}>Status</th>
                <th className={styles.colAction}>Action</th>
              </tr>
            </thead>
            {partnerUserList?.length > 0 ? (
              <tbody>
                {partnerUserList?.map((user, index) => (
                  <tr key={user.employee_id}>
                    <td className={styles.colSrNo}>
                      <span className={styles.srNoBadge}>
                        {user.employee_id}
                      </span>
                    </td>
                    <td className={styles.colUserName}>
                      <div className={styles.userInfo}>
                        <div
                          className={`${styles.avatar} ${
                            avatarColorClasses[
                              index % avatarColorClasses.length
                            ]
                          } text-capitalize`}
                        >
                          {user?.name?.charAt(0)}
                        </div>
                        <div className={styles.userMeta}>
                          <p className={styles.userName}>{user?.name}</p>
                          <p className={styles.userRole}>{user?.designation}</p>
                        </div>
                      </div>
                    </td>
                    <td className={styles.colStatus}>
                      <span className="statusBadge subtleSuccess">
                        {user?.status}
                      </span>
                    </td>
                    <td className={styles.colAction}>
                      <div className={styles.actionGroup}>
                        {/* <button
                          type="button"
                          className={styles.actionBtn}
                          aria-label={`View ${user?.name}`}
                        >
                          <Eye size={15} strokeWidth={2} />
                        </button> */}
                        <button
                          type="button"
                          className={styles.actionBtn}
                          aria-label={`Edit ${user?.name}`}
                          onClick={() =>
                            router.push({
                              pathname: "/user-detail",
                              query: {
                                partner_user_id: user?.partner_user_id,
                              },
                            })
                          }
                        >
                          <Pencil size={14} strokeWidth={2} />
                        </button>
                        <button
                          type="button"
                          className={styles.actionBtn}
                          aria-label={`Delete ${user?.name}`}
                        >
                          <Trash2 size={14} strokeWidth={2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan={4} className="text-center">
                    No data found
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </section>

      {isAddUserOpen && (
        <CustomPopup onClose={handleCloseAddUser} title="Add User">
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
                  type="number"
                  name="mobile"
                  className="form-control"
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
                />
              </div>
            </div>

            <div className={styles.submitWrap}>
              <button
                type="button"
                className={styles.saveBtn}
                onClick={handleAddUser}
              >
                Add User
              </button>
            </div>
          </div>
        </CustomPopup>
      )}
    </div>
  );
};

export default UserManagement;
