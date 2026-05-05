import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, Minus, ChevronUp } from "lucide-react";
import styles from "@/components/dashboard/sales-report/salesReport.module.css";

const invoiceCards = [
    {
        label: "Unpaid Invoices",
        count: 10,
        value: "₹ 517.68k",
        trend: "up",
        trendValue: "8.72%",
        colorClass: "infoColor",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10 22h4c3.771 0 5.657 0 6.828-1.172S22 17.771 22 14v-.437c0-.873 0-1.529-.043-2.063h-4.052c-1.097 0-2.067 0-2.848-.105c-.847-.114-1.694-.375-2.385-1.066c-.692-.692-.953-1.539-1.067-2.386c-.105-.781-.105-1.75-.105-2.848l.01-2.834q0-.124.02-.244C11.121 2 10.636 2 10.03 2C6.239 2 4.343 2 3.172 3.172C2 4.343 2 6.229 2 10v4c0 3.771 0 5.657 1.172 6.828S6.229 22 10 22"
                    opacity="0.5"
                />
                <path
                    fill="currentColor"
                    d="M6.53 14.47a.75.75 0 0 0-1.06 1.06l.97.97l-.97.97a.75.75 0 1 0 1.06 1.06l.97-.97l.97.97a.75.75 0 0 0 1.06-1.06l-.97-.97l.97-.97a.75.75 0 1 0-1.06-1.06l-.97.97zm4.98-12.21l-.01 2.835c0 1.097 0 2.066.105 2.848c.114.847.375 1.694 1.067 2.385c.69.691 1.538.953 2.385 1.067c.781.105 1.751.105 2.848.105h4.052q.02.232.028.5H22c0-.268 0-.402-.01-.56a5.3 5.3 0 0 0-.958-2.641c-.094-.128-.158-.204-.285-.357C19.954 7.494 18.91 6.312 18 5.5c-.81-.724-1.921-1.515-2.89-2.161c-.832-.556-1.248-.834-1.819-1.04a6 6 0 0 0-.506-.154c-.384-.095-.758-.128-1.285-.14z"
                />
            </svg>
        ),
    },
    {
        label: "Overdue Invoices",
        count: 5,
        value: "₹ 517.68k",
        trend: "down",
        trendValue: "8.72%",
        colorClass: "dangerColor",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10 22h4c3.771 0 5.657 0 6.828-1.172S22 17.771 22 14v-.437c0-.873 0-1.529-.043-2.063h-4.052c-1.097 0-2.067 0-2.848-.105c-.847-.114-1.694-.375-2.385-1.066c-.692-.692-.953-1.539-1.067-2.386c-.105-.781-.105-1.75-.105-2.848l.01-2.834q0-.124.02-.244C11.121 2 10.636 2 10.03 2C6.239 2 4.343 2 3.172 3.172C2 4.343 2 6.229 2 10v4c0 3.771 0 5.657 1.172 6.828S6.229 22 10 22"
                    opacity="0.5"
                />
                <path
                    fill="currentColor"
                    d="M7.987 12.953a.75.75 0 0 1 1.026 0l2 1.875a.75.75 0 0 1-1.026 1.094l-.737-.69V18.5a.75.75 0 0 1-1.5 0v-3.269l-.737.691a.75.75 0 0 1-1.026-1.094zM11.51 2.26l-.01 2.835c0 1.097 0 2.066.105 2.848c.114.847.375 1.694 1.067 2.385c.69.691 1.538.953 2.385 1.067c.781.105 1.751.105 2.848.105h4.052q.02.232.028.5H22c0-.268 0-.402-.01-.56a5.3 5.3 0 0 0-.958-2.641c-.094-.128-.158-.204-.285-.357C19.954 7.494 18.91 6.312 18 5.5c-.81-.724-1.921-1.515-2.89-2.161c-.832-.556-1.248-.834-1.819-1.04a6 6 0 0 0-.506-.154c-.384-.095-.758-.128-1.285-.14z"
                />
            </svg>
        ),
    },
    {
        label: "Pending Invoices",
        count: 0,
        value: "₹ 0",
        trend: "neutral",
        trendValue: "0%",
        colorClass: "warningColor",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14 22h-4c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14v-4c0-3.771 0-5.657 1.172-6.828S6.239 2 10.03 2c.606 0 1.091 0 1.5.017q-.02.12-.02.244l-.01 2.834c0 1.097 0 2.067.105 2.848c.114.847.375 1.694 1.067 2.386c.69.69 1.538.952 2.385 1.066c.781.105 1.751.105 2.848.105h4.052c.043.534.043 1.19.043 2.063V14c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22"
                    opacity="0.5"
                />
                <path
                    fill="currentColor"
                    d="M6 13.75a.75.75 0 0 0 0 1.5h8a.75.75 0 0 0 0-1.5zm0 3.5a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5zm5.51-14.99l-.01 2.835c0 1.097 0 2.066.105 2.848c.114.847.375 1.694 1.067 2.385c.69.691 1.538.953 2.385 1.067c.781.105 1.751.105 2.848.105h4.052q.02.232.028.5H22c0-.268 0-.402-.01-.56a5.3 5.3 0 0 0-.958-2.641c-.094-.128-.158-.204-.285-.357C19.954 7.494 18.91 6.312 18 5.5c-.81-.724-1.921-1.515-2.89-2.161c-.832-.556-1.248-.834-1.819-1.04a6 6 0 0 0-.506-.154c-.384-.095-.758-.128-1.285-.14z"
                />
            </svg>
        ),
    },
    {
        label: "Paid Invoices",
        count: 100,
        value: "₹ 517.68k",
        trend: "up",
        trendValue: "8.72%",
        colorClass: "successColor",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14 22h-4c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14v-4c0-3.771 0-5.657 1.172-6.828S6.239 2 10.03 2c.606 0 1.091 0 1.5.017q-.02.12-.02.244l-.01 2.834c0 1.097 0 2.067.105 2.848c.114.847.375 1.694 1.067 2.386c.69.69 1.538.952 2.385 1.066c.781.105 1.751.105 2.848.105h4.052c.043.534.043 1.19.043 2.063V14c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22"
                    opacity="0.5"
                />
                <path
                    fill="currentColor"
                    d="M10.56 15.498a.75.75 0 1 0-1.12-.996l-2.107 2.37l-.772-.87a.75.75 0 0 0-1.122.996l1.334 1.5a.75.75 0 0 0 1.12 0zm.95-13.238l-.01 2.835c0 1.097 0 2.066.105 2.848c.114.847.375 1.694 1.067 2.385c.69.691 1.538.953 2.385 1.067c.781.105 1.751.105 2.848.105h4.052q.02.232.028.5H22c0-.268 0-.402-.01-.56a5.3 5.3 0 0 0-.958-2.641c-.094-.128-.158-.204-.285-.357C19.954 7.494 18.91 6.312 18 5.5c-.81-.724-1.921-1.515-2.89-2.161c-.832-.556-1.248-.834-1.819-1.04a6 6 0 0 0-.506-.154c-.384-.095-.758-.128-1.285-.14z"
                />
            </svg>
        ),
    },
];

