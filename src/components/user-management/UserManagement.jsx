import React, { useState } from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import styles from "./UserManagement.module.css";

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
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const handleCloseAddUser = () => setIsAddUserOpen(false);

  const handleSaveUser = (e) => {
    e.preventDefault();
    setIsAddUserOpen(false);
  };

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
            User List ({MOCK_USERS.length})
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
            <tbody>
              {MOCK_USERS.map((user, index) => (
                <tr key={user.id}>
                  <td className={styles.colSrNo}>
                    <span className={styles.srNoBadge}>{user.id}</span>
                  </td>
                  <td className={styles.colUserName}>
                    <div className={styles.userInfo}>
                      <div
                        className={`${styles.avatar} ${
                          avatarColorClasses[index % avatarColorClasses.length]
                        }`}
                      >
                        {user.name.charAt(0)}
                      </div>
                      <div className={styles.userMeta}>
                        <p className={styles.userName}>{user.name}</p>
                        <p className={styles.userRole}>{user.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className={styles.colStatus}>
                    <span className="statusBadge subtleSuccess">
                      {user.status}
                    </span>
                  </td>
                  <td className={styles.colAction}>
                    <div className={styles.actionGroup}>
                      <button
                        type="button"
                        className={styles.actionBtn}
                        aria-label={`View ${user.name}`}
                      >
                        <Eye size={15} strokeWidth={2} />
                      </button>
                      <button
                        type="button"
                        className={styles.actionBtn}
                        aria-label={`Edit ${user.name}`}
                      >
                        <Pencil size={14} strokeWidth={2} />
                      </button>
                      <button
                        type="button"
                        className={styles.actionBtn}
                        aria-label={`Delete ${user.name}`}
                      >
                        <Trash2 size={14} strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {isAddUserOpen && (
        <div
          className={styles.modalOverlay}
          onClick={handleCloseAddUser}
          role="presentation"
        >
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Add User"
          >
            <form className={styles.addUserForm} onSubmit={handleSaveUser}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="username">
                    Username
                    <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="username"
                    type="text"
                    name="username"
                    className="form-control"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="password">
                    Password
                    <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    className="form-control"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="confirmPassword">
                    Confirm Password
                    <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="role">
                    Role
                    <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="role"
                    type="text"
                    name="role"
                    className="form-control"
                    required
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.halfWidth}`}>
                  <label className={styles.label} htmlFor="status">
                    Status
                    <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="status"
                    type="text"
                    name="status"
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className={styles.submitWrap}>
                <button type="submit" className={styles.saveBtn}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
