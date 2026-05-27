import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  ChevronsDown,
  ChevronUp,
} from "lucide-react";
import styles from "@/components/dashboard/transaction/Transaction.module.css";
import { useRouter } from "next/router";
import { FiChevronsDown, FiChevronsUp } from "react-icons/fi";

const transactions = [
  {
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
];

const renewals = [
  {
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
    domain: "goyalinfotech.com",
    avatar: "A",
    avatarBg: "secondaryBg",
    owner: "Ashwini Kumar",
    plan: "Tizzy® Mail Enterprise - 100 GB",
    date: "20 Mar, 2026",
    status: "Expiring",
    statusClass: "subtleWarning",
  },
];

export default function TransactionSection({ data, isDataLoading }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("transactions");
  const [currentData, setCurrentData] = useState(data?.transaction_history);
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  useEffect(() => {
    setCurrentData(data?.transaction_history);
  }, [data?.transaction_history]);

  return (
    <div className="col">
      <div className={`${styles.sectionCard} py-4 px-sm-4 px-3`}>
        <div className="d-flex dbdTabMargin">
          <div className="col-lg-6">
            <div className="nav d-flex gap-3 dbdTabs">
              <button
                className={`dbdNavtab ${activeTab === "transactions" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("transactions");
                  setCurrentData(data?.transaction_history);
                }}
              >
                <h2 className={`${styles.sectionCardHead} mb-0`}>
                  Recent Transactions
                </h2>
              </button>

              <div className="align-self-center">
                <div className="vr h-25"></div>
              </div>

              <button
                className={`dbdNavtab ${activeTab === "renewals" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("renewals");
                  setCurrentData(data?.renewals_history);
                }}
              >
                <h2 className={`${styles.sectionCardHead} mb-0`}>
                  Upcoming Renewals
                </h2>
              </button>
            </div>
          </div>
        </div>

        <>
          <div className="w-100 d-flex justify-content-lg-end justify-content-center mb-3 mt-3 mt-lg-0">
            <div className="col-lg-6 d-flex justify-content-end">
              <div className={`${styles.tabBtnGroup} rounded-pill`}>
                <input
                  type="radio"
                  className="btn-check"
                  name="tnxRadio"
                  id="tnxRadio1"
                  autoComplete="off"
                  defaultChecked
                />
                <label className="tbgItem rounded-pill" htmlFor="tnxRadio1">
                  <span className="fw-medium">Last 7 Days</span> (10)
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="tnxRadio"
                  id="tnxRadio2"
                  autoComplete="off"
                />
                <label className="tbgItem rounded-pill" htmlFor="tnxRadio2">
                  <span className="fw-medium">Last 15 Days</span> (50)
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="tnxRadio"
                  id="tnxRadio3"
                  autoComplete="off"
                />
                <label className="tbgItem rounded-pill" htmlFor="tnxRadio3">
                  <span className="fw-medium">Last 30 Days</span> (100)
                </label>
              </div>
            </div>
          </div>

          <div
            className={`${styles.contentList} d-flex flex-column gap-3 mb-4`}
          >
            {currentData?.length > 0 ? (
              currentData
                ?.slice(0, showAllTransactions ? 10 : 5)
                ?.map((item, index) => (
                  <div
                    className={`${styles.contentRow} btnDisplay`}
                    key={index}
                  >
                    <div className="row align-items-center">
                      <div className="col-12 col-sm-2 d-flex align-items-center justify-content-between d-sm-block">
                        <div className={`${styles.crDate}`}>
                          {item?.date
                            ? item?.date
                            : item?.subscription_start_date}
                        </div>
                        <div className={`${styles.crNumber} fw-medium`}>
                          {item?.order_no}
                        </div>
                      </div>

                      <div className="col-8 col-sm">
                        <div
                          className={`${styles.crDomain} d-flex align-items-center`}
                        >
                          <div
                            className={`avatarSmall flex-shrink-0 bg-primary`}
                          >
                            {item?.domain?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className={`${styles.crDomainName} ps-2`}>
                            {item?.domain}
                          </div>
                        </div>
                        <div
                          className={`${styles.crDescription} ms-sm-4 ps-sm-2 mt-2 mt-md-0`}
                        >
                          {item?.plan || item?.plan_name}
                        </div>
                      </div>

                      <div className="col-4 col-sm d-flex gap-3 gap-sm-0 flex-wrap">
                        <div className="col-sm-6 col-12 text-sm-center text-end">
                          <span
                            className={`statusBadge text-capitalize ${styles[item?.status?.toLowerCase()]}`}
                          >
                            {item?.status}
                          </span>
                        </div>
                        <div className="col-sm-6 col-12 text-sm-center text-end">
                          <span className="fw-medium">
                            ₹ {item?.amount?.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {activeTab === "renewals" && (
                        <div className="col-sm-auto col-12 text-end py-0">
                          <button
                            onClick={() =>
                              router.push({
                                pathname: "/order-summary",
                                query: {
                                  type: "renew-plan",
                                  order_id: item?.order_id,
                                },
                              })
                            }
                            className="crBtn"
                          >
                            <ChevronRight className="icon me-0" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-center mt-4">No Data Found</p>
            )}

            {showAllTransactions && activeTab === "transactions" && (
              <button
                onClick={() => router.push("/transactions")}
                className="bg-transparent text-primary outline-none border-0 w-fit mx-auto d-flex align-items-center gap-1 px-3"
              >
                View All Transactions
              </button>
            )}
            {showAllTransactions && activeTab === "renewals" && (
              <button
                onClick={() => router.push("/subscriptions")}
                className="bg-transparent text-primary outline-none border-0 w-fit mx-auto d-flex align-items-center gap-1 px-3"
              >
                View All Renewals
              </button>
            )}
            {currentData?.length > 5 && (
              <button
                onClick={() => setShowAllTransactions(!showAllTransactions)}
                className="btn w-fit mx-auto d-flex align-items-center gap-1 px-3"
              >
                {showAllTransactions ? (
                  <span>
                    <FiChevronsUp className="icon" /> Load Less
                  </span>
                ) : (
                  <span>
                    <FiChevronsDown size={12} className="icon" /> Load More
                  </span>
                )}
              </button>
            )}
          </div>
        </>
      </div>
    </div>
  );
}