const TrendIcon = ({ trend }) => {
    if (trend === "neutral") return <Minus className={styles.trendIcon} />;
    return (
        <ChevronUp
            className={`${styles.trendIcon} ${trend === "down" ? styles.trendIconDown : ""}`}
        />
    );
};

const InvoiceCard = ({ label, count, value, trend, trendValue, colorClass, icon }) => (
    <div className="col">
        <div className={`${styles.invoiceCard} ${styles.btnDisplay}`}>
            <div className={styles.invoiceCardInner}>
                <div className={styles.invoiceCardContent}>
                    <p className={styles.invoiceLabel}>
                        {label}
                        <span className={styles.invoiceCount}>({count})</span>
                    </p>
                    <p className={styles.statValue}>{value}</p>
                    <div
                        className={`${styles.statusBadge} ${
                            trend === "up"
                                ? styles.badgeUp
                                : trend === "down"
                                ? styles.badgeDown
                                : styles.badgeNeutral
                        }`}
                    >
                        <TrendIcon trend={trend} />
                        <span>{trendValue}</span>
                    </div>
                </div>
                <div className={styles.invoiceCardActions}>
                    <Link href="#" className={styles.crBtn}>
                        <ChevronRight className={styles.crBtnIcon} />
                    </Link>
                    <div className={`${styles.invoiceIcon} ${styles[colorClass]}`}>{icon}</div>
                </div>
            </div>
        </div>
    </div>
);

const PERIODS = ["Weekly", "Monthly", "Yearly"];

const SalesReport = () => {
    const [activePeriod, setActivePeriod] = useState("Weekly");

    return (
        <div className={styles.report}>
            <div className="row g-4">
                {/* Chart Section */}
                <div className="col-xl">
                    <div className={`${styles.sectionCard} h-100 py-3 px-sm-4 px-3`}>
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
                            <span>Chart Comes Here</span>
                        </div>
                    </div>
                </div>

                {/* Invoice Cards Section */}
                <div className="col-xl d-xl-flex">
                    <div className="row row-cols-xl-2 row-cols-md-4 row-cols-2 g-3 g-sm-4">
                        {invoiceCards.map((card) => (
                            <InvoiceCard key={card.label} {...card} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesReport;