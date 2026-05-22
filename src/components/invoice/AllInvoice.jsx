import { useMemo, useState } from "react";
import styles from "@/components/invoice/AllInvoice.module.css";
import { FiFilter } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { MdOutlineFileDownload } from "react-icons/md";
import Loader from "@/common-components/loader/Loader";
import { useRouter } from "next/router";

const statusLabelMap = {
  active: "Active",
  paid: "Paid",
  pending: "Pending",
  overdue: "Overdue",
};

const statusOrder = ["paid", "pending", "overdue", "active"];

const avatarBgClasses = [
  "warningBg",
  "secondaryBg",
  "successBg",
  "primaryBg",
  "infoBg",
  "dangerBg",
];

const getStatusKey = (status) => (status || "").toString().trim().toLowerCase();

const getStatusBadgeClass = (status) => {
  const key = getStatusKey(status);
  if (key === "paid" || key === "active") return styles.paidBadge;
  if (key === "pending") return styles.pendingBadge;
  if (key === "overdue") return styles.overdueBadge;
  return styles.defaultBadge;
};

const showPayNow = (status) => {
  const key = getStatusKey(status);
  return key === "pending" || key === "overdue";
};

const AllInvoice = ({ invoiceData, isInvoiceDataLoading, totalCount }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const invoices = invoiceData || [];

  const toggleStatus = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((item) => item !== status)
        : [...prev, status],
    );
  };

  const filteredInvoices = useMemo(() => {
    const q = searchQuery?.trim()?.toLowerCase();

    return invoices?.filter((invoice) => {
      const matchesSearch =
        q === "" ||
        invoice?.domain_name?.toLowerCase()?.includes(q) ||
        invoice?.invoice_no?.toLowerCase()?.includes(q) ||
        invoice?.customer_name?.toLowerCase()?.includes(q) ||
        invoice?.plan_name?.toLowerCase()?.includes(q);

      const statusKey = getStatusKey(invoice?.status);
      const matchesStatus =
        selectedStatuses?.length === 0 || selectedStatuses?.includes(statusKey);

      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchQuery, selectedStatuses]);

  const allVisibleSelected =
    filteredInvoices?.length > 0 &&
    filteredInvoices?.every((invoice) =>
      selectedIds?.includes(invoice?.invoice_no),
    );

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      const visibleIds = new Set(
        filteredInvoices?.map((invoice) => invoice?.invoice_no),
      );
      setSelectedIds((prev) => prev?.filter((id) => !visibleIds?.has(id)));
      return;
    }

    const visibleIds = filteredInvoices?.map((invoice) => invoice?.invoice_no);
    setSelectedIds((prev) => [...new Set([...prev, ...visibleIds])]);
  };

  const toggleSelectOne = (invoiceNo) => {
    setSelectedIds((prev) =>
      prev?.includes(invoiceNo)
        ? prev.filter((id) => id !== invoiceNo)
        : [...prev, invoiceNo],
    );
  };

  const resultTotal = totalCount ?? invoices?.length;
  const showingEnd = filteredInvoices?.length;
  const showingStart = showingEnd > 0 ? 1 : 0;

  return (
    <div className="col">
      <div className={`${styles.sectionCard} ${styles.adjustWidth}`}>
        <div className={styles.filtersMain}>
          <div className="py-3 px-sm-4 px-3 border-bottom">
            <div className="row align-items-center justify-content-between">
              <div className="col-sm-auto order-sm-2">
                <search className={styles.pageSearchBox}>
                  <input
                    type="text"
                    className={`${styles.pageSearch} form-control`}
                    placeholder="Search Invoice"
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
              id="invoiceFilterSection"
            >
              <div className="p-sm-4 p-3">
                <div className="row g-4 mb-4">
                  <div className={`${styles.filterPart} col-auto`}>
                    <span className={styles.filterHead}>Status :</span>
                    <ul className={`${styles.filterGroup} gap-2`} role="group">
                      {statusOrder.map((status) => (
                        <li key={status}>
                          <input
                            type="checkbox"
                            className="btn-check"
                            id={`invoice_status_${status}`}
                            autoComplete="off"
                            checked={selectedStatuses.includes(status)}
                            onChange={() => toggleStatus(status)}
                          />
                          <label
                            className={`${styles.filterItem} rounded-pill`}
                            htmlFor={`invoice_status_${status}`}
                          >
                            {statusLabelMap[status]}
                          </label>
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
          className={`${styles.toolbar} py-2 px-sm-4 px-3 d-flex align-items-center justify-content-between`}
        >
          <label className="d-flex align-items-center gap-2 mb-0">
            <input
              type="checkbox"
              className="form-check-input"
              checked={allVisibleSelected}
              onChange={toggleSelectAll}
            />
            <span className={styles.checkAllLabel}>Check All</span>
          </label>
          <button
            type="button"
            className={styles.downloadListBtn}
            disabled={selectedIds?.length === 0}
          >
            <MdOutlineFileDownload className={styles.downloadListIcon} />
            Download List
          </button>
        </div>

        <div className={styles.listScrollArea}>
          <div className="py-4 px-sm-4 px-3">
            <div className="d-flex flex-column gap-3 mb-4">
              {!isInvoiceDataLoading ? (
                filteredInvoices?.length > 0 ? (
                  filteredInvoices?.map((invoice, idx) => (
                    <div
                      key={invoice?.invoice_no || idx}
                      className={`${styles.contentRow} btnDisplay`}
                    >
                      <div className="row align-items-center g-0">
                        <div className={`${styles.ckbCol} col-auto`}>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selectedIds?.includes(invoice?.invoice_no)}
                            onChange={() =>
                              toggleSelectOne(invoice?.invoice_no)
                            }
                          />
                        </div>

                        <div className="col">
                          <div className="row align-items-center py-3 px-2">
                            <div className="col-lg-2 col-md-3 col-12 mb-2 mb-md-0">
                              <div className={styles.invoiceMeta}>
                                <div className={styles.crDate}>
                                  {invoice?.date}
                                </div>
                                <div className={styles.crNumber}>
                                  {invoice?.invoice_no}
                                </div>
                              </div>
                            </div>

                            <div className="col-lg-4 col-md-5 col-12 mb-2 mb-md-0">
                              <div className="d-flex align-items-center">
                                <div
                                  className={`avatarSmall flex-shrink-0 ${avatarBgClasses[idx % avatarBgClasses.length]}`}
                                >
                                  {invoice?.domain_name
                                    ?.charAt(0)
                                    ?.toUpperCase()}
                                </div>
                                <div className="ps-2 min-w-0">
                                  <div className={styles.crDomainName}>
                                    {invoice?.domain_name}
                                  </div>
                                  <div className={`${styles.crName} mt-1`}>
                                    {invoice?.plan_name}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-lg-2 col-md-2 col-6 text-md-center">
                              <span
                                className={`${styles.statusBadge} ${getStatusBadgeClass(invoice?.status)}`}
                              >
                                {invoice?.status}
                              </span>
                            </div>

                            <div className="col-lg-2 col-md-2 col-6 text-md-center text-end text-md-center">
                              <span className={styles.amountValue}>
                                {invoice?.formatted_amount ||
                                  `₹ ${Number(invoice?.amount || 0).toFixed(2)}`}
                              </span>
                            </div>

                            <div
                              className={`col-lg-2 col-md-12 col-12 ${styles.actionsCol} mt-2 mt-lg-0`}
                            >
                              {showPayNow(invoice?.status) ? (
                                <button
                                  type="button"
                                  className={styles.payNowBtn}
                                  onClick={() =>
                                    router.push({
                                      pathname: "/order-summary",
                                      query: {
                                        order_id: invoice?.order_id,
                                      },
                                    })
                                  }
                                >
                                  Pay Now
                                </button>
                              ) : null}
                              <button
                                type="button"
                                className={styles.downloadBtn}
                                aria-label="Download invoice"
                              >
                                <MdOutlineFileDownload
                                  className={styles.downloadBtnIcon}
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center m-0">No Invoice Data</p>
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

export default AllInvoice;
