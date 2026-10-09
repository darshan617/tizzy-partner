import { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiFilter } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import styles from "./SupportList.module.css";
import Loader from "@/common-components/loader/Loader";
import PaginationNew from "@/common-components/pagination/PaginationNew";
import Link from "next/link";
import { TiAttachment } from "react-icons/ti";
import usePermissions from "@/custom-hooks/permissions/usePermissions";

const statusFilters = ["All", "Open", "In Process", "Resolved"];
const priorityFilters = ["All", "High", "Medium", "Low"];
const avatarToneClasses = [
  "avatarGreen",
  "avatarBlue",
  "avatarPurple",
  "avatarGold",
  "avatarRose",
];

const SupportList = ({
  ticketsData,
  isLoading,
  currentPage,
  setCurrentPage,
  itemPerPage,
  paginationData,
  totalCount,
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  selectedPriority,
  setSelectedPriority,
}) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const { canView } = usePermissions();

  const paginatedTickets = ticketsData || [];
  const pageSize = Number(paginationData?.per_page || itemPerPage) || 1;
  const resultTotal = Number(totalCount || 0);
  const pageCount =
    Number(paginationData?.last_page) || Math.ceil(resultTotal / pageSize);
  const visiblePageCount = Math.min(pageCount, 5);
  const firstVisiblePage = Math.max(
    1,
    Math.min(currentPage - 2, pageCount - visiblePageCount + 1),
  );
  const pageNumbersArray = Array.from(
    { length: visiblePageCount },
    (_, index) => firstVisiblePage + index,
  );
  const showingStart =
    paginationData?.from ??
    (paginatedTickets.length > 0 ? (currentPage - 1) * pageSize + 1 : 0);
  const showingEnd =
    paginationData?.to ??
    Math.min(
      (currentPage - 1) * pageSize + paginatedTickets.length,
      resultTotal,
    );

  const handleStatusChange = (status) => {
    setSelectedStatus(status.toLowerCase());
    setCurrentPage(1);
  };

  const handlePriorityChange = (priority) => {
    setSelectedPriority(priority.toLowerCase());
    setCurrentPage(1);
  };

  return (
    <section className={`${styles.wrapper} sectionCard`}>
      <div className={styles.filtersMain}>
        <div className="py-3 px-sm-4 px-3 border-bottom">
          <div className="row align-items-center justify-content-between">
            <div className="col-sm-auto order-sm-2">
              <search className={styles.pageSearchBox}>
                <input
                  type="text"
                  className={`${styles.pageSearch} form-control`}
                  placeholder="Search Ticket"
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
              from <span className="fw-medium darkColor">{totalCount}</span>{" "}
              Tickets
            </div>
          </div>
        </div>

        <div className={styles.filterWrapper}>
          <div
            className={`collapse${filterOpen ? " show" : ""}`}
            id="filterSection"
          >
            <div className="p-sm-4 p-3">
              <div className="row g-4 mb-4">
                <div className={`${styles.filterPart} col-auto`}>
                  <span className={styles.filterHead}>Status :</span>
                  <ul className={`${styles.filterGroup} gap-2`} role="group">
                    {statusFilters.map((status) => (
                      <li key={status}>
                        <button
                          type="button"
                          className={`${styles.filterItem} rounded-pill`}
                          onClick={() => handleStatusChange(status)}
                          style={{
                            backgroundColor:
                              selectedStatus === status.toLowerCase()
                                ? "var(--primaryColor)"
                                : "",
                            color:
                              selectedStatus === status.toLowerCase()
                                ? "var(--whiteColor)"
                                : "var(--darkColor)",
                          }}
                        >
                          {status}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`${styles.filterPart} col-auto`}>
                  <span className={styles.filterHead}>Priority :</span>
                  <ul className={`${styles.filterGroup} gap-2`} role="group">
                    {priorityFilters?.map((priority) => (
                      <li key={priority}>
                        <button
                          type="button"
                          className={`${styles.filterItem} rounded-pill`}
                          onClick={() => handlePriorityChange(priority)}
                          style={{
                            backgroundColor:
                              selectedPriority === priority.toLowerCase()
                                ? "var(--primaryColor)"
                                : "",
                            color:
                              selectedPriority === priority.toLowerCase()
                                ? "var(--whiteColor)"
                                : "var(--darkColor)",
                          }}
                        >
                          {priority}
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

      <div className={styles.listContent}>
        {isLoading ? (
          <Loader />
        ) : paginatedTickets?.length > 0 ? (
          <>
            <div className={styles.grid}>
              {paginatedTickets?.map((ticket, index) => (
                <article
                  key={`${ticket.id}-${index}`}
                  className={styles.ticketCard}
                >
                  <div className={styles.cardHeader}>
                    <div className={styles.ticketMeta}>
                      <span className={styles.ticketId}>
                        # {ticket?.ticket_no || "-"}
                      </span>
                      <span
                        className={`${styles.statusBadge} ${
                          ticket?.status === "Active"
                            ? styles.statusActive
                            : ticket?.status === "Resolved"
                              ? styles.statusResolved
                              : styles.statusInProcess
                        }`}
                      >
                        {ticket?.status || "-"}
                      </span>
                    </div>

                    <div className={styles.createdBlock}>
                      <span>Created on</span>
                      <strong>{ticket?.date || "-"}</strong>
                    </div>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.priorityBlock}>
                      <span
                        className={`${styles.priorityBadge} ${
                          ticket?.priority?.toLowerCase() === "high"
                            ? styles.priorityHigh
                            : ticket?.priority?.toLowerCase() === "low"
                              ? styles.priorityLow
                              : styles.priorityMedium
                        }`}
                      >
                        {ticket?.priority || "-"}
                      </span>
                      <div className={styles.attachments}>
                        {ticket?.attachments_count >= 0 && (
                          <>
                            <TiAttachment size={20} />
                            {ticket?.attachments_count}
                          </>
                        )}
                      </div>
                    </div>

                    <h3 className={styles.ticketTitle}>
                      {ticket?.description || "-"}
                    </h3>
                    <p className={styles.ticketPlan}>
                      {ticket?.service || "-"}
                    </p>

                    <div className={styles.cardFooter}>
                      <div className={styles.domainWrap}>
                        <span
                          className={`${styles.avatar} ${
                            styles[
                              avatarToneClasses[
                                index % avatarToneClasses.length
                              ]
                            ]
                          }`}
                        >
                          {ticket?.domain?.charAt(0) || "-"}
                        </span>
                        <span className={styles.domainName}>
                          {ticket?.domain || "-"}
                        </span>
                      </div>

                      {canView("support") && (
                        <Link
                          href={`/support/ticket-details?ticket_id=${ticket?.ticket_id}`}
                          className={styles.arrowButton}
                          aria-label="Open ticket"
                        >
                          <FiChevronRight size={18} />
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center">No tickets found</div>
        )}

        {pageNumbersArray.length > 0 && (
          <PaginationNew
            pageNumbersArray={pageNumbersArray}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            itemPerPage={pageSize}
            lastPage={pageCount}
          />
        )}
      </div>
    </section>
  );
};

export default SupportList;
