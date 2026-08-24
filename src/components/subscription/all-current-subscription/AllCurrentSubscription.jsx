import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "@/components/subscription/all-current-subscription/AllCurrentSubscription.module.css";
import { FiFilter, FiLayers } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { FiUsers } from "react-icons/fi";
import { BiChevronRight, BiGlobe } from "react-icons/bi";
import { TbRefresh } from "react-icons/tb";
import { IoMdArrowBack } from "react-icons/io";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useAllCustomersDetailsQuery } from "@/redux/apis/customerApi";
import Loader from "@/common-components/loader/Loader";
import { SIDEBAR_SERVICES_CONSTANTS } from "@/components/layout/sidebar/SidebarConstant";

const statusOrder = [
  "active",
  "processing",
  // "pending",
  "draft",
  "expiring",
  "upgraded",
  "downgraded",
  "renewed",
  "cancelled",
  "upgrade pending",
  "downgrade pending",
  "renewal pending",
];

const statusLabelMap = {
  active: "Active",
  expiring: "Expiring",
  pending: "Pending",
  downgraded: "Downgraded",
  draft: "Draft",
  cancelled: "Cancelled",
  upgraded: "Upgraded",
  renewed: "Renewed",
  "upgrade pending": "Upgrade Pending",
  "downgrade pending": "Downgrade Pending",
  "renewal pending": "Renewal Pending",
  processing: "Processing",
};

const statusProvider = [
  {
    id: 3,
    name: "Google Workspace",
  },
  {
    id: 2,
    name: "Microsoft 365",
  },
  {
    id: 1,
    name: "Tizzy",
  },
];

