import Link from "next/link";
import { GoShareAndroid } from "react-icons/go";
import { MdOutlineFileDownload } from "react-icons/md";
import { IoMdArrowBack } from "react-icons/io";
import styles from "@/components/customers/subscription-history/SubscriptionHistory.module.css";

const TizzyIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 400"
        width="24"
        height="24"
        className="icon"
    >
        <path
            fill="#34a853"
            d="M49,59s86.637-1.833,172,99L282,21,350,9V20s-36.234-2.265-53,43L144,391l-14-39,80-172S164.162,106.238,49,69V59Z"
        />
    </svg>
);

const historyRows = [
    {
        status: "Renewed",
        product: "Tizzy® Mail Enterprise 100 GB",
        price: "₹1000.00",
        license: "10",
        period: "25 May, 2025 - 25 May, 2026",
    },
    {
        status: "Renewed",
        product: "Tizzy® Mail Enterprise 100 GB",
        price: "₹1000.00",
        license: "10",
        period: "25 May, 2024 - 25 May, 2025",
    },
    {
        status: "Renewed with license update",
        product: "Tizzy® Mail Enterprise 100 GB",
        price: "₹1000.00",
        license: "10",
        period: "25 May, 2023 - 25 May, 2024",
    },
    {
        status: "Upgraded to",
        product: "Tizzy® Mail Enterprise 100 GB",
        price: "₹1000.00",
        license: "7",
        period: "25 May, 2022 - 25 May, 2023",
    },
    {
        status: "New Subscription",
        product: "Tizzy® Mail Enterprise 50 GB",
        price: "₹1000.00",
        license: "7",
        period: "25 May, 2021 - 25 May, 2022",
    },
];

const SubscriptionHistory = () => {
    return (

        <div className="row flex-column gy-4 py-4">
            <div className="col">
                <div className={`${styles.breadcrumbHeader} row align-items-end`}>
                    <div className="col">
                        <nav className={`${styles.breadcrumb} mb-0`}>
                            <button
                                onClick={() => router.push("/dashboard")}
                                className={styles.breadcrumbItem}
                            >
                                Dashboard
                            </button>{" "}
                            /
                            <button
                                onClick={() => router.push("/customers")}
                                className={styles.breadcrumbItem}
                            >
                                Customers
                            </button>
                            <h1 className="breadcrumb-item active" aria-current="page">
                                Customer - 00024
                            </h1>
                        </nav>
                    </div>
                    <div className="col-auto">
                        <Link href="/customers" className="btn small btnWhite">
                            <IoMdArrowBack />
                            <span>Back</span>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="col">
                <div className={`${styles.historyCard} ${styles.sectionCard}`}>
                    <div className="col">
                        <div className="row align-items-center justify-content-between gy-3">
                            <div className="col-md">
                                <div className={styles.headerGroup}>
                                    <div className="d-flex gap-2">
                                        <p className={styles.sectionLabel}>SUBSCRIPTION HISTORY: </p>
                                        <h1 className={styles.pageTitle}>goyalinfotech.com</h1>
                                    </div>
                                </div>
                            </div>
                            <div className={`${styles.historyBtn} col-auto d-flex flex-wrap gap-4`}>
                                <button className="shareBtn small">
                                    <GoShareAndroid size={16} /> Share
                                </button>
                                <button className="downloadBtn small">
                                    <MdOutlineFileDownload size={16}/> Download
                                </button>
                            </div>
                        </div>
                    </div>
                    {historyRows.map((item, index) => (
                        <div className={styles.historyRow} key={index}>
                            <div className={styles.rowLeft}>
                                <div className={styles.statusIcon}>
                                    <TizzyIcon />
                                </div>
                                <div>
                                    <span className={styles.statusLabel}>{item.status}</span>
                                    <p className={styles.productName}>{item.product}</p>
                                </div>
                            </div>
                            <div className={styles.rowGrid}>
                                <div className={styles.rowValue}>
                                    <span className={styles.fieldLabel}>Price</span>
                                    {item.price}
                                    <span className={styles.subText}>per user/year</span>
                                </div>
                                <div className={styles.rowValue}>
                                    <span className={styles.fieldLabel}>License</span>
                                    {item.license}
                                </div>
                                <div className={styles.rowValue}>
                                    <span className={styles.fieldLabel}>Period</span>
                                    <span>{item.period}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionHistory;
