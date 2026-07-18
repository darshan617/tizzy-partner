import { useEffect, useMemo, useState } from "react";
import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
} from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import styles from "./SupportList.module.css";
import { useGetTicketsMutation } from "@/redux/apis/supportTicketsApi";
import Cookies from "js-cookie";
import Loader from "@/common-components/loader/Loader";
import { useRouter } from "next/router";
import Link from "next/link";
import { TiAttachment } from "react-icons/ti";

const tickets = [
  {
    id: "SUP2523",
    status: "Active",
    priority: "Medium Priority",
    title: "Can't access dashboard after update",
    plan: "Tizzy® Mail Enterprise – 100 GB",
    domain: "ganeshenterprises.com",
    createdAt: "20 Mar, 2026",
    initial: "G",
  },
  {
    id: "SUP2523",
    status: "In Process",
    priority: "High Priority",
    title: "Incorrect invoice total shown",
    plan: "Tizzy® Mail Enterprise – 100 GB",
    domain: "goyalinfotech.com",
    createdAt: "20 Mar, 2026",
    initial: "G",
  },
  {
    id: "SUP2523",
    status: "In Process",
    priority: "High Priority",
    title: "Incorrect invoice total shown",
    plan: "Tizzy® Mail Enterprise – 100 GB",
    domain: "goyalinfotech.com",
    createdAt: "20 Mar, 2026",
    initial: "G",
  },
  {
    id: "SUP2523",
    status: "Resolved",
    priority: "Low Priority",
    title: "Cannot change account email, updated twice from admin",
    plan: "Tizzy® Mail Enterprise – 100 GB",
    domain: "kingstonmarketing.net",
    createdAt: "20 Mar, 2026",
    initial: "K",
  },
  {
    id: "SUP2523",
    status: "Active",
    priority: "Medium Priority",
    title: "Can't access dashboard after update",
    plan: "Tizzy® Mail Enterprise – 100 GB",
    domain: "pinchthewallet.com",
    createdAt: "20 Mar, 2026",
    initial: "P",
  },
  {
    id: "SUP2523",
    status: "Active",
    priority: "Medium Priority",
    title: "Can't access dashboard after update",
    plan: "Tizzy® Mail Enterprise – 100 GB",
    domain: "pinchthewallet.com",
    createdAt: "20 Mar, 2026",
    initial: "P",
  },
  {
    id: "SUP2523",
    status: "Active",
    priority: "High Priority",
    title: "Incorrect invoice total shown, Duplicated invoice",
    plan: "Tizzy® Mail Enterprise – 100 GB",
    domain: "lorealpharma.in",
    createdAt: "20 Mar, 2026",
    initial: "K",
  },
  {
    id: "SUP2523",
    status: "In Process",
    priority: "Low Priority",
    title: "Cannot change account email, updated twice from admin",
    plan: "Tizzy® Mail Enterprise – 100 GB",
    domain: "ganeshenterprises.com",
    createdAt: "20 Mar, 2026",
    initial: "G",
  },
  {
    id: "SUP2523",
    status: "In Process",
    priority: "Low Priority",
    title: "Cannot change account email, updated twice from admin",
    plan: "Tizzy® Mail Enterprise – 100 GB",
    domain: "ganeshenterprises.com",
    createdAt: "20 Mar, 2026",
    initial: "G",
  },
  {
    id: "SUP2523",
    status: "Active",
    priority: "Medium Priority",
    title: "Can't access dashboard after update",
    plan: "Tizzy® Mail Enterprise – 100 GB",
    domain: "goyalinfotech.com",
    createdAt: "20 Mar, 2026",
    initial: "G",
  },
  {
    id: "SUP2523",
    status: "Resolved",
    priority: "High Priority",
    title: "Incorrect invoice total shown",
    plan: "Tizzy® Mail Enterprise – 100 GB",
    domain: "kingstonmarketing.net",
    createdAt: "20 Mar, 2026",
    initial: "K",
  },
  {
    id: "SUP2523",
    status: "Resolved",
    priority: "High Priority",
    title: "Incorrect invoice total shown",
    plan: "Tizzy® Mail Enterprise – 100 GB",
    domain: "kingstonmarketing.net",
    createdAt: "20 Mar, 2026",
    initial: "K",
  },
  {
    id: "SUP2523",
    status: "Resolved",
    priority: "High Priority",
    title: "Incorrect invoice total shown",
    plan: "Tizzy® Mail Enterprise - 100 GB",
    domain: "kingstonmarketing.net",
    createdAt: "20 Mar, 2026",
    initial: "T",
  },
  {
    id: "SUP2523",
    status: "Resolved",
    priority: "High Priority",
    title: "Incorrect invoice total shown",
    plan: "Tizzy® Mail Enterprise - 100 GB",
    domain: "kingstonmarketing.net",
    createdAt: "20 Mar, 2026",
    initial: "T",
  },
];

const statusFilters = ["All", "Active", "In Process", "Resolved"];
const priorityFilters = ["All", "High", "Medium", "Low"];
const avatarToneClasses = [
  "avatarGreen",
  "avatarBlue",
  "avatarPurple",
  "avatarGold",
  "avatarRose",
];

const SupportList = ({ ticketsData, isLoading }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const currentPage = 1;
  const itemsPerPage = 12;
  const totalTickets = 124000;
  const router = useRouter();
  const filteredTickets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return ticketsData?.filter((ticket) => {
      const matchesSearch =
        query === "" ||
        ticket?.ticket_no?.toLowerCase().includes(query) ||
        ticket?.description?.toLowerCase().includes(query) ||
        ticket?.service?.toLowerCase().includes(query) ||
        ticket?.domain?.toLowerCase().includes(query);

      const matchesStatus =
        selectedStatus === "All" || ticket?.status === selectedStatus;
      const matchesPriority =
        selectedPriority === "All" || ticket?.priority === selectedPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [ticketsData, searchQuery, selectedPriority, selectedStatus]);

  const paginatedTickets = filteredTickets?.slice(0, itemsPerPage);
  const showingStart = paginatedTickets?.length ? 1 : 0;
  const showingEnd = paginatedTickets?.length;

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
              from{" "}
              <span className="fw-medium darkColor">
                {ticketsData?.length || 0}
              </span>{" "}
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
                          onClick={() => setSelectedStatus(status)}
                          style={{
                            backgroundColor:
                              selectedStatus === status
                                ? "var(--primaryColor)"
                                : "",
                            color:
                              selectedStatus === status
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
                          onClick={() => setSelectedPriority(priority)}
                          style={{
                            backgroundColor:
                              selectedPriority === priority
                                ? "var(--primaryColor)"
                                : "",
                            color:
                              selectedPriority === priority
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
                            <TiAttachment size={22} />
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

                      <Link
                        href={`/support/ticket-details?ticket_id=${ticket?.ticket_id}`}
                        className={styles.arrowButton}
                        aria-label="Open ticket"
                      >
                        <FiChevronRight size={18} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center">No tickets found</div>
        )}

        {/* <div className={styles.pagination}>
          <button
            type="button"
            className={styles.pageNav}
            aria-label="Previous page"
          >
            <FiChevronLeft size={16} />
          </button>

          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              type="button"
              className={`${styles.pageButton} ${
                page === currentPage ? styles.pageButtonActive : ""
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            className={styles.pageNav}
            aria-label="Next page"
          >
            <FiChevronRight size={16} />
          </button>
        </div> */}
      </div>
    </section>
  );
};

export default SupportList;
