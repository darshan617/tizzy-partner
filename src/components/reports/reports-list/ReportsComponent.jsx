import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import styles from "./ReportsComponent.module.css";
import { IoChevronForward, IoDocumentTextOutline } from "react-icons/io5";
import { CiCalendar, CiCircleCheck, CiClock2, CiFilter } from "react-icons/ci";
import { FaArrowRight, FaClock } from "react-icons/fa";
import { BsGraphUp } from "react-icons/bs";

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
  LuFileText,
  LuUserPlus,
  LuIndianRupee,
  LuUsers,
  LuReceipt,
  LuRefreshCw,
  LuCalendarCheck,
} from "react-icons/lu";

import { MdCurrencyRupee } from "react-icons/md";
import { PiPackage, PiReceipt, PiUserPlusLight } from "react-icons/pi";
import { MdOutlineReplay } from "react-icons/md";
import { FaRegCalendarCheck } from "react-icons/fa";
import { FiShoppingCart, FiUsers, FiMoreHorizontal } from "react-icons/fi";
import { BsPatchCheck } from "react-icons/bs";
import { FaArrowsRotate } from "react-icons/fa6";
import Link from "next/link";
import { useGetReportsMutation } from "@/redux/apis/reportsApi";
import Cookies from "js-cookie";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { AiOutlineRise } from "react-icons/ai";
import { BiSupport } from "react-icons/bi";
import CustomDropdown from "@/common-components/custom-dropdown/CustomDropdown";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const formatRevenue = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;

/** Helvetica can't render ₹ and similar glyphs — normalize for PDF text */
const toPdfText = (value) =>
  String(value ?? "-")
    .replace(/₹/g, "Rs.")
    .replace(/[^\x20-\x7E]/g, (char) => {
      if (char === "—") return "-";
      return "";
    });

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

const CATALOG_GROUP_META = {
  general: {
    icon: BsGraphUp,
    iconTheme: "blueIcon",
  },
  customers: {
    icon: FiUsers,
    iconTheme: "blueIcon",
  },
  billing: {
    icon: LuReceiptIndianRupee,
    iconTheme: "blueIcon",
  },
  support: {
    icon: LuReceiptText,
    iconTheme: "blueIcon",
  },
};

const SUMMARY_ITEM_ICON_META = {
  "daily-performance": BsGraphUp,
  "new-customers": PiUserPlusLight,
  "annual-revenue": LuIndianRupee,
  "open-tickets": BiSupport,
  "monthly-subscriptions": CiCalendar,
  subscriptions: LuUsers,
  "monthly-transactions": PiReceipt,
  "resolved-tickets": CiCircleCheck,
  "last-3-months-sales": BsGraphUp,
  "plan-renewals": LuRefreshCw,
  invoices: PiReceipt,
  "annual-sales": AiOutlineRise,
  "income-forecast": AiOutlineRise,
};