const AllCurrentSubscription = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState("all");
  const [hasMounted, setHasMounted] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState(null);
  const router = useRouter();

  // js-cookie is browser-only; wait until mount so SSR and first client paint match
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const userData = hasMounted
    ? Cookies.get("userData")
      ? JSON.parse(Cookies.get("userData"))
      : {}
    : {};

  const { data: allCustomersDetails, isLoading } = useAllCustomersDetailsQuery(
    {
      partner_id: userData?.id,
      customer_id: router?.query?.customer_id,
    },
    { skip: !hasMounted || !userData?.id || !router?.query?.customer_id },
  );

  const customers = allCustomersDetails?.data?.customers || [];

  const allSubscriptions = useMemo(
    () =>
      customers.flatMap((customer) =>
        (customer?.subscriptions || []).map((subscription) => ({
          ...subscription,
          customer_id: customer?.customer_id,
          customer_name: customer?.customer_name,
          customer_no: customer?.customer_no,
        })),
      ),
    [customers],
  );

  const filteredSubscriptions = useMemo(() => {
    return allSubscriptions.filter((subscription) => {
      const matchesCustomer =
        !router?.query?.customerId ||
        Number(subscription?.customer_id) === Number(router?.query?.customerId);

      const matchesStatus =
        selectedStatuses === "all"
          ? true
          : subscription?.status?.toLowerCase() === selectedStatuses;

      const matchesProvider =
        selectedProviderId == null ||
        subscription?.provider_id === selectedProviderId;

      return matchesCustomer && matchesStatus && matchesProvider;
    });
  }, [
    allSubscriptions,
    router?.query?.customerId,
    selectedStatuses,
    selectedProviderId,
  ]);

  const selectedCustomer = customers.find(
    (customer) =>
      Number(customer?.customer_id) === Number(router?.query?.customerId),
  );

  const breadcrumbCustomerLabel =
    selectedCustomer?.customer_no ||
    selectedCustomer?.customer_name ||
    router?.query?.customerId ||
    "All";

  const totalCount = filteredSubscriptions.length;

  return (
    <div
      className={styles.container}
      style={{ width: "100%", maxWidth: "1100px", margin: "auto" }}
    >
      <div className={styles.breadcrumbs} aria-label="Breadcrumb">
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
          }}
        >
          <Link href="/dashboard" className={styles.breadcrumbLink}>
            Dashboard
          </Link>
          <span className={styles.separator}>/</span>
          <Link href="/customers" className={styles.breadcrumbLink}>
            Customers
          </Link>
          <span className={styles.separator}>/</span>
          <span className={styles.crumbCurrent}>
            Customer - {breadcrumbCustomerLabel}
          </span>
        </span>
        <div className="col-auto">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn small btnWhite"
          >
            <IoMdArrowBack />
            <span>Back</span>
          </button>
        </div>
      </div>

      <div className={styles.title}>
        <h1>Customer Current Subscriptions</h1>
      </div>

      <div className={styles.filtersMain}>
        <div className="py-3 px-sm-4 px-3 border-bottom">
          <div className="row align-items-center justify-content-between">
            <div className="col-sm-auto order-sm-2">
              {/* <Link
                href="/subscriptions/all-subscriptions"
                className={styles.viewAllLink}
              >
                <span>View All</span>
              </Link> */}
            </div>
            <h2 className={styles.subTitle}>Current Subscriptions</h2>
            <div
              className={`${styles.searchCount} col-sm-auto order-sm-1 text-center my-2 my-sm-0`}
            >
              Showing{" "}
              <span className="fw-medium darkColor">
                {totalCount > 0 ? `1 - ${totalCount}` : "0"}
              </span>{" "}
              from <span className="fw-medium darkColor">{totalCount}</span>{" "}
              Subscriptions
            </div>
          </div>
        </div>

        <div className={`${styles.filterWrapper} `} id="filterSection">
          <div
            className={`collapse${filterOpen ? " show" : ""}`}
            id="filterSection"
          >
            <div className="p-sm-4 p-3">
              <div className="row g-4 mb-4">
                <div className={`${styles.filterPart} col-auto`}>
                  <span className={styles.filterHead}>Status :</span>
                  <div className="d-flex align-items-start">
                    <ul className={`${styles.filterGroup} gap-2`} role="group">
                      {statusOrder.map((status) => (
                        <li key={status}>
                          <button
                            className={`${styles.filterItem} rounded-pill`}
                            onClick={() =>
                              selectedStatuses === status
                                ? setSelectedStatuses("all")
                                : setSelectedStatuses(status)
                            }
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
                    <ul className={`${styles.filterGroup} gap-2`} role="group">
                      {statusProvider.map((status) => (
                        <li key={status}>
                          <button
                            className={`${styles.filterItem} rounded-pill`}
                            onClick={() =>
                              selectedProviderId === status?.id
                                ? setSelectedProviderId(null)
                                : setSelectedProviderId(status?.id)
                            }
                            style={{
                              backgroundColor:
                                selectedProviderId === status?.id
                                  ? "var(--primaryColor)"
                                  : "",
                              color:
                                selectedProviderId === status?.id
                                  ? "var(--whiteColor)"
                                  : "var(--darkColor)",
                            }}
                          >
                            {status?.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
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

      <div className="col">
        <div className={`${styles.pageWrap} py-4`}>
          {!hasMounted || isLoading ? (
            <Loader />
          ) : totalCount === 0 ? (
            <div className={`${styles.card} p-sm-2 p-1 text-center`}>
              <p className="m-0">No Subscriptions</p>
            </div>
          ) : (
            filteredSubscriptions.map((subscription, idx) => {
              const statusKey =
                subscription?.status?.toLowerCase()?.replaceAll(" ", "_") || "";

              return (
                <div
                  className={`${styles.card} p-sm-2 p-1 mb-1`}
                  key={
                    subscription?.subscription_no ||
                    subscription?.subscription_id ||
                    idx
                  }
                >
                  <div className={`${styles.subRow}`}>
                    <div className={`${styles.subTop}`}>
                      <div className={`${styles.subPlan}`}>
                        <p
                          className={`${styles.subPlanIcon} m-0 flex-shrink-0`}
                        >
                          {SIDEBAR_SERVICES_CONSTANTS.find(
                            (service) =>
                              service?.id === subscription?.provider_id,
                          )?.image || "-"}
                        </p>
                        <div className="ms-2">
                          <div className={`${styles.subPlanName}`}>
                            {subscription?.plan_name || "-"}
                          </div>
                          <small className={`${styles.subPlanPrice}`}>
                            ₹{subscription?.price ?? "-"}{" "}
                            <span>Per User / Per Year</span>
                          </small>
                        </div>
                      </div>

                      <span
                        className={`${styles.statusBadge} ${styles?.[statusKey] || ""}`}
                      >
                        {subscription?.status || "-"}
                      </span>
                    </div>

                    <div className={`${styles.subBottom}`}>
                      <div className={`${styles.subMeta} ps-1`}>
                        <div className={`${styles.subMetaItem}`}>
                          <FiLayers className={`${styles.subMetaIcon}`} />
                          <div className={`${styles.subMetaValue}`}>
                            {subscription?.subscription_no || "-"}
                          </div>
                        </div>
                        <div className={`${styles.subMetaItem}`}>
                          <BiGlobe className={`${styles.subMetaIcon}`} />
                          <div>
                            <div className={`${styles.subMetaValue}`}>
                              {subscription?.domain_name || "-"}
                            </div>
                          </div>
                        </div>
                        <div className={`${styles.subMetaItem}`}>
                          <FiUsers className={`${styles.subMetaIcon}`} />
                          <div>
                            <div className={`${styles.subMetaValue}`}>
                              {subscription?.license_count ??
                                subscription?.quantity ??
                                "-"}{" "}
                              Users
                            </div>
                          </div>
                        </div>
                        <div className={`${styles.subMetaItem}`}>
                          <TbRefresh className={`${styles.subMetaIcon}`} />
                          <div>
                            <div className={`${styles.subMetaValue}`}>
                              {subscription?.end_date || "-"}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={`${styles.subActions}`}>
                        <button
                          className={styles.subActionBtnViewMore}
                          onClick={() => {
                            router?.push({
                              pathname: `/plan-details`,
                              query: {
                                planId: subscription?.plan_id,
                                orderId: subscription?.order_id,
                              },
                            });
                          }}
                        >
                          <BiChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AllCurrentSubscription;
