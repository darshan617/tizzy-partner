import React, { useMemo, useState } from "react";
import styles from "./AllCreditNoteList.module.css";
import { FiFilter } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { MdOutlineFileDownload } from "react-icons/md";
import Loader from "@/common-components/loader/Loader";
import DownloadExcel from "@/common-components/download-excel/DownloadExcel";
import Pagination from "@/common-components/pagination/Pagination";

const statusLabelMap = {
  credited: "Credited",
  pending: "Pending",
  cancelled: "Cancelled",
  failed: "Failed",
};

const statusOrder = ["credited", "pending", "cancelled", "failed"];

const getStatusKey = (status) =>
  (status || "").toString().trim().toLowerCase().replace(/\s+/g, "_");

const formatAmount = (amount) => {
  const num = Number(amount || 0);
  return `₹ ${num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatLabel = (value) => {
  if (!value) return "-";
  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getCreditStatusClass = (status) => {
  const key = getStatusKey(status);
  if (["credited", "success", "completed"].includes(key)) {
    return styles.successBadge;
  }
  if (["pending", "processing"].includes(key)) return styles.pendingBadge;
  if (["cancelled", "failed", "rejected"].includes(key)) {
    return styles.dangerBadge;
  }
  return styles.defaultBadge;
};

const getOrderStatusClass = (status) => {
  const key = getStatusKey(status);
  if (["cancelled", "failed", "rejected"].includes(key)) {
    return styles.dangerBadge;
  }
  if (["pending", "processing"].includes(key)) return styles.pendingBadge;
  if (["completed", "success", "active"].includes(key)) {
    return styles.successBadge;
  }
  return styles.defaultBadge;
};

const getWalletStatusClass = (status) => {
  const key = getStatusKey(status);
  if (key.includes("credited")) return styles.successBadge;
  if (key.includes("pending")) return styles.pendingBadge;
  if (key.includes("failed")) return styles.dangerBadge;
  return styles.infoBadge;
};

const creditNoteColumns = [
  {
    label: "Date",
    getValue: (item) => formatDate(item?.bill_date || item?.created_at),
  },
  {
    label: "Credit Note No",
    key: "credit_note_no",
  },
  {
    label: "Order No",
    key: "order_no",
  },
  {
    label: "Order Status",
    key: "order_status",
  },
  {
    label: "Credit Note Status",
    key: "credit_note_status",
  },
  {
    label: "Wallet Status",
    key: "wallet_status",
  },
  {
    label: "Withdrawable",
    getValue: (item) => (item?.wallet_withdrawable ? "Yes" : "No"),
  },
  {
    label: "Amount",
    key: "credit_note_amount",
  },
  {
    label: "Credit Note Link",
    key: "credit_note_link",
  },
];

const AllCreditNoteList = ({ creditNotesList, isLoading }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(10);

  const toggleStatus = (status) => {
    setSelectedStatuses((prev) => (prev === status ? "all" : status));
    setCurrentPage(1);
  };

  const filteredCreditNotes = useMemo(() => {
    const q = searchQuery?.trim()?.toLowerCase();

    return creditNotesList?.filter((note) => {
      const matchesSearch =
        q === "" ||
        note?.credit_note_no?.toLowerCase()?.includes(q) ||
        note?.order_no?.toLowerCase()?.includes(q) ||
        String(note?.order_id || "")
          .toLowerCase()
          .includes(q) ||
        note?.wallet_status?.toLowerCase()?.includes(q) ||
        note?.credit_note_status?.toLowerCase()?.includes(q);

      const statusKey = getStatusKey(note?.credit_note_status);
      const matchesStatus =
        selectedStatuses === "all" || selectedStatuses === statusKey;

      return matchesSearch && matchesStatus;
    });
  }, [creditNotesList, searchQuery, selectedStatuses]);

  const resultTotal = filteredCreditNotes?.length || 0;
  const startIndex = (currentPage - 1) * itemPerPage;
  const paginatedList = filteredCreditNotes?.slice(
    startIndex,
    startIndex + itemPerPage,
  );
  const showingEnd = Math.min(startIndex + itemPerPage, resultTotal);
  const showingStart = resultTotal > 0 ? startIndex + 1 : 0;

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
                    placeholder="Search Credit Notes"
                    value={searchQuery}
                    onChange={(event) => {
                      setSearchQuery(event.target.value);
                      setCurrentPage(1);
                    }}
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
                  {showingStart}-{showingEnd}
                </span>{" "}
                from <span className="fw-medium darkColor">{resultTotal}</span>{" "}
                {resultTotal === 1 ? "result" : "results"}
              </div>
            </div>
          </div>

          <div className={styles.filterWrapper}>
            <div
              className={`collapse${filterOpen ? " show" : ""}`}
              id="creditNoteFilterSection"
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
            data={filteredCreditNotes}
            columns={creditNoteColumns}
            fileName="credit-notes"
            className={styles.downloadListBtn}
            buttonText="Download List"
          />
        </div>

        <div className={styles.listScrollArea}>
          <div className="py-4 px-sm-4 px-3">
            <div className="d-flex flex-column gap-3 mb-4">
              {!isLoading ? (
                paginatedList?.length > 0 ? (
                  paginatedList.map((note) => (
                    <div
                      key={note?.credit_note_id || note?.credit_note_no}
                      className={`${styles.contentRow} btnDisplay`}
                    >
                      <div className="row align-items-center py-3 px-sm-4 px-3 g-2">
                        <div className="col-12 col-md-2 col-lg-2">
                          <div className={styles.txMeta}>
                            <div className={styles.txDate}>
                              {formatDate(note?.bill_date || note?.created_at)}
                            </div>
                            <div className={styles.txNumber}>
                              {note?.credit_note_no || "-"}
                            </div>
                          </div>
                        </div>

                        <div className="col-12 col-md-3 col-lg-3">
                          <div className={styles.orderBlock}>
                            <div className={styles.orderNo}>
                              ORD: {note?.order_no || "-"}
                            </div>
                            <span
                              className={`${styles.statusBadge} ${getOrderStatusClass(note?.order_status)}`}
                            >
                              ORD STATUS: {formatLabel(note?.order_status)}
                            </span>
                          </div>
                        </div>

                        <div className="col-12 col-md-3 col-lg-3">
                          <div className={styles.walletBlock}>
                            <span
                              className={`${styles.statusBadge} ${getWalletStatusClass(note?.wallet_status)}`}
                            >
                              {formatLabel(note?.wallet_status)}
                            </span>
                            <div className={styles.walletMeta}>
                              {note?.wallet_withdrawable
                                ? "Withdrawable"
                                : "Non-withdrawable"}
                            </div>
                          </div>
                        </div>

                        <div className="col-6 col-md-2 col-lg-2 text-md-center">
                          <span
                            className={`${styles.statusBadge} ${getCreditStatusClass(note?.credit_note_status)}`}
                          >
                            {formatLabel(note?.credit_note_status)}
                          </span>
                        </div>

                        <div className="col-6 col-md-2 col-lg-2">
                          <div className={styles.amountActions}>
                            <span className={styles.amountValue}>
                              {formatAmount(note?.credit_note_amount)}
                            </span>
                            {note?.credit_note_link ? (
                              <a
                                href={note.credit_note_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.downloadBtn}
                                aria-label="Download credit note"
                              >
                                <MdOutlineFileDownload
                                  className={styles.downloadBtnIcon}
                                />
                              </a>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center m-0">No Credit Note Data</p>
                )
              ) : (
                <Loader />
              )}
            </div>
          </div>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        data={filteredCreditNotes}
        itemPerPage={itemPerPage}
      />
    </div>
  );
};

export default AllCreditNoteList;