const FormatBadge = ({ format }) => {
  const normalizedFormat = String(format || "").toLowerCase();

  if (normalizedFormat === "excel") {
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
    case "rupee":
      return <MdCurrencyRupee size={20} />;
    case "users":
      return <FiUsers size={20} />;
    case "subscription":
      return <MdOutlineReplay size={20} />;
    case "package":
      return <PiPackage size={20} />;
    case "calendar":
      return <FaRegCalendarCheck size={20} />;
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
  const [reportData, setReportData] = useState(null);
  const [dateRange, setDateRange] = useState({
    fromDate: "",
    toDate: "",
  });
  const today = new Date().toISOString().split("T")[0];

  const [getReports, { isLoading, isError, error }] = useGetReportsMutation();
  const [isExporting, setIsExporting] = useState(false);

  const formatDate = (date) => {
    if (!date) return "";

    const [year, month, day] = date.split("-");

    return `${day}-${month}-${year}`;
  };
  const handleGetReports = async () => {
    try {
      const response = await getReports({
        fromDate: formatDate(dateRange?.fromDate) || "",
        toDate: formatDate(dateRange?.toDate) || "",
        partner_id: userData?.id,
        provider_id: selectedProvider || "",
      });

      if (response?.data?.status) {
        setReportData(response?.data);
      }
    } catch (error) {
      console.log(error, "reports error");
    }
  };

  const [activeTab, setActiveTab] = useState(null);

  const tabs = [
    "All",
    "Sales",
    "Customers",
    "Subscriptions",
    "Billing",
    "Revenue",
    "Renewals",
    "Support",
  ];

  const [filterActiveTab, setFilterActiveTab] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const summaryCards = reportData?.summary_cards;
  const catalogGroups = reportData?.catalog_groups || [];
  const revenueOverview = reportData?.revenue_overview;
  const revenueDataset = revenueOverview?.y_axis?.datasets?.[0];
  const salesByService = reportData?.sales_by_service;
  const salesByServiceKeys = Object.keys(salesByService?.datasets || {});
  const monthlyBusinessGrowth = reportData?.monthly_business_growth;
  const quickInsightsData = reportData?.quick_insights;
  const recentReportsData = reportData?.recent_reports;
  const recentReports = recentReportsData?.items || [];

  const updatedReports = catalogGroups?.find((group) => {
    return group?.group === activeTab;
  });

  const dateRangeLabel =
    dateRange.fromDate && dateRange.toDate
      ? `${formatDate(dateRange.fromDate)} to ${formatDate(dateRange.toDate)}`
      : "All time";
  const fileBaseName = `business-reports-${dateRange.fromDate && dateRange.toDate ? `${dateRange.fromDate}_to_${dateRange.toDate}` : "all-time"}`;

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

  const summaryRows = [
    {
      label: "Total Revenue",
      value: summaryCards?.total_revenue?.display ?? "-",
      trend: summaryCards?.total_revenue?.trend ?? "-",
    },
    {
      label: "Active Customers",
      value: summaryCards?.active_customers?.display ?? "-",
      trend: summaryCards?.active_customers?.trend ?? "-",
    },
    {
      label: "Active Subscriptions",
      value: summaryCards?.active_subscriptions?.display ?? "-",
      trend: summaryCards?.active_subscriptions?.trend ?? "-",
    },
    {
      label: "Monthly Orders",
      value: summaryCards?.monthly_orders?.display ?? "-",
      trend: summaryCards?.monthly_orders?.trend ?? "-",
    },
    {
      label: "Renewals Completed",
      value: summaryCards?.renewals_completed?.display ?? "-",
      trend: summaryCards?.renewals_completed?.trend ?? "-",
    },
    {
      label: "Pending Invoices",
      value: summaryCards?.pending_invoices?.display ?? "-",
      trend: summaryCards?.pending_invoices?.trend ?? "-",
    },
  ];

  const styleExcelHeader = (row) => {
    row.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "0355AC" },
      };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });
  };

  const styleExcelDataRow = (row) => {
    row.eachCell((cell, colNumber) => {
      cell.alignment = {
        vertical: "middle",
        horizontal: colNumber === 1 ? "left" : "center",
      };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });
  };

  const autoFitColumns = (worksheet) => {
    worksheet.columns.forEach((column) => {
      let maxLength = 12;
      column.eachCell?.({ includeEmpty: true }, (cell) => {
        const length = cell.value ? String(cell.value).length : 10;
        if (length > maxLength) maxLength = length;
      });
      column.width = Math.min(maxLength + 4, 40);
    });
  };

  const downloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Business Reports");

    worksheet.mergeCells(1, 1, 1, 3);
    const titleCell = worksheet.getCell(1, 1);
    titleCell.value = "Business Reports Overview";
    titleCell.font = { bold: true, size: 14, color: { argb: "FF1B2430" } };

    worksheet.mergeCells(2, 1, 2, 3);
    worksheet.getCell(2, 1).value = `Period: ${dateRangeLabel}`;
    worksheet.getCell(2, 1).font = { size: 10, color: { argb: "FF8B93A1" } };

    worksheet.addRow([]);

    const summaryHeader = worksheet.addRow(["Metric", "Value", "Trend"]);
    styleExcelHeader(summaryHeader);
    summaryRows.forEach((row) => {
      styleExcelDataRow(worksheet.addRow([row.label, row.value, row.trend]));
    });

    worksheet.addRow([]);
    worksheet.addRow(["Quick Insights"]).font = { bold: true, size: 12 };
    const insightHeader = worksheet.addRow(["Insight", "Value"]);
    styleExcelHeader(insightHeader);
    quickInsights.forEach((item) => {
      styleExcelDataRow(worksheet.addRow([item.label, item.value]));
    });

    const revenueCategories = revenueOverview?.x_axis?.values || [];
    const revenueValues = revenueDataset?.data || [];
    if (revenueCategories.length > 0) {
      worksheet.addRow([]);
      worksheet.addRow([revenueOverview?.title || "Revenue Overview"]).font = {
        bold: true,
        size: 12,
      };
      const revenueHeader = worksheet.addRow([
        revenueOverview?.x_axis?.label || "Period",
        revenueDataset?.label || "Revenue",
      ]);
      styleExcelHeader(revenueHeader);
      revenueCategories.forEach((category, idx) => {
        styleExcelDataRow(
          worksheet.addRow([category, revenueValues[idx] ?? 0]),
        );
      });
    }

    if (salesByServiceKeys.length > 0) {
      worksheet.addRow([]);
      worksheet.addRow([salesByService?.title || "Sales by Service"]).font = {
        bold: true,
        size: 12,
      };
      const salesHeader = worksheet.addRow(["Service", "Amount"]);
      styleExcelHeader(salesHeader);
      salesByServiceKeys.forEach((key) => {
        styleExcelDataRow(
          worksheet.addRow([
            salesByService?.labels?.[key] || key,
            salesByService?.datasets?.[key] ?? 0,
          ]),
        );
      });
    }

    const growthCategories = monthlyBusinessGrowth?.x_axis?.values || [];
    const growthDatasets = monthlyBusinessGrowth?.y_axis?.datasets || [];
    if (growthCategories.length > 0 && growthDatasets.length > 0) {
      worksheet.addRow([]);
      worksheet.addRow([
        monthlyBusinessGrowth?.title || "Monthly Business Growth",
      ]).font = { bold: true, size: 12 };
      const growthHeader = worksheet.addRow([
        monthlyBusinessGrowth?.x_axis?.label || "Period",
        ...growthDatasets.map(
          (dataset) => dataset?.label || dataset?.key || "",
        ),
      ]);
      styleExcelHeader(growthHeader);
      growthCategories.forEach((category, idx) => {
        styleExcelDataRow(
          worksheet.addRow([
            category,
            ...growthDatasets.map((dataset) => dataset?.data?.[idx] ?? 0),
          ]),
        );
      });
    }

    autoFitColumns(worksheet);

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      `${fileBaseName}.xlsx`,
    );
  };

  const downloadPdf = async () => {
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 12;
    let y = margin;

    const tableOptions = {
      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: 8,
        cellPadding: 2,
        overflow: "ellipsize",
        valign: "middle",
        halign: "center",
        textColor: [27, 36, 48],
        lineColor: [238, 241, 244],
        lineWidth: 0.2,
      },
      headStyles: {
        fillColor: [3, 85, 172],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: [250, 251, 252],
      },
      columnStyles: {
        0: { halign: "left", fontStyle: "bold" },
      },
      margin: { left: margin, right: margin, bottom: margin },
    };

    const addSectionTitle = (title) => {
      const pageHeight = pdf.internal.pageSize.getHeight();
      if (y > pageHeight - 40) {
        pdf.addPage();
        y = margin;
      }
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(27, 36, 48);
      pdf.text(toPdfText(title), margin, y);
      y += 6;
    };

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.setTextColor(27, 36, 48);
    pdf.text("Business Reports Overview", margin, y);
    y += 7;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(139, 147, 161);
    pdf.text(toPdfText(`Period: ${dateRangeLabel}`), margin, y);
    y += 8;

    addSectionTitle("Summary Metrics");
    autoTable(pdf, {
      ...tableOptions,
      startY: y,
      head: [["Metric", "Value", "Trend"]],
      body: summaryRows.map((row) => [
        toPdfText(row.label),
        toPdfText(row.value),
        toPdfText(row.trend),
      ]),
    });
    y = (pdf.lastAutoTable?.finalY || y) + 10;

    if (quickInsights.length > 0) {
      addSectionTitle("Quick Insights");
      autoTable(pdf, {
        ...tableOptions,
        startY: y,
        head: [["Insight", "Value"]],
        body: quickInsights.map((item) => [
          toPdfText(item.label),
          toPdfText(item.value),
        ]),
      });
      y = (pdf.lastAutoTable?.finalY || y) + 10;
    }

    const revenueCategories = revenueOverview?.x_axis?.values || [];
    const revenueValues = revenueDataset?.data || [];
    if (revenueCategories.length > 0) {
      addSectionTitle(revenueOverview?.title || "Revenue Overview");
      autoTable(pdf, {
        ...tableOptions,
        startY: y,
        head: [
          [
            toPdfText(revenueOverview?.x_axis?.label || "Period"),
            toPdfText(revenueDataset?.label || "Revenue"),
          ],
        ],
        body: revenueCategories.map((category, idx) => [
          toPdfText(category),
          toPdfText(formatRevenue(revenueValues[idx])),
        ]),
      });
      y = (pdf.lastAutoTable?.finalY || y) + 10;
    }

    if (salesByServiceKeys.length > 0) {
      addSectionTitle(salesByService?.title || "Sales by Service");
      autoTable(pdf, {
        ...tableOptions,
        startY: y,
        head: [["Service", "Amount"]],
        body: salesByServiceKeys.map((key) => [
          toPdfText(salesByService?.labels?.[key] || key),
          toPdfText(formatRevenue(salesByService?.datasets?.[key])),
        ]),
      });
      y = (pdf.lastAutoTable?.finalY || y) + 10;
    }

    const growthCategories = monthlyBusinessGrowth?.x_axis?.values || [];
    const growthDatasets = monthlyBusinessGrowth?.y_axis?.datasets || [];
    if (growthCategories.length > 0 && growthDatasets.length > 0) {
      addSectionTitle(
        monthlyBusinessGrowth?.title || "Monthly Business Growth",
      );
      autoTable(pdf, {
        ...tableOptions,
        startY: y,
        head: [
          [
            toPdfText(monthlyBusinessGrowth?.x_axis?.label || "Period"),
            ...growthDatasets.map((dataset) =>
              toPdfText(dataset?.label || dataset?.key || ""),
            ),
          ],
        ],
        body: growthCategories.map((category, idx) => [
          toPdfText(category),
          ...growthDatasets.map((dataset) =>
            toPdfText(dataset?.data?.[idx] ?? 0),
          ),
        ]),
      });
    }

    pdf.save(`${fileBaseName}.pdf`);
  };

  const handleExport = async (format) => {
    if (!reportData || isExporting) return;

    setIsExporting(true);
    try {
      if (format === "excel") {
        await downloadExcel();
      } else {
        await downloadPdf();
      }
    } catch (error) {
      console.error("Failed to export report:", error);
    } finally {
      setIsExporting(false);
    }
  };

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
    (key) => salesByService?.datasets?.[key] || 0,
  );

  const salesByServiceOptions = {
    chart: {
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    colors: ["#0355ac", "#02bc9c", "#d4a24c"],
    labels: salesByServiceKeys.map(
      (key) => salesByService?.labels?.[key] || key,
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
    }),
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
      icon: "rupee",
      iconTheme: "blueIcon",
    },
    {
      title: "Total Orders",
      value: summaryCards?.monthly_orders?.display,
      meta: summaryCards?.monthly_orders?.trend,
      metaTheme: "green",
      valueTheme: "black",
      icon: "package",
      iconTheme: "purpleIcon",
    },
    {
      title: "Active Subscriptions",
      value: summaryCards?.active_subscriptions?.display,
      meta: summaryCards?.active_subscriptions?.trend,
      metaTheme: "green",
      valueTheme: "black",
      icon: "subscription",
      iconTheme: "greenIcon",
    },
    {
      title: "Active Customers",
      value: summaryCards?.active_customers?.display,
      meta: summaryCards?.active_customers?.trend,
      metaTheme: "green",
      valueTheme: "black",
      icon: "users",
      iconTheme: "yellowIcon",
    },

    {
      title: "Renewals",
      value: summaryCards?.renewals_completed?.display,
      meta: summaryCards?.renewals_completed?.trend,
      metaTheme: "green",
      valueTheme: "black",
      icon: "calendar",
      iconTheme: "redIcon",
    },
    // {
    //   title: "Pending Invoices",
    //   value: summaryCards?.pending_invoices?.display,
    //   meta: summaryCards?.pending_invoices?.trend,
    //   metaTheme: "pink",
    //   valueTheme: "black",
    //   icon: "invoice",
    //   iconTheme: "pink",
    // },
  ];

  useEffect(() => {
    handleGetReports();
  }, [selectedProvider]);

  return (
    <section className="containerMain m-auto">
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
            <div className="d-flex  gap-2 flex-column">
              <div className={styles.dateGroup}>
                <label className={styles.dateLabel}>
                  From Date
                  <input
                    type="date"
                    className={styles.dateInput}
                    value={dateRange.fromDate}
                    max={today}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, fromDate: e.target.value })
                    }
                  />
                </label>
                <label className={styles.dateLabel}>
                  To Date
                  <input
                    type="date"
                    className={styles.dateInput}
                    value={dateRange.toDate}
                    max={today}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, toDate: e.target.value })
                    }
                  />
                </label>
                <div className={styles.filterGroup}>
                  <CustomDropdown
                    placeholder="Select Provider"
                    isSearchable={false}
                    value={filterActiveTab}
                    options={[
                      {
                        label: "Google Workspace",
                        value: "google_workspace",
                        idx: 3,
                      },
                      {
                        label: "Microsoft 365",
                        value: "microsoft_365",
                        idx: 2,
                      },
                      {
                        label: "Tizzy",
                        value: "tizzy",
                        idx: 1,
                      },
                    ]}
                    onChange={(selectedOption) => {
                      setFilterActiveTab(selectedOption?.label || null);
                      setSelectedProvider(selectedOption?.idx || null);
                    }}
                    customWidth={"182px"}
                  />

                  <button
                    className={styles.btnApply}
                    onClick={handleGetReports}
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* <div className={styles.filterYear}>
                {summaryTabs?.map((tab) => (
                  <button
                    key={tab}
                    className={`${styles.btnFilterYear} ${summaryActiveTab === tab ? styles.active : ""}`}
                    onClick={() => setSummaryActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div> */}
            </div>
          </div>

          <div className={styles.actions}>
            {/* <button className={styles.btnPrimary}>Generate Report</button> */}
            <button
              type="button"
              className={styles.btnGhost}
              onClick={() => handleExport("pdf")}
              disabled={!reportData || isLoading || isExporting}
            >
              <IoDocumentTextOutline />
              {isExporting ? "Exporting..." : "Export PDF"}
            </button>
            <button
              type="button"
              className={styles.btnGhost}
              onClick={() => handleExport("excel")}
              disabled={!reportData || isLoading || isExporting}
            >
              <RiFileExcel2Line />
              {isExporting ? "Exporting..." : "Export Excel"}
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
      <div className={`${styles.chartCardWrap} mt-4`}>
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
      </div>

      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h3 className={styles.chartTitle}>Quick Insights</h3>
          <p className={styles.chartSubtitle}>Key highlights at a glance.</p>
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

      <section className={styles.summarySection}>
        <div className={styles.summarySectionWrap}>
          <div className={styles.summaryHeader}>
            <h3 className={styles.summaryTitle}>All Reports</h3>
          </div>
          <div className={styles.summaryTabs}>
            <button
              className={`${styles.btnFilterYear} ${
                activeTab === null ? styles.active : ""
              }`}
              onClick={() => setActiveTab(null)}
            >
              All
            </button>
            {catalogGroups?.map((tab) => (
              <button
                key={tab?.group}
                className={`${styles.btnFilterYear} ${
                  activeTab === tab?.group ? styles.active : ""
                }`}
                onClick={() => setActiveTab(tab?.group)}
              >
                {tab?.group}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.summaryGrid}>
          {activeTab === null
            ? catalogGroups?.flatMap((group) => {
                const meta = CATALOG_GROUP_META[group?.group] || {
                  icon: BsGraphUp,
                  iconTheme: "blueIcon",
                };

                return (group?.items || []).map((item) => {
                  const ItemIcon =
                    SUMMARY_ITEM_ICON_META[item?.slug] || meta?.icon;

                  return (
                    <Link
                      key={item?.slug || item?.title}
                      href={`/reports/${item?.slug}`}
                      className={styles.summaryItem}
                    >
                      <div
                        className={`${styles.summaryItemIcon} ${styles[meta?.iconTheme]}`}
                      >
                        <ItemIcon size={16} />
                      </div>

                      <div className={styles.summaryItemTitle}>
                        {item?.title}
                      </div>
                      <div className={styles.summaryItemText}>
                        {item?.subtitle}
                      </div>

                      {item?.stat && (
                        <div className={styles.summaryItemStat}>
                          {item.stat}
                        </div>
                      )}

                      {/* <div className={styles.summaryStatus}>
                    <span>₹ 18.2k today</span>
                  </div> */}

                      <div className={styles.summaryItemFooter}>
                        <span className={styles.summaryItemTime}>
                          {/* <CiClock2 size={10} />2 hours ago */}
                        </span>
                        <span className={styles.summaryItemLink}>
                          View Report <FaArrowRight size={10} />
                        </span>
                      </div>
                    </Link>
                  );
                });
              })
            : (updatedReports?.items || [])?.map((item) => {
                const ItemIcon =
                  SUMMARY_ITEM_ICON_META[item?.slug] || BsGraphUp;
                return (
                  <Link
                    key={item?.slug || item?.title}
                    href={`/reports/${item?.slug}`}
                    className={styles.summaryItem}
                  >
                    <div className={`${styles.summaryItemIcon}`}>
                      <ItemIcon size={16} />
                    </div>

                    <div className={styles.summaryItemTitle}>{item?.title}</div>
                    <div className={styles.summaryItemText}>
                      {item?.subtitle}
                    </div>

                    {item?.stat && (
                      <div className={styles.summaryItemStat}>{item.stat}</div>
                    )}

                    {/* <div className={styles.summaryStatus}>
                    <span>₹ 18.2k today</span>
                  </div> */}

                    <div className={styles.summaryItemFooter}>
                      <span className={styles.summaryItemTime}>
                        {/* <CiClock2 size={10} />2 hours ago */}
                      </span>
                      <span className={styles.summaryItemLink}>
                        View Report <FaArrowRight size={10} />
                      </span>
                    </div>
                  </Link>
                );
              })}
        </div>
      </section>

      <section className={styles.chartsSection}>
        <div className={styles.chartsGrid}>
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

          {/* <div className={styles.chartCard}>
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
                  <li
                    key={item.key || item.label}
                    className={styles.insightItem}
                  >
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
          </div> */}
        </div>
      </section>

      {/* <section className={styles.recentReportsSection}>
        <div className={styles.recentReportsCard}>
          <div className={styles.recentReportsHeader}>
            <div>
              <h3 className={styles.chartTitle}>
                {recentReportsData?.title || "Recent Reports"}
              </h3>
              <p className={styles.chartSubtitle}>
                {recentReportsData?.subtitle ||
                  "Recently generated business reports."}
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
                  <tr key={report.id || report.report_key}>
                    <td className={styles.reportNameCell}>
                      {report.report_name}
                    </td>
                    <td>{report.category}</td>
                    <td>{report.generated_by}</td>
                    <td>{report.generated_date}</td>
                    <td>
                      <FormatBadge format={report.format} />
                    </td>
                    <td>
                      <span className={styles.statusBadge}>
                        <BsPatchCheck size={14} />
                        {report.status || "Generated"}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionGroup}>
                        <a
                          href={report.download_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.actionBtn}
                          aria-label={`Download ${report.report_name}`}
                        >
                          <LuDownload size={16} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section> */}
    </section>
  );
};

export default ReportsComponent;
