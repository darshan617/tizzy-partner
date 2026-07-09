import { useGetTransactionHistoryMutation } from "@/redux/apis/transactionsApi";
import Cookies from "js-cookie";
import { useEffect, useMemo, useState } from "react";
import { FiFilter } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { MdOutlineFileDownload } from "react-icons/md";
import Loader from "@/common-components/loader/Loader";
import styles from "@/components/transactions/TransactionsList.module.css";
import { useRouter } from "next/router";
import DownloadExcel from "@/common-components/download-excel/DownloadExcel";

const statusLabelMap = {
  completed: "Completed",
  success: "Success",
  pending: "Pending",
  cancelled: "Cancelled",
  draft: "Draft",
  rejected: "Rejected",
  failed: "Failed",
};

const statusOrder = [
  "completed",
  "pending",
  "cancelled",
  "failed",
  "draft",
  "rejected",
];

const avatarBgClasses = [
  "warningBg",
  "secondaryBg",
  "successBg",
  "primaryBg",
  "infoBg",
  "dangerBg",
];

const getStatusKey = (status) => (status || "").toString().trim().toLowerCase();

const getBillingStatusClass = (status) => {
  const key = status?.toLowerCase()?.replace(/\s+/g, "");

  if (["pending", "expiring"].includes(key)) return styles.billingPending;
  if (["overdue", "expired", "cancelled", "failed", "rejected"].includes(key)) {
    return styles.billingOverdue;
  }
  if (["completed", "success", "active", "paid"].includes(key)) {
    return styles.billingSuccess;
  }

  return styles.billingDefaultBadge;
};

const formatAmount = (amount) => {
  const num = Number(amount || 0);
  return `₹ ${num.toFixed(2)}`;
};

const getBillingDescription = (transaction) => {
  const invoiceNo = transaction?.invoice_no?.bill_no_full;

  if (transaction?.description) return transaction.description;
  if (transaction?.plan) return transaction.plan;
  if (invoiceNo) return `Updated Plan to Tizzy Mail Enterprise - ${invoiceNo}`;

  return "Updated Plan to Tizzy Mail Enterprise - 100 GB";
};

const transactionColumns = [
  {
    label: "Date",
    key: "date",
  },
  {
    label: "Order No",
    key: "order_no",
  },
  {
    label: "Domain",
    key: "domain",
  },
  {
    label: "Status",
    key: "status",
  },
  {
    label: "Amount",
    key: "amount",
  },
  {
    label: "Invoice No",
    getValue: (tx) => tx?.invoice_no?.bill_no_full || "-",
  },
];

