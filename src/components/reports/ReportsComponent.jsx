import React from "react";
import styles from "./ReportsComponent.module.css";
import { IoChevronForward, IoDocumentTextOutline } from "react-icons/io5";
import { RiFileExcel2Line } from "react-icons/ri";
import { LuReceiptIndianRupee, LuReceiptText, LuWallet } from "react-icons/lu";
import { FiShoppingCart, FiUsers, FiArrowRight } from "react-icons/fi";
import { BsPatchCheck } from "react-icons/bs";
import { FaArrowsRotate } from "react-icons/fa6";
import Link from "next/link";

const cards = [
  {
    title: "Total Revenue",
    value: "₹18,42,560",
    meta: "+12%",
    metaTheme: "green",
    valueTheme: "blue",
    icon: "wallet",
  },
  {
    title: "Active Customers",
    value: "248",
    meta: "+18",
    metaTheme: "green",
    valueTheme: "greenText",
    icon: "users",
    iconTheme: "greenIcon",
  },
  {
    title: "Active Subscriptions",
    value: "186",
    meta: "92% Active",
    metaTheme: "green",
    valueTheme: "purpleText",
    icon: "subscription",
    iconTheme: "purpleIcon",
  },
  {
    title: "Monthly Orders",
    value: "74",
    meta: "+19%",
    metaTheme: "green",
    valueTheme: "greenText",
    icon: "cart",
    iconTheme: "greenIcon",
  },
  {
    title: "Renewals Completed",
    value: "48",
    meta: "80% Success Rate",
    metaTheme: "green",
    valueTheme: "valueOrange",
    icon: "refresh",
    iconTheme: "orangeIcon",
  },
  {
    title: "Pending Invoices",
    value: "₹2,14,800",
    meta: "12 Pending",
    metaTheme: "pink",
    valueTheme: "valuePink",
    icon: "invoice",
    iconTheme: "pink",
  },
];

const Icon = ({ name }) => {
  switch (name) {
    case "wallet":
      return <LuWallet size={20} />;
    case "users":
      return <FiUsers size={20} />;
    case "subscription":
      return <BsPatchCheck size={20} />;
    case "cart":
      return <FiShoppingCart size={20} />;
    case "refresh":
      return <FaArrowsRotate size={20} />;
    case "invoice":
      return <LuReceiptText size={20} />;
    default:
      return null;
  }
};

