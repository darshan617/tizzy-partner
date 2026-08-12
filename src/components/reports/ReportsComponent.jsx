import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import styles from "./ReportsComponent.module.css";
import { IoChevronForward, IoDocumentTextOutline } from "react-icons/io5";
import { RiFileExcel2Line } from "react-icons/ri";
import {
  LuReceiptIndianRupee,
  LuReceiptText,
  LuWallet,
  LuTrendingUp,
  LuAward,
  LuPackage,
  LuCrown,
  LuClock,
  LuTicket,
  LuDownload,
} from "react-icons/lu";
import { FiShoppingCart, FiUsers, FiMoreHorizontal } from "react-icons/fi";
import { BsPatchCheck } from "react-icons/bs";
import { FaArrowsRotate } from "react-icons/fa6";
import Link from "next/link";
import { useGetReportsMutation } from "@/redux/apis/reportsApi";
import Cookies from "js-cookie";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const formatRevenue = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;

const QUICK_INSIGHT_META = {
  highest_revenue_month: {
    icon: LuTrendingUp,
    iconTheme: "insightBlue",
  },
  best_selling_service: {
    icon: LuAward,
    iconTheme: "insightTeal",
  },
  most_renewed_plan: {
    icon: LuPackage,
    iconTheme: "insightPurple",
  },
  top_customer: {
    icon: LuCrown,
    iconTheme: "insightGold",
  },
  pending_renewals: {
    icon: LuClock,
    iconTheme: "insightOrange",
  },
  open_support_tickets: {
    icon: LuTicket,
    iconTheme: "insightPink",
  },
};

const recentReports = [
  {
    name: "Monthly Sales Report",
    category: "Sales",
    generatedBy: "Admin",
    generatedDate: "15 Jul 2026",
    format: "pdf",
  },
  {
    name: "Customer Growth Report",
    category: "Customers",
    generatedBy: "Admin",
    generatedDate: "12 Jul 2026",
    format: "excel",
  },
  {
    name: "Renewal Summary",
    category: "Subscriptions",
    generatedBy: "Admin",
    generatedDate: "10 Jul 2026",
    format: "pdf",
  },
];

