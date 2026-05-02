import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronsDown } from "lucide-react";
import styles from '@/components/dashboard/transaction/Transaction.module.css'


const allData = [
    {
        type: 'transaction',
        date: "20 Mar, 2026",
        number: "TNX00123",
        domain: "ganeshenterprises.com",
        avatar: "G",
        avatarBg: "warningBg",
        description: "Updated Plan to Tizzy® Mail Enterprise - 100 GB",
        status: "Pending",
        statusClass: "subtleWarning",
        amount: "₹ 1254.00",
    },
    {
        type: 'transaction',
        date: "20 Mar, 2026",
        number: "TNX00124",
        domain: "goyalinfotech.com",
        avatar: "A",
        avatarBg: "successBg",
        description: "Updated Plan to Tizzy® Mail Enterprise - 100 GB",
        status: "Overdue",
        statusClass: "subtleDanger",
        amount: "₹ 1254.00",
    },
    {
        type: 'transaction',
        date: "20 Mar, 2026",
        number: "TNX00124",
        domain: "kingstonmarketing.net",
        avatar: "K",
        avatarBg: "successBg",
        description: "Updated Plan to Tizzy® Mail Enterprise - 100 GB",
        status: "Pending",
        statusClass: "subtleWarning",
        amount: "₹ 1254.00",
    },
    {
        type: 'transaction',
        date: "20 Mar, 2026",
        number: "TNX00124",
        domain: "pinchthewallet.com",
        avatar: "P",
        avatarBg: "successBg",
        description: "Updated Plan to Tizzy® Mail Enterprise - 100 GB",
        status: "Unpaid",
        statusClass: "subtleSuccess",
        amount: "₹ 1254.00",
    },
    {
        type: 'transaction',
        date: "20 Mar, 2026",
        number: "TNX00124",
        domain: "lorealpharma.in",
        avatar: "A",
        avatarBg: "successBg",
        description: "Updated Plan to Tizzy® Mail Enterprise - 100 GB",
        status: "Pending",
        statusClass: "subtleWarning",
        amount: "₹ 1254.00",
    },
    {
        type: 'transaction',
        date: "20 Mar, 2026",
        number: "TNX00124",
        domain: "lorealpharma.in",
        avatar: "A",
        avatarBg: "successBg",
        description: "Updated Plan to Tizzy® Mail Enterprise - 100 GB",
        status: "Pending",
        statusClass: "subtleWarning",
        amount: "₹ 1254.00",
    },
    {
        type: 'transaction',
        date: "20 Mar, 2026",
        number: "TNX00124",
        domain: "lorealpharma.in",
        avatar: "A",
        avatarBg: "successBg",
        description: "Updated Plan to Tizzy® Mail Enterprise - 100 GB",
        status: "Pending",
        statusClass: "subtleWarning",
        amount: "₹ 1254.00",
    },
    {
        type: 'renewal',
        domain: "ganeshenterprises.com",
        avatar: "G",
        avatarBg: "warningBg",
        owner: "Ganesh Singh",
        plan: "Tizzy® Mail Enterprise - 100 GB",
        date: "20 Mar, 2026",
        status: "Expiring",
        statusClass: "subtleWarning",
    },
    {
        type: 'renewal',
        domain: "goyalinfotech.com",
        avatar: "A",
        avatarBg: "secondaryBg",
        owner: "Ashwini Kumar",
        plan: "Tizzy® Mail Enterprise - 100 GB",
        date: "20 Mar, 2026",
        status: "Expiring",
        wartext: "8 days left",
        statusClass: "subtleWarning",
    },
    {
        type: 'renewal',
        domain: "goyalinfotech.com",
        avatar: "A",
        avatarBg: "secondaryBg",
        owner: "Ashwini Kumar",
        plan: "Tizzy® Mail Enterprise - 100 GB",
        date: "20 Mar, 2026",
        status: "Expiring",
        statusClass: "subtleWarning",
    },
    {
        type: 'renewal',
        domain: "goyalinfotech.com",
        avatar: "A",
        avatarBg: "secondaryBg",
        owner: "Ashwini Kumar",
        plan: "Tizzy® Mail Enterprise - 100 GB",
        date: "20 Mar, 2026",
        status: "Expiring",
        statusClass: "subtleWarning",
    },
    {
        type: 'renewal',
        domain: "goyalinfotech.com",
        avatar: "A",
        avatarBg: "secondaryBg",
        owner: "Ashwini Kumar",
        plan: "Tizzy® Mail Enterprise - 100 GB",
        date: "20 Mar, 2026",
        status: "Expiring",
        statusClass: "subtleWarning",
    },
    {
        type: 'renewal',
        domain: "goyalinfotech.com",
        avatar: "A",
        avatarBg: "secondaryBg",
        owner: "Ashwini Kumar",
        plan: "Tizzy® Mail Enterprise - 100 GB",
        date: "20 Mar, 2026",
        status: "Expiring",
        statusClass: "subtleWarning",
    },
]


