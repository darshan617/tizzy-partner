import { useEffect, useMemo, useState } from "react";
import styles from "@/components/customers/all-customers/AllCustomers.module.css";
import { useGetAllCustomersQuery } from "@/redux/apis/customerApi";
import Cookies from "js-cookie";
import Loader from "@/common-components/loader/Loader";
import { FiFilter } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { useRouter } from "next/router";
import { CUSTOMER_STATUS } from "@/constants/customer-constants";

const avatarColorClasses = [
  styles.avatarRed,
  styles.avatarGold,
  styles.avatarBlue,
  styles.avatarPurple,
  styles.avatarTeal,
  styles.avatarNavy,
];

export default function CustomerList({
  allCustomers,
  isFetchingAllCustomers,
  refetch,
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState("all");
  const [selectedServices, setSelectedServices] = useState("all");
  console.log(selectedStatuses, "selectedServices");

  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service],
    );
  };

  function toCamelCase(str) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  const filteredCustomers = useMemo(
    () =>
      allCustomers?.data?.customers?.filter((customer) => {
        const q = searchQuery?.trim()?.toLowerCase();
        const matchesSearch =
          q === "" ||
          customer?.company?.toLowerCase()?.includes(q) ||
          customer?.name?.toLowerCase()?.includes(q) ||
          customer?.email?.toLowerCase()?.includes(q) ||
          customer?.mobile?.toLowerCase()?.includes(q) ||
          customer?.customer_no?.toLowerCase()?.includes(q);
        const matchesStatus =
          selectedStatuses === "all"
            ? true
            : selectedStatuses === customer?.status?.toLowerCase();

        return matchesSearch && matchesStatus;
      }),
    [searchQuery, selectedStatuses, allCustomers?.data?.customers],
  );

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
                Showing{" "}
                <span className="fw-medium darkColor">
                  1 - {allCustomers?.data?.customers?.length}
                </span>{" "}
                from{" "}
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
                      {CUSTOMER_STATUS?.map((status, i) => (
                        <li key={status?.key}>
                          <input
                            type="checkbox"
                            className="btn-check"
                            id={`status_${status?.key}`}
                            autoComplete="off"
                            checked={selectedStatuses === status?.key}
                            onChange={() =>
                              setSelectedStatuses(
                                selectedStatuses === status?.key
                                  ? "all"
                                  : status?.key,
                              )
                            }
                          />
                          <label
                            className={`${styles.filterItem} rounded-pill`}
                            htmlFor={`status_${status?.key}`}
                            style={{
                              backgroundColor:
                                selectedStatuses === status?.key
                                  ? "var(--primaryColor)"
                                  : "",
                              color:
                                selectedStatuses === status?.key
                                  ? "var(--whiteColor)"
                                  : "var(--darkColor)",
                            }}
                          >
                            {status?.label}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* <div className={`${styles.filterPart} col-auto`}>
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
                  </div> */}
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
          <div className="">
            <div className={`${styles.CustomerList} mb-5`}>
              {isFetchingAllCustomers ? (
                <Loader />
              ) : filteredCustomers?.length > 0 ? (
                filteredCustomers?.map((customer, idx) => (
                  <div
                    key={idx}
                    className={`${styles.contentRow} ${styles.btnDisplay} px-3 px-sm-4`}
                  >
                    <div className={styles.customerRow}>
                      <div className={styles.companyCol}>
                        <div className={styles.companyInfo}>
                          <div
                            className={`${styles.customerAvatar} ${avatarColorClasses[idx % avatarColorClasses.length]}`}
                          >
                            {customer?.company?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className={styles.companyText}>
                            <div className={styles.companyName}>
                              {toCamelCase(customer?.company)}
                            </div>
                            <div className={styles.contactName}>
                              {customer?.name}
                            </div>
                            <p className={styles.customerId}>
                              Customer Id:{customer?.customer_no ?? " -"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className={styles.contactCol}>
                        <div className={styles.contactEmail}>
                          {customer?.email}
                        </div>
                        <div className={styles.contactPhone}>
                          {customer?.mobile}
                        </div>
                      </div>

                      <div className={styles.servicesCol}>
                        {customer?.services?.map((service) => (
                          <img key={service} />
                        ))}
                      </div>

                      <div className={styles.statusCol}>
                        <span
                          className={`${styles.statusBadge} ${customer?.status === "active" ? styles.activeBadge : styles.inactiveBadge}`}
                        >
                          {customer?.status}
                        </span>
                      </div>

                      <div className={styles.dateCol}>
                        Created on {customer?.created_date}
                      </div>

                      <div className={`${styles.actionCol} mobAction`}>
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
                <p className="text-center m-0">No Customer Data</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