const FormatBadge = ({ format }) => {
  if (format === "excel") {
    return (
      <span className={`${styles.formatBadge} ${styles.formatExcel}`}>
        <RiFileExcel2Line size={14} />
        Excel
      </span>
    );
  }

  return (
    <span className={`${styles.formatBadge} ${styles.formatPdf}`}>
      <IoDocumentTextOutline size={14} />
      PDF
    </span>
  );
};

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
  const userData = Cookies.get("userData")
    ? JSON.parse(Cookies.get("userData"))
    : null;
  const [getReports, { data, isLoading, isError, error }] =
    useGetReportsMutation();
  const [reportData, setReportData] = useState(null);
  const handleGetReports = async () => {
    try {
      const response = await getReports({
        fromDate: "",
        toDate: "",
        partner_id: userData?.id,
      });

      if (response?.data?.status) {
        setReportData(response?.data);
      }
    } catch (error) {
      console.log(error, "reports error");
    }
  };

  const summaryCards = reportData?.summary_cards;
  const revenueOverview = reportData?.revenue_overview;
  const revenueDataset = revenueOverview?.y_axis?.datasets?.[0];
  const salesByService = reportData?.sales_by_service;
  const salesByServiceKeys = Object.keys(salesByService?.datasets || {});
  const monthlyBusinessGrowth = reportData?.monthly_business_growth;
  const quickInsightsData = reportData?.quick_insights;

  const quickInsights = Object.values(quickInsightsData || {}).map((item) => {
    const meta = QUICK_INSIGHT_META[item?.key] || {
      icon: LuTrendingUp,
      iconTheme: "insightBlue",
    };

    return {
      key: item?.key,
      label: item?.label,
      value: item?.value ?? "—",
      icon: meta.icon,
      iconTheme: meta.iconTheme,
    };
  });

  const revenueChartSeries = [
    {
      name: revenueDataset?.label || "Revenue",
      data: revenueDataset?.data || [],
    },
  ];

  const revenueChartOptions = {
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: "inherit",
    },
    colors: ["#0355ac"],
    stroke: { curve: "smooth", width: 3 },
    markers: {
      size: 5,
      colors: ["#0355ac"],
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 6 },
    },
    grid: {
      borderColor: "#eef2f7",
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
    },
    xaxis: {
      categories: revenueOverview?.x_axis?.values || [],
      title: {
        text: revenueOverview?.x_axis?.label || "",
        style: { color: "#9ca3af", fontSize: "12px", fontWeight: 400 },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#9ca3af", fontSize: "12px" } },
    },
    yaxis: {
      min: 0,
      tickAmount: 4,
      title: {
        text: revenueOverview?.y_axis?.label || "",
        style: { color: "#9ca3af", fontSize: "12px", fontWeight: 400 },
      },
      labels: {
        style: { colors: "#9ca3af", fontSize: "12px" },
        formatter: formatRevenue,
      },
    },
    tooltip: {
      y: { formatter: formatRevenue },
    },
    dataLabels: { enabled: false },
  };

  const salesByServiceSeries = salesByServiceKeys.map(
    (key) => salesByService?.datasets?.[key] || 0
  );

  const salesByServiceOptions = {
    chart: {
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    colors: ["#0355ac", "#02bc9c", "#d4a24c"],
    labels: salesByServiceKeys.map(
      (key) => salesByService?.labels?.[key] || key
    ),
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "13px",
      markers: { size: 6, offsetX: -2 },
      itemMargin: { horizontal: 10, vertical: 4 },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "68%",
        },
      },
    },
    tooltip: {
      y: { formatter: formatRevenue },
    },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
  };

  const growthChartSeries = (monthlyBusinessGrowth?.y_axis?.datasets || []).map(
    (dataset) => ({
      name: dataset?.label || dataset?.key || "",
      data: dataset?.data || [],
    })
  );

  const growthChartOptions = {
    chart: {
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    colors: ["#0355ac", "#02bc9c", "#d4a24c"],
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "48%",
      },
    },
    grid: {
      borderColor: "#eef2f7",
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
    },
    xaxis: {
      categories: monthlyBusinessGrowth?.x_axis?.values || [],
      title: {
        text: monthlyBusinessGrowth?.x_axis?.label || "",
        style: { color: "#9ca3af", fontSize: "12px", fontWeight: 400 },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#9ca3af", fontSize: "12px" } },
    },
    yaxis: {
      min: 0,
      tickAmount: 4,
      labels: { style: { colors: "#9ca3af", fontSize: "12px" } },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "13px",
      markers: { size: 6, offsetX: -2 },
      itemMargin: { horizontal: 10, vertical: 4 },
    },
    dataLabels: { enabled: false },
  };

  const cards = [
    {
      title: "Total Revenue",
      value: summaryCards?.total_revenue?.display,
      meta: summaryCards?.total_revenue?.trend,
      metaTheme: "green",
      valueTheme: "black",
      icon: "wallet",
      iconTheme: "blueIcon",
    },
    {
      title: "Active Customers",
      value: summaryCards?.active_customers?.display,
      meta: summaryCards?.active_customers?.trend,
      metaTheme: "green",
      valueTheme: "black",
      icon: "users",
      iconTheme: "greenIcon",
    },
    {
      title: "Active Subscriptions",
      value: summaryCards?.active_subscriptions?.display,
      meta: summaryCards?.active_subscriptions?.trend,
      metaTheme: "green",
      valueTheme: "black",
      icon: "subscription",
      iconTheme: "purpleIcon",
    },
    {
      title: "Monthly Orders",
      value: summaryCards?.monthly_orders?.display,
      meta: summaryCards?.monthly_orders?.trend,
      metaTheme: "green",
      valueTheme: "black",
      icon: "cart",
      iconTheme: "greenIcon",
    },
    {
      title: "Renewals Completed",
      value: summaryCards?.renewals_completed?.display,
      meta: summaryCards?.renewals_completed?.trend,
      metaTheme: "green",
      valueTheme: "black",
      icon: "refresh",
      iconTheme: "orangeIcon",
    },
    {
      title: "Pending Invoices",
      value: summaryCards?.pending_invoices?.display,
      meta: summaryCards?.pending_invoices?.trend,
      metaTheme: "pink",
      valueTheme: "black",
      icon: "invoice",
      iconTheme: "pink",
    },
  ];

  useEffect(() => {
    handleGetReports();
  }, []);

  console.log(reportData, "reportData");

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
        {cards?.map((c, idx) => (
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
                <Icon name={c.icon} />
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

      <section className={styles.chartsSection}>
        <div className={styles.chartsGrid}>
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3 className={styles.chartTitle}>
                {revenueOverview?.title || "Revenue Overview"}
              </h3>
              <p className={styles.chartSubtitle}>
                {revenueOverview?.subtitle ||
                  "Monthly revenue performance across the selected period."}
              </p>
            </div>
            <div className={styles.chartBody}>
              <Chart
                options={revenueChartOptions}
                series={revenueChartSeries}
                type="line"
                height={280}
              />
            </div>
          </div>

          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3 className={styles.chartTitle}>
                {salesByService?.title || "Sales by Service"}
              </h3>
              <p className={styles.chartSubtitle}>
                {salesByService?.subtitle ||
                  "Order distribution across services."}
              </p>
            </div>
            <div className={styles.chartBody}>
              <Chart
                options={salesByServiceOptions}
                series={salesByServiceSeries}
                type="donut"
                height={280}
              />
            </div>
          </div>

          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3 className={styles.chartTitle}>
                {monthlyBusinessGrowth?.title || "Monthly Business Growth"}
              </h3>
              <p className={styles.chartSubtitle}>
                {monthlyBusinessGrowth?.subtitle ||
                  "Compare revenue, orders, and renewals each month."}
              </p>
            </div>
            <div className={styles.chartBody}>
              <Chart
                options={growthChartOptions}
                series={growthChartSeries}
                type="bar"
                height={280}
              />
            </div>
          </div>

          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3 className={styles.chartTitle}>Quick Insights</h3>
              <p className={styles.chartSubtitle}>
                Key highlights at a glance.
              </p>
            </div>
            <ul className={styles.insightsList}>
              {quickInsights.map((item) => {
                const InsightIcon = item.icon;
                return (
                  <li key={item.key || item.label} className={styles.insightItem}>
                    <div
                      className={`${styles.insightIcon} ${styles[item.iconTheme]}`}
                    >
                      <InsightIcon size={18} />
                    </div>
                    <div className={styles.insightContent}>
                      <span className={styles.insightLabel}>{item.label}</span>
                      <span className={styles.insightValue}>{item.value}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.recentReportsSection}>
        <div className={styles.recentReportsCard}>
          <div className={styles.recentReportsHeader}>
            <div>
              <h3 className={styles.chartTitle}>Recent Reports</h3>
              <p className={styles.chartSubtitle}>
                Recently generated business reports.
              </p>
            </div>
            <button type="button" className={styles.viewAllBtn}>
              View All
              <IoChevronForward size={16} />
            </button>
          </div>

          <div className={styles.reportsTableWrap}>
            <table className={styles.reportsTable}>
              <thead>
                <tr>
                  <th>Report Name</th>
                  <th>Category</th>
                  <th>Generated By</th>
                  <th>Generated Date</th>
                  <th>Format</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((report) => (
                  <tr key={report.name}>
                    <td className={styles.reportNameCell}>{report.name}</td>
                    <td>{report.category}</td>
                    <td>{report.generatedBy}</td>
                    <td>{report.generatedDate}</td>
                    <td>
                      <FormatBadge format={report.format} />
                    </td>
                    <td>
                      <span className={styles.statusBadge}>
                        <BsPatchCheck size={14} />
                        Generated
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionGroup}>
                        <button
                          type="button"
                          className={styles.actionBtn}
                          aria-label={`Download ${report.name}`}
                        >
                          <LuDownload size={16} />
                        </button>
                        {/* <button
                          type="button"
                          className={styles.actionBtn}
                          aria-label={`More options for ${report.name}`}
                        >
                          <FiMoreHorizontal size={16} />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </section>
  );
};

export default ReportsComponent;
