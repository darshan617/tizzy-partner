import { useEffect, useState } from "react";
import styles from "@/components/customers/all-customers/AllCustomers.module.css";
import { useGetAllCustomersQuery } from "@/redux/apis/customerApi";
import Cookies from "js-cookie";
import Loader from "@/components/common-components/loader/Loader";
import { FiFilter } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { useRouter } from "next/router";

const SERVICE_TITLES = {
  tizzy: "Tizzy Mail",
  microsoft: "Microsoft Solutions",
  google: "Google Cloud",
};

export default function CustomerList({
  allCustomers,
  isFetchingAllCustomers,
  refetch,
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [checkedCustomers, setCheckedCustomers] = useState([]);

  // const userData = Cookies.get("userData")
  // ? JSON.parse(decodeURIComponent(Cookies.get("userData")))
  // : {};

  // const {data: allCustomers, isFetching: isFetchingAllCustomers, refetch} = useGetAllCustomersQuery({
  //   partner_id: userData?.id,
  // })
  // console.log(allCustomers);

  const toggleStatus = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );
  };

  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service],
    );
  };

  const toggleCustomer = (id) => {
    setCheckedCustomers((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const filteredCustomers = ["k", "h"].filter((c) => {
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

  function toCamelCase(str) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

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
              <div
                className={`${styles.searchCount} col-sm-auto order-sm-1 text-center my-2 my-sm-0 `}
              >
                Showing <span className="fw-medium darkColor">1 - 10</span> from{" "}
                <span className="fw-medium darkColor">
                  {allCustomers?.data?.customers?.length}
                </span>{" "}
                Customers
              </div>
            </div>
          </div>

          <div className={`${styles.filterWrapper} `}>
            <div
              className={`collapse${filterOpen ? " show" : ""}`}
              id="filterSection"
            >
              <div className="p-sm-4 p-3 ">
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
                        {
                          id: "service_2",
                          key: "microsoft",
                          label: "Microsoft Solutions",
                        },
                        {
                          id: "service_3",
                          key: "google",
                          label: "Google Cloud",
                        },
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
                          <label
                            className={`${styles.filterItem}  rounded-pill`}
                            htmlFor={id}
                          >
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
              className="filterBtn btn small btnDefault "
              onClick={() => setFilterOpen((prev) => !prev)}
              aria-expanded={filterOpen}
            >
              {filterOpen ? (
                <>
                  <IoClose className="icon me-2" />
                  <span>Close</span>
                </>
              ) : (
                <>
                  <FiFilter className="icon me-2" />
                  <span>Filters</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className={styles.listScrollArea}>
          <div className="py-5 px-sm-4 px-3">
            <div
              className={`${styles.CustomerList} d-flex flex-column gap-3 mb-5`}
            >
              {isFetchingAllCustomers ? (
                <Loader />
              ) : allCustomers?.data?.customers?.length > 0 ? (
                allCustomers?.data?.customers?.map((customer, idx) => (
                  <div
                    key={idx}
                    className={`${styles.contentRow} ${styles.btnDisplay}`}
                  >
                    <div className="row align-items-center">
                      {/* <div className={`${styles.ckbCol} col-sm-auto col-6  order-sm-1 `}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`cust_${customer?.id}`}
                          checked={checkedCustomers.includes(customer?.id)}
                          onChange={() => toggleCustomer(customer?.id)}
                        />
                      </div> */}

                      <div className="col-sm order-sm-2">
                        <div className="row align-items-center py-3">
                          <div className="col-8 col-sm-7 d-flex align-items-center flex-wrap">
                            <div className="col-lg-6 col-12">
                              <div
                                className={`${styles.crDomain} d-flex align-items-center`}
                              >
                                <div
                                  className={`avatarSmall flex-shrink-0 ${styles.avatarBg}`}
                                >
                                  {customer?.name?.charAt(0)}
                                </div>
                                <div className={`${styles.crDomainName} ps-2`}>
                                  {toCamelCase(customer?.company)}
                                </div>
                              </div>
                              <div className={`${styles.crName} ms-4 ps-2`}>
                                {customer?.name}
                              </div>
                            </div>
                            <div className="col-lg-6 col-12">
                              <div
                                className={`${styles.crDescription}  ms-4 ps-2`}
                              >
                                {customer?.email}
                              </div>
                              <div
                                className={`${styles.crDescription}  ms-4 ps-2`}
                              >
                                {customer?.mobile}
                              </div>
                            </div>
                          </div>

                          <div className="col-4 col-sm-5 d-flex align-items-center flex-wrap gap-2 gap-md-0">
                            {/* <div className="col-md col-12 text-center">
                              {customer?.services?.map((service) => (
                                <div
                                  key={service}
                                  className={`servBadge ${service}`}
                                  title={SERVICE_TITLES[service]}
                                />
                              ))}
                            </div> */}
                            <div className="col-md col-12 text-center">
                              <div className="d-flex flex-column align-items-center">
                                <span
                                  className={`${styles.statusBadgeStyle} ${customer?.status === "active" ? "successBg" : "dangerBg"}`}
                                >
                                  {customer?.status?.toUpperCase()}
                                </span>
                                <small className="textSecondary mt-1">
                                  Created on{" "}
                                  <span className="d-inline-block">
                                    {customer?.created_date}
                                  </span>
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-sm-auto col-6 align-self-stretch d-flex align-items-center justify-content-end order-sm-3 mobAction">
                        <button
                          className="crBtn"
                          onClick={() =>
                            router.push({
                              pathname: "/customers/customer-details",
                              query: {
                                customerId: customer?.id,
                              },
                            })
                          }
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
                            className="icon me-0"
                          >
                            <path d="m9 18 6-6-6-6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                "No Customer Data"
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
