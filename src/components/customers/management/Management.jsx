import { useState } from "react";
import styles from '@/components/customers/management/Management.module.css'

const customers = [
  {
    id: 1,
    initial: "G",
    avatarBg: "warningBg",
    domain: "ganeshenterprises.com",
    name: "Ganesh Singh",
    email: "ganesh@ganeshenterprises.com",
    phone: "+91-981234 56780",
    services: ["tizzy"],
    status: "Active",
    statusBg: "successBg",
    createdOn: "25 Jun, 2021",
  },
  {
    id: 2,
    initial: "A",
    avatarBg: "secondaryBg",
    domain: "goyalinfotech.com",
    name: "Ashwini Kumar",
    email: "ashwini@gmail.com",
    phone: "+91-981234 56780",
    services: ["google"],
    status: "Active",
    statusBg: "successBg",
    createdOn: "25 Jun, 2021",
  },
  {
    id: 3,
    initial: "P",
    avatarBg: "successBg",
    domain: "kingstonmarketing.net",
    name: "Paresh Pandya",
    email: "paresh@kingstonmarketing.net",
    phone: "+91-981234 56780",
    services: ["microsoft"],
    status: "Inactive",
    statusBg: "dangerBg",
    createdOn: "25 Jun, 2021",
  },
  {
    id: 4,
    initial: "G",
    avatarBg: "infoBg",
    domain: "pinchthewallet.com",
    name: "Gaurav Bansal",
    email: "gaurav@gmail.com",
    phone: "+91-981234 56780",
    services: ["tizzy", "google"],
    status: "Active",
    statusBg: "successBg",
    createdOn: "25 Jun, 2021",
  },
  {
    id: 5,
    initial: "G",
    avatarBg: "dangerBg",
    domain: "ganeshenterprises.com",
    name: "Ganesh Singh",
    email: "ganesh@ganeshenterprises.com",
    phone: "+91-981234 56780",
    services: ["google"],
    status: "Closed",
    statusBg: "warningBg",
    createdOn: "25 Jun, 2021",
  },
  {
    id: 6,
    initial: "G",
    avatarBg: "warningBg",
    domain: "ganeshenterprises.com",
    name: "Ganesh Singh",
    email: "ganesh@ganeshenterprises.com",
    phone: "+91-981234 56780",
    services: ["tizzy"],
    status: "Active",
    statusBg: "successBg",
    createdOn: "25 Jun, 2021",
  },
  {
    id: 7,
    initial: "A",
    avatarBg: "secondaryBg",
    domain: "goyalinfotech.com",
    name: "Ashwini Kumar",
    email: "ashwini@gmail.com",
    phone: "+91-981234 56780",
    services: ["google"],
    status: "Active",
    statusBg: "successBg",
    createdOn: "25 Jun, 2021",
  },
  {
    id: 8,
    initial: "P",
    avatarBg: "successBg",
    domain: "kingstonmarketing.net",
    name: "Paresh Pandya",
    email: "paresh@kingstonmarketing.net",
    phone: "+91-981234 56780",
    services: ["microsoft"],
    status: "Inactive",
    statusBg: "dangerBg",
    createdOn: "25 Jun, 2021",
  },
  {
    id: 9,
    initial: "G",
    avatarBg: "infoBg",
    domain: "pinchthewallet.com",
    name: "Gaurav Bansal",
    email: "gaurav@gmail.com",
    phone: "+91-981234 56780",
    services: ["tizzy", "google"],
    status: "Active",
    statusBg: "successBg",
    createdOn: "25 Jun, 2021",
  },
  {
    id: 10,
    initial: "G",
    avatarBg: "dangerBg",
    domain: "ganeshenterprises.com",
    name: "Ganesh Singh",
    email: "ganesh@ganeshenterprises.com",
    phone: "+91-981234 56780",
    services: ["google"],
    status: "Closed",
    statusBg: "warningBg",
    createdOn: "25 Jun, 2021",
  },
];

const SERVICE_TITLES = {
  tizzy: "Tizzy Mail",
  microsoft: "Microsoft Solutions",
  google: "Google Cloud",
};