export default function TransactionSection() {
    const [activeTab, setActiveTab] = useState("transactions");
    const [showAll, setShowAll] = useState(false);

    const activeData = allData.filter(item =>
        activeTab === "transactions" ? item.type === "transaction" : item.type === "renewal"
    );

    const visibleData = showAll ? activeData : activeData.slice(0, 5);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setShowAll(false);
    };

    return (
        <div className="col">
            <div className={`${styles.sectionCard} py-4 px-sm-4 px-3`}>
                <div className={`${styles.dbdTabMargin} d-flex`}>
                    <div className="col-lg-6">
                        <div className="nav d-flex gap-3 dbdTabs">
                            <button
                                className={`dbdNavtab ${activeTab === "transactions" ? "active" : ""}`}
                                onClick={() => handleTabChange("transactions")}
                            >
                                <h2 className={`${styles.sectionCardHead} mb-0`}>Recent Transactions</h2>
                            </button>

                            <div className="align-self-center">
                                <div className="vr h-25"></div>
                            </div>

                            <button
                                className={`dbdNavtab ${activeTab === "renewals" ? "active" : ""}`}
                                onClick={() => handleTabChange("renewals")}
                            >
                                <h2 className={`${styles.sectionCardHead} mb-0`}>Upcoming Renewals</h2>
                            </button>
                        </div>
                    </div>
                    <div className="col-lg-6 d-flex justify-content-end">
                        <div className="w-100 d-flex justify-content-lg-end justify-content-center mb-3 mt-3 mt-lg-0">
                            <div className={`${styles.tabBtnGroup} rounded-pill`}>
                                <input type="radio" className="btn-check" name="tnxRadio" id="tnxRadio1" autoComplete="off" defaultChecked />
                                <label className="tbgItem rounded-pill" htmlFor="tnxRadio1">
                                    <span className="fw-medium">Last 7 Days</span> (10)
                                </label>

                                <input type="radio" className="btn-check" name="tnxRadio" id="tnxRadio2" autoComplete="off" />
                                <label className="tbgItem rounded-pill" htmlFor="tnxRadio2">
                                    <span className="fw-medium">Last 15 Days</span> (50)
                                </label>

                                <input type="radio" className="btn-check" name="tnxRadio" id="tnxRadio3" autoComplete="off" />
                                <label className="tbgItem rounded-pill" htmlFor="tnxRadio3">
                                    <span className="fw-medium">Last 30 Days</span> (100)
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`${styles.contentList} d-flex flex-column gap-3 mb-4`}>
                    {visibleData.map((item, index) => (
                        <div className={`${styles.contentRow} btnDisplay`} key={index}>
                            <div className="row align-items-center">
                                {item.type === "transaction" ? (
                                    <>
                                        <div className="col-12 col-sm-2 d-flex align-items-center justify-content-between d-sm-block">
                                            <div className={`${styles.crDate}`}>{item.date}</div>
                                            <div className={`${styles.crNumber} fw-medium`}>{item.number}</div>
                                        </div>

                                        <div className="col-8 col-sm">
                                            <div className={`${styles.crDomain} d-flex align-items-center`}>
                                                <div className={`avatarSmall flex-shrink-0 ${item.avatarBg}`}>
                                                    {item.avatar}
                                                </div>
                                                <div className={`${styles.crDomainName} ps-2`}>{item.domain}</div>
                                            </div>
                                            <div className={`${styles.crDescription} ms-sm-4 ps-sm-2 mt-2 mt-md-0`}>
                                                {item.description}
                                            </div>
                                        </div>

                                        <div className="col-4 col-sm d-flex gap-3 gap-sm-0 flex-wrap">
                                            <div className="col-sm-6 col-12 text-sm-center text-end">
                                                <span className={`statusBadge ${item.statusClass}`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                            <div className="col-sm-6 col-12 text-sm-center text-end">
                                                <span className="fw-medium">{item.amount}</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="col-md col-7 d-flex flex-wrap">
                                            <div className="col-md col-12">
                                                <div className={`${styles.crDomain} d-flex align-items-center`}>
                                                    <div className={`avatarSmall flex-shrink-0 ${item.avatarBg}`}>
                                                        {item.avatar}
                                                    </div>
                                                    <div className={`${styles.crDomainName} ps-2`}>{item.domain}</div>
                                                </div>
                                                <div className={`${styles.crDescription} ms-4 ps-2`}>{item.owner}</div>
                                            </div>

                                            <div className="col-md col-12">
                                                <div className={`${styles.crDescription} ms-4 ps-2`}>{item.plan}</div>
                                                <div className={`${styles.crDescription} ms-4 ps-2`}>{item.date}</div>
                                            </div>
                                        </div>

                                        <div className="col-sm-4 col-5 d-flex flex-wrap align-items-center gap-3 gap-md-0">
                                            <div className="col-md-6 col-12 text-center">
                                                <span className={`statusBadge ${item.statusClass}`}>
                                                    {item.status}
                                                </span>
                                                <small className="d-block dangerColor">{item.wartext}</small>
                                            </div>
                                            <div className="col-md-6 col-12 text-center">
                                                <Link href="#" className="btn btnWhite small crRenew">
                                                    <span>Renew</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="col-sm-auto col-12 text-end py-0">
                                    <Link href="#" className="crBtn">
                                        <ChevronRight className="icon me-0" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {activeData.length > 5 && (
                    <div className="d-flex justify-content-center">
                        <div className="col-md-2 col-sm-4 col-6">
                            <button
                                className="btn btnWhite w-100"
                                onClick={() => setShowAll(!showAll)}
                            >
                                <ChevronsDown className={`icon me-0 ${showAll ? "rotate-180" : ""}`} />
                                <span>{showAll ? "Show Less" : "Load More"}</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}