const ReportsComponent = () => {
  return (
    <section className={styles.container}>
      <div className={styles.toolbar}>
        <div className={styles.filterCard}>
          <div className={styles.filters}>
            {/* <div className={styles.filterGroup}>
              <label className={styles.label}>Select Plan</label>
              <select className={styles.select} defaultValue="plan">
                <option value="plan">Tizzy® Mail Platinum - 50 GB</option>
                <option value="plan2">Plan B</option>
              </select>
            </div> */}
            <div className={styles.dateGroup}>
              <label className={styles.dateLabel}>
                From Date
                <input type="date" className={styles.dateInput} />
              </label>
              <label className={styles.dateLabel}>
                To Date
                <input type="date" className={styles.dateInput} />
              </label>
            </div>
            <button className={styles.btnApply}>Apply</button>
          </div>

          <div className={styles.actions}>
            {/* <button className={styles.btnPrimary}>Generate Report</button> */}
            <button className={styles.btnGhost}>
              <IoDocumentTextOutline /> Export PDF
            </button>
            <button className={styles.btnGhost}>
              <RiFileExcel2Line /> Export Excel
            </button>
          </div>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        {cards.map((c, idx) => (
          <div key={idx} className={styles.card}>
            <div>
              <div className={styles.cardTitle}>{c.title}</div>
              <div className={`${styles.cardValue} ${styles[c.valueTheme]}`}>
                {c.value}
              </div>
              <div className={`${styles.metaBadge} ${styles[c.metaTheme]}`}>
                {c.meta}
              </div>
            </div>
            <div className={styles.cardIcon}>
              <div className={styles.iconWrap + " " + styles[c.iconTheme]}>
                <Icon name={c.icon} s />
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className={styles.summarySection}>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryHeader}>
              <div className={styles.summaryLabel}>
                <IoDocumentTextOutline
                  className={`${styles.summaryLabelIcon} ${styles.blueIcon}`}
                />
                General Reports
              </div>
            </div>
            <Link href={"/ss"} className={styles.summaryItem}>
              <div className={styles.summaryItemHeading}>
                <div className={styles.summaryItemTitle}>Daily Performance</div>
                <IoChevronForward className={styles.summaryItemArrow} />
              </div>
              <div className={styles.summaryItemText}>
                Monitor daily sales, orders, renewals, and business activity.
              </div>
            </Link>
            <div className={styles.summaryItem}>
              <div className={styles.summaryItemHeading}>
                <div className={styles.summaryItemTitle}>
                  Monthly Subscriptions
                </div>
                <IoChevronForward className={styles.summaryItemArrow} />
              </div>
              <div className={styles.summaryItemText}>
                Track active, renewed, and expired subscriptions.
              </div>
            </div>
            <div className={styles.summaryItem}>
              <div className={styles.summaryItemHeading}>
                <div className={styles.summaryItemTitle}>
                  Last 3 Months Sales
                </div>
                <IoChevronForward className={styles.summaryItemArrow} />
              </div>
              <div className={styles.summaryItemText}>
                Compare recent sales performance.
              </div>
            </div>
            <div className={styles.summaryItem}>
              <div className={styles.summaryItemHeading}>
                <div className={styles.summaryItemTitle}>Annual Sales</div>
                <IoChevronForward className={styles.summaryItemArrow} />
              </div>
              <div className={styles.summaryItemText}>
                Analyze yearly revenue and growth.
              </div>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryHeader}>
              <div className={styles.summaryLabel}>
                <FiUsers
                  className={`${styles.summaryLabelIcon} ${styles.greenIcon}`}
                />
                Customers
              </div>
            </div>
            <div className={styles.summaryItem}>
              <div className={styles.summaryItemHeading}>
                <div className={styles.summaryItemTitle}>New Customers</div>
                <IoChevronForward className={styles.summaryItemArrow} />
              </div>
              <div className={styles.summaryItemText}>
                Recently registered customers.
              </div>
            </div>
            <div className={styles.summaryItem}>
              <div className={styles.summaryItemHeading}>
                <div className={styles.summaryItemTitle}>Subscriptions</div>
                <IoChevronForward className={styles.summaryItemArrow} />
              </div>
              <div className={styles.summaryItemText}>
                Customer subscription overview.
              </div>
            </div>
            <div className={styles.summaryItem}>
              <div className={styles.summaryItemHeading}>
                <div className={styles.summaryItemTitle}>Plan Renewals</div>
                <IoChevronForward className={styles.summaryItemArrow} />
              </div>
              <div className={styles.summaryItemText}>
                Upcoming and completed renewals.
              </div>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryHeader}>
              <div className={styles.summaryLabel}>
                <LuReceiptIndianRupee
                  className={`${styles.summaryLabelIcon} ${styles.orangeIcon}`}
                />
                Billing & Income
              </div>
            </div>
            <div className={styles.summaryItem}>
              <div className={styles.summaryItemHeading}>
                <div className={styles.summaryItemTitle}>Annual Revenue</div>
                <IoChevronForward className={styles.summaryItemArrow} />
              </div>
              <div className={styles.summaryItemText}>
                Yearly earnings summary.
              </div>
            </div>
            <div className={styles.summaryItem}>
              <div className={styles.summaryItemHeading}>
                <div className={styles.summaryItemTitle}>
                  Monthly Transactions
                </div>
                <IoChevronForward className={styles.summaryItemArrow} />
              </div>
              <div className={styles.summaryItemText}>
                Payment and transaction history.
              </div>
            </div>
            <div className={styles.summaryItem}>
              <div className={styles.summaryItemHeading}>
                <div className={styles.summaryItemTitle}>Invoices</div>
                <IoChevronForward className={styles.summaryItemArrow} />
              </div>
              <div className={styles.summaryItemText}>
                Paid, pending and overdue invoices.
              </div>
            </div>
            <div className={styles.summaryItem}>
              <div className={styles.summaryItemHeading}>
                <div className={styles.summaryItemTitle}>Income Forecast</div>
                <IoChevronForward className={styles.summaryItemArrow} />
              </div>
              <div className={styles.summaryItemText}>
                Projected business revenue.
              </div>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryHeader}>
              <div className={styles.summaryLabel}>
                <LuReceiptText
                  className={`${styles.summaryLabelIcon} ${styles.purpleIcon}`}
                />
                Support
              </div>
            </div>
            <div className={styles.summaryItem}>
              <div className={styles.summaryItemHeading}>
                <div className={styles.summaryItemTitle}>Open Tickets</div>
                <IoChevronForward className={styles.summaryItemArrow} />
              </div>
              <div className={styles.summaryItemText}>
                Active support requests.
              </div>
            </div>
            <div className={styles.summaryItem}>
              <div className={styles.summaryItemHeading}>
                <div className={styles.summaryItemTitle}>Resolved Tickets</div>
                <IoChevronForward className={styles.summaryItemArrow} />
              </div>
              <div className={styles.summaryItemText}>
                Successfully closed tickets.
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default ReportsComponent;