export default function CustomerList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [checkedCustomers, setCheckedCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(2);

  const toggleStatus = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const toggleCustomer = (id) => {
    setCheckedCustomers((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      searchQuery === "" ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatuses.length === 0 || selectedStatuses.includes(c.status);

    const matchesService =
      selectedServices.length === 0 ||
      selectedServices.some((s) => c.services.includes(s));

    return matchesSearch && matchesStatus && matchesService;
  });

  const totalPages = [1, 2, 3, 4, 5];

  return (
    <div className="col">
      <div className={`${styles.sectionCard} ${styles.adjustWidth} `}>
        <div className={`${styles.filtersMain}`}>
          {/* Search & Count Header */}
          <div className="py-3 px-sm-4 px-3 border-bottom">
            <div className="row align-items-center justify-content-between">
              <div className="col-sm-auto order-sm-2">
                <search className={`${styles.pageSearchBox}`}>
                  <input
                    type="text"
                    className={`${styles.pageSearch} form-control`}
                    placeholder="Search Customers"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className={`${styles.searchBtn}`}>
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
                      className="icon"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                  </button>
                </search>
              </div>
              <div className={`${styles.searchCount} col-sm-auto order-sm-1 text-center my-2 my-sm-0 `}>
                Showing{" "}
                <span className="fw-medium darkColor">1 - 10</span> from{" "}
                <span className="fw-medium darkColor">124000</span> Customers
              </div>
            </div>
          </div>

          <div className={`${styles.filterWrapper}`}>
            <div className={`collapse${filterOpen ? " show" : ""}`} id="filterSection">
              <div className="p-sm-4 p-3">
                <div className="row g-4 mb-4">
                  <div className={`${styles.filterPart} col-auto `}>
                    <span className={`${styles.filterHead}`}>Status :</span>
                    <ul className={`${styles.filterGroup} gap-2`} role="group">
                      {["Active", "Inactive", "Closed"].map((status, i) => (
                        <li key={status}>
                          <input
                            type="checkbox"
                            className="btn-check"
                            id={`status_${i + 1}`}
                            autoComplete="off"
                            checked={selectedStatuses.includes(status)}
                            onChange={() => toggleStatus(status)}
                          />
                          <label
                            className={`${styles.filterItem} rounded-pill`}
                            htmlFor={`status_${i + 1}`}
                          >
                            {status}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={`${styles.filterPart} col-auto`}>
                    <span className={`${styles.filterHead}`}>Services :</span>
                    <ul className={`${styles.filterGroup} gap-2`} role="group">
                      {[
                        { id: "service_1", key: "tizzy", label: "Tizzy Mail" },
                        { id: "service_2", key: "microsoft", label: "Microsoft Solutions" },
                        { id: "service_3", key: "google", label: "Google Cloud" },
                      ].map(({ id, key, label }) => (
                        <li key={id}>
                          <input
                            type="checkbox"
                            className="btn-check"
                            id={id}
                            autoComplete="off"
                            name="services"
                            checked={selectedServices.includes(key)}
                            onChange={() => toggleService(key)}
                          />
                          <label className={`${styles.filterItem}  rounded-pill`} htmlFor={id}>
                            {label}
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
              className="filterBtn btn small btnDefault"
              onClick={() => setFilterOpen((prev) => !prev)}
              aria-expanded={filterOpen}
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
                className="icon me-2"
              >
                <line x1="3" x2="21" y1="6" y2="6" />
                <line x1="7" x2="17" y1="12" y2="12" />
                <line x1="11" x2="13" y1="18" y2="18" />
              </svg>{" "}
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="py-5 px-sm-4 px-3">
          <div className={`${styles.CustomerList} d-flex flex-column gap-3 mb-5`}>
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className={`${styles.contentRow} ${styles.btnDisplay}`}>
                <div className="row align-items-center">
                  <div className={`${styles.ckbCol} col-sm-auto col-6  order-sm-1 `}>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`cust_${customer.id}`}
                      checked={checkedCustomers.includes(customer.id)}
                      onChange={() => toggleCustomer(customer.id)}
                    />
                  </div>

                  <div className="col-sm order-sm-2">
                    <div className="row align-items-center">
                      <div className="col-8 col-sm-7 d-flex align-items-center flex-wrap">
                        <div className="col-lg-6 col-12">
                          <div className={`${styles.crDomain} d-flex align-items-center`}>
                            <div className={`avatarSmall flex-shrink-0 ${customer.avatarBg}`}>
                              {customer.initial}
                            </div>
                            <div className={`${styles.crDomainName} ps-2`}>{customer.domain}</div>
                          </div>
                          <div className={`${styles.crDescription} ms-4 ps-2`}>{customer.name}</div>
                        </div>
                        <div className="col-lg-6 col-12">
                          <div className={`${styles.crDescription}  ms-4 ps-2`}>{customer.email}</div>
                          <div className={`${styles.crDescription}  ms-4 ps-2`}>{customer.phone}</div>
                        </div>
                      </div>

                      <div className="col-4 col-sm-5 d-flex align-items-center flex-wrap gap-2 gap-md-0">
                        <div className="col-md col-12 text-center">
                          {customer.services.map((service) => (
                            <div
                              key={service}
                              className={`servBadge ${service}`}
                              title={SERVICE_TITLES[service]}
                            />
                          ))}
                        </div>
                        <div className="col-md col-12 text-center">
                          <div className="d-flex flex-column align-items-center">
                            <span className={`statusBadge ${customer.statusBg}`}>
                              {customer.status}
                            </span>
                            <small className="textSecondary mt-1">
                              Created on{" "}
                              <span className="d-inline-block">{customer.createdOn}</span>
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-auto col-6 align-self-stretch d-flex align-items-center justify-content-end order-sm-3 mobAction">
                    <a href="/customer_profile" className="crBtn">
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
                        className="icon me-0"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <nav aria-label="contentPagination">
            <ul className="pagination justify-content-center gap-1">
              <li className="page-item">
                <a
                  className="page-link"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((p) => Math.max(1, p - 1));
                  }}
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
                    className="icon"
                  >
                    <path d="m12 19-7-7 7-7" />
                    <path d="M19 12H5" />
                  </svg>
                </a>
              </li>
              {totalPages.map((page) => (
                <li
                  key={page}
                  className={`page-item${currentPage === page ? " active" : ""}`}
                >
                  <a
                    className="page-link"
                    href="#"
                    aria-current={currentPage === page ? "page" : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(page);
                    }}
                  >
                    {page}
                  </a>
                </li>
              ))}
              <li className="page-item">
                <a
                  className="page-link"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((p) => Math.min(totalPages.length, p + 1));
                  }}
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
                    className="icon"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}