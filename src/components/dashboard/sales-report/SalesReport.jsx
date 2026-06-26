import React, { useEffect, useState } from "react";
import { Minus, ChevronUp } from "lucide-react";
import styles from "@/components/dashboard/sales-report/salesReport.module.css";
import { useSalesReportMutation } from "@/redux/apis/dashboardApi";
import Cookies from "js-cookie";
import SalesChart from "@/components/sales-chart/SalesChart";

const InvoiceDocIcon = ({ children }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 80 80"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M12 0H48L76 28V68C76 74.6274 70.6274 80 64 80H12C5.37258 80 0 74.6274 0 68V12C0 5.37258 5.37258 0 12 0Z"
      fill="currentColor"
      opacity="0.25"
    />
    <path
      d="M48 0L76 28H58C52.4772 28 48 23.5228 48 18V0Z"
      fill="currentColor"
    />
    {children}
  </svg>
);

const invoiceCards = [
  {
    label: "Unpaid Invoices",
    count: 10,
    amount: "51,768",
    trend: "up",
    trendValue: "8.72%",
    colorClass: "infoColor",
    icon: (
      <InvoiceDocIcon>
        <path
          d="M24 44L36 56M36 44L24 56"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </InvoiceDocIcon>
    ),
  },
  {
    label: "Paid Invoices",
    count: 50,
    amount: "80,254",
    trend: "up",
    trendValue: "8.72%",
    colorClass: "successColor",
    icon: (
      <InvoiceDocIcon>
        <path
          d="M16 52L24 60L40 44"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </InvoiceDocIcon>
    ),
  },
  {
    label: "Overdue Invoices",
    count: 5,
    amount: "10,542",
    trend: "down",
    trendValue: "8.72%",
    colorClass: "dangerColor",
    icon: (
      <InvoiceDocIcon>
        <path
          d="M40 58V34"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M30 44L40 34L50 44"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </InvoiceDocIcon>
    ),
  },
  {
    label: "Pending Invoices",
    count: 0,
    amount: "0",
    trend: "neutral",
    trendValue: "0%",
    colorClass: "warningColor",
    icon: (
      <InvoiceDocIcon>
        <path
          d="M18 46H42"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M18 58H34"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </InvoiceDocIcon>
    ),
  },
];

const formatAmount = (value) => {
  if (value === null || value === undefined || value === "") return "0";
  if (typeof value === "string") return value.replace(/^₹\s*/, "");
  return Number(value).toLocaleString("en-IN");
};

const getInvoiceKpi = (invoiceKpis, label) => {
  const key = label.toUpperCase();
  const kpi = invoiceKpis?.[key] ?? invoiceKpis?.[label];

  if (kpi && typeof kpi === "object") {
    return {
      count: kpi.count ?? kpi.total ?? 0,
      amount: formatAmount(kpi.amount ?? kpi.value ?? kpi.total_amount ?? 0),
      trendValue: kpi.growth ?? kpi.trend_value,
    };
  }

  return {
    amount: formatAmount(kpi),
    count: null,
    trendValue: null,
  };
};

const TrendIcon = ({ trend }) => {
  if (trend === "neutral") return <Minus className={styles.trendIcon} />;
  return (
    <ChevronUp
      className={`${styles.trendIcon} ${trend === "down" ? styles.trendIconDown : ""}`}
    />
  );
};

const PERIODS = ["weekly", "monthly", "yearly"];

const SalesReport = ({ data, isDataLoading }) => {
  const userData = Cookies?.get("userData")
    ? JSON.parse(decodeURIComponent(Cookies.get("userData")))
    : null;
  const invoiceCardsData = data?.invoice_kpis || {};
  const [activePeriod, setActivePeriod] = useState("yearly");
  const [salesData, setSalesData] = useState();

  const [salesReport, { isLoading: isSalesReportLoading }] =
    useSalesReportMutation();
  const fetchSalesReport = async () => {
    try {
      const res = await salesReport({
        body: {
          partner_id: userData?.id,
          period: activePeriod,
        },
      });
      if (res?.data?.success || res?.data?.status) {
        setSalesData(res?.data);
      }
    } catch (error) {
      console.log("erorr", error);
    }
  };

  useEffect(() => {
    if (userData?.id) {
      fetchSalesReport();
    }
  }, [activePeriod, userData?.id]);

  return (
    <div className={styles.report}>
      <div className="row g-4">
        {/* Chart Section */}
        <div className="col-xl">
          <div className={`sectionCard h-100 py-3 px-sm-4 px-3`}>
            <div className={styles.cardHeader}>
              <h2 className={styles.sectionCardHead}>Sales Reports</h2>
              <div className={styles.tabBtnGroup}>
                {PERIODS.map((period) => (
                  <button
                    key={period}
                    type="button"
                    className={`${styles.tbgItem} ${activePeriod === period ? styles.tbgItemActive : ""}`}
                    onClick={() => setActivePeriod(period)}
                  >
                    <span className={styles.tbgItemText}>{period}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.chartContainer}>
              <SalesChart data={salesData} />
            </div>
          </div>
        </div>

        {/* Invoice Cards Section */}
        <div className="col-xl d-xl-flex">
          <div className={styles.invoiceCardsGrid}>
            {invoiceCards.map((card) => {
              const kpi = getInvoiceKpi(invoiceCardsData, card.label);
              const count = kpi.count ?? card.count;
              const amount = kpi.amount ?? card.amount;
              const trendValue = kpi.trendValue ?? card.trendValue;

              return (
                <div
                  className={`sectionCard ${styles.invoiceCard}`}
                  key={card.label}
                >
                  <div className={styles.invoiceCardHeader}>
                    <div
                      className={`${styles.invoiceIcon} ${styles[card.colorClass]}`}
                    >
                      {card.icon}
                    </div>
                    {/* <div
                      className={`${styles.statusBadge} ${
                        card.trend === "up"
                          ? styles.badgeUp
                          : card.trend === "down"
                            ? styles.badgeDown
                            : styles.badgeNeutral
                      }`}
                    >
                      <TrendIcon trend={card.trend} />
                      <span>{trendValue}</span>
                    </div> */}
                  </div>
                  <p className={styles.invoiceLabel}>
                    {card.label}
                    {/* <span className={styles.invoiceCount}>({count})</span> */}
                  </p>
                  <p className={styles.statValue}>₹ {amount}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;