const TransactionsList = ({ variant = "default", limit }) => {
  const router = useRouter();
  const userData = Cookies.get("userData")
    ? JSON.parse(decodeURIComponent(Cookies.get("userData")))
    : {};

  const [transactionsList, setTransactionsList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState("all");

  const [getTransactionsList, { isLoading }] =
    useGetTransactionHistoryMutation();

  const fetchTransactionsList = async () => {
    try {
      const res = await getTransactionsList({
        body: { partner_id: userData?.id },
      });
      if (res?.data?.success) {
        const list = res?.data?.data?.data || res?.data?.data || [];
        const items = Array.isArray(list) ? list : [];
        setTransactionsList(items);
        setTotalCount(
          res?.data?.data?.total_count ??
            res?.data?.total_count ??
            items?.length ??
            0,
        );
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    fetchTransactionsList();
  }, []);

  const toggleStatus = (status) => {
    setSelectedStatuses((prev) => (prev === status ? "all" : status));
  };

  const filteredTransactions = useMemo(() => {
    const q = searchQuery?.trim()?.toLowerCase();

    return transactionsList?.filter((tx) => {
      const matchesSearch =
        q === "" ||
        tx?.domain?.toLowerCase()?.includes(q) ||
        String(tx?.order_id || "")
          ?.toLowerCase()
          ?.includes(q) ||
        tx?.customer?.toLowerCase()?.includes(q) ||
        tx?.plan?.toLowerCase()?.includes(q);

      const statusKey = getStatusKey(tx?.status);
      const matchesStatus =
        selectedStatuses === "all" || selectedStatuses === statusKey;

      return matchesSearch && matchesStatus;
    });
  }, [
    transactionsList,
    searchQuery,
    selectedStatuses,
    router?.query?.customerId,
  ]);

  const finalTransactionsList = filteredTransactions?.filter((tx) => {
    if (!router?.query?.customerId) return true;

    return tx?.cust_id === Number(router?.query?.customerId);
  });

  const resultTotal = totalCount || transactionsList?.length || 0;
  const showingEnd = filteredTransactions?.length || 0;
  const showingStart = showingEnd > 0 ? 1 : 0;

  if (variant === "billing") {
    const billingTransactions =
      typeof limit === "number"
        ? filteredTransactions?.slice(0, limit)
        : filteredTransactions;

    return (
      <section className={styles.billingCard}>
        <div className={styles.billingHeader}>
          <h2 className={styles.billingTitle}>Transaction History</h2>
          <a href="/transactions" className={styles.billingViewAllLink}>
            View All
          </a>
        </div>

        <div className={styles.billingContentBody}>
          {!isLoading ? (
            billingTransactions?.length > 0 ? (
              <div className={styles.billingContentList}>
                {billingTransactions.map((tx, idx) => (
                  <article
                    key={tx?.order_id || tx?.order_no || idx}
                    className={styles.billingContentRow}
                  >
                    <div className={styles.billingTransactionRowInner}>
                      <div className={styles.billingDateMeta}>
                        <p className={styles.billingTxDate}>
                          {tx?.date || "-"}
                        </p>
                        <span className={styles.billingTxIdBadge}>
                          {tx?.order_no || "-"}
                        </span>
                      </div>

                      <div className={styles.billingDomainBlock}>
                        <div
                          className={`${styles.billingAvatar} ${styles[`billingAvatar${idx % 5}`]}`}
                        >
                          {tx?.domain?.charAt(0)?.toUpperCase() || "T"}
                        </div>

                        <div className={styles.billingDomainInfo}>
                          <p className={styles.billingDomainName}>
                            {tx?.domain || "-"}
                          </p>
                          <p className={styles.billingSubText}>
                            {getBillingDescription(tx)}
                          </p>
                        </div>
                      </div>

                      <div className={styles.billingColStatus}>
                        <span
                          className={`${styles.billingStatusBadge} ${getBillingStatusClass(tx?.status)}`}
                        >
                          {tx?.status || "Pending"}
                        </span>
                      </div>

                      <div className={styles.billingColAmount}>
                        <span className={styles.billingAmountValue}>
                          {formatAmount(tx?.amount)}
                        </span>
                      </div>

                      <div className={styles.billingColArrow}>
                        <button
                          type="button"
                          className={styles.billingArrowBtn}
                          aria-label="View transaction details"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m9 18 6-6-6-6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className={styles.billingEmptyState}>No Transaction Data</p>
            )
          ) : (
            <Loader />
          )}
        </div>
      </section>
    );
  }

  // const downloadExcel = () => {
  //   const data = finalTransactionsList;

  //   if (!data || data.length === 0) {
  //     return;
  //   }

  //   const headers = [
  //     "Date",
  //     "Order No",
  //     "Domain",
  //     "Status",
  //     "Amount",
  //     "Invoice No",
  //   ];

  //   const rows = data.map((tx) => [
  //     tx?.date || "-",
  //     tx?.order_no || "-",
  //     tx?.domain || "-",
  //     tx?.status || "-",
  //     tx?.amount || "-",
  //     tx?.invoice_no?.bill_no_full || "-",
  //   ]);

  //   const csvContent = [headers, ...rows]
  //     .map((row) =>
  //       row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
  //     )
  //     .join("\n");

  //   const blob = new Blob([csvContent], {
  //     type: "text/csv;charset=utf-8;",
  //   });

  //   const url = URL.createObjectURL(blob);

  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.download = "transaction-history.csv";

  //   document.body.appendChild(link);
  //   link.click();

  //   document.body.removeChild(link);
  //   URL.revokeObjectURL(url);
  // };

  return (
    <div className="col py-4">
      <div className={`${styles.sectionCard} ${styles.adjustWidth}`}>
        <div className={styles.filtersMain}>
          <div className="py-3 px-sm-4 px-3 border-bottom">
            <div className="row align-items-center justify-content-between">
              <div className="col-sm-auto order-sm-2">
                <search className={styles.pageSearchBox}>
                  <input
                    type="text"
                    className={`${styles.pageSearch} form-control`}
                    placeholder="Search Transaction"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                  />
                  <button className={styles.searchBtn} type="button">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={styles.icon}
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                  </button>
                </search>
              </div>
              <div
                className={`${styles.searchCount} col-sm-auto order-sm-1 text-center my-2 my-sm-0`}
              >
                Showing{" "}
                <span className="fw-medium darkColor">
                  {showingStart} - {showingEnd}
                </span>{" "}
                from <span className="fw-medium darkColor">{resultTotal}</span>{" "}
                {resultTotal === 1 ? "result" : "results"}
              </div>
            </div>
          </div>

          <div className={styles.filterWrapper}>
            <div
              className={`collapse${filterOpen ? " show" : ""}`}
              id="transactionFilterSection"
            >
              <div className="p-sm-4 p-3">
                <div className="row g-4 mb-4">
                  <div className="col-auto">
                    <span className={styles.filterHead}>Status :</span>
                    <ul className={`${styles.filterGroup} gap-2`} role="group">
                      {statusOrder.map((status) => (
                        <li key={status}>
                          <button
                            className={`${styles.filterItem} rounded-pill`}
                            onClick={() => toggleStatus(status)}
                            style={{
                              backgroundColor:
                                selectedStatuses === status
                                  ? "var(--primaryColor)"
                                  : "",
                              color:
                                selectedStatuses === status
                                  ? "var(--whiteColor)"
                                  : "var(--darkColor)",
                            }}
                          >
                            {statusLabelMap[status]}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              className={`${styles.btn} ${styles.small} ${styles.btnDefault} ${styles.filterBtn}`}
              onClick={() => setFilterOpen((prev) => !prev)}
              aria-expanded={filterOpen}
            >
              {filterOpen ? (
                <>
                  <IoClose className={`${styles.icon} me-2`} />
                  <span>Close</span>
                </>
              ) : (
                <>
                  <FiFilter className={`${styles.icon} me-2`} />
                  <span>Filters</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div
          className={`${styles.toolbar} py-2 px-sm-4 px-3 d-flex align-items-center justify-content-end`}
        >
          <DownloadExcel
            data={finalTransactionsList}
            columns={transactionColumns}
            fileName="transaction-history"
            className={styles.downloadListBtn}
            buttonText="Download List"
          />
        </div>

        <div className={styles.listScrollArea}>
          <div className="py-4 px-sm-4 px-3">
            <div className="d-flex flex-column gap-3 mb-4">
              {!isLoading ? (
                finalTransactionsList?.length > 0 ? (
                  finalTransactionsList
                    ?.filter((tx) =>
                      selectedStatuses === "all"
                        ? true
                        : tx?.status?.toLowerCase() === selectedStatuses,
                    )
                    ?.map((tx, idx) => (
                      <div
                        key={tx?.order_id || idx}
                        className={`${styles.contentRow} btnDisplay`}
                      >
                        <div className="row align-items-center py-3 px-sm-4 px-3 g-2">
                          <div className="col-lg-2 col-md-3 col-12">
                            <div className={styles.txMeta}>
                              <div className={styles.txDate}>{tx?.date}</div>
                              <div className={styles.txNumber}>
                                {tx?.order_no}
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-5 col-md-5 col-12">
                            <div className="d-flex align-items-center">
                              <div
                                className={`avatarSmall flex-shrink-0 ${avatarBgClasses[idx % avatarBgClasses.length]}`}
                              >
                                {tx?.domain?.charAt(0)?.toUpperCase()}
                              </div>
                              <div className="ps-2 min-w-0">
                                <div className={styles.txDomainName}>
                                  {tx?.domain}
                                </div>
                                {tx?.status?.toLowerCase() === "completed" && (
                                  <div className={styles.txDesc}>
                                    Received payment for invoice no. INV
                                    {tx?.invoice_no?.bill_no_full}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-2 col-md-2 col-6 text-md-center">
                            <span
                              className={`${styles.statusBadge} ${styles[tx?.status?.toLowerCase()]}`}
                            >
                              {tx?.status}
                            </span>
                          </div>

                          <div className="col-lg-3 col-md-2 col-6 text-end">
                            <span className={styles.amountValue}>
                              {formatAmount(tx?.amount)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-center m-0">No Transaction Data</p>
                )
              ) : (
                <Loader />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsList;
