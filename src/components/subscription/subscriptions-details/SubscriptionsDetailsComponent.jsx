import { useEffect, useState } from "react";
import { CiGlobe } from "react-icons/ci";
import { IoMdArrowBack } from "react-icons/io";
import Link from "next/link";
import styles from "@/components/customers/customers-details/CustomerDetails.module.css";
import Layout from "@/components/layout/Layout";
import { useGetSubscriptionDetailsMutation } from "@/redux/apis/subscriptions";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { FaPen } from "react-icons/fa";
import { MdAutorenew } from "react-icons/md";
import Loader from "@/common-components/loader/Loader";

const planProviderIcons = [
  <svg
    key="tizzy"
    xmlns="http://www.w3.org/2000/svg"
    width="400"
    height="400"
    viewBox="0 0 400 400"
    className="icon"
  >
    <path
      fill="#34a853"
      d="M49,59s86.637-1.833,172,99L282,21,350,9V20s-36.234-2.265-53,43L144,391l-14-39,80-172S164.162,106.238,49,69V59Z"
    />
  </svg>,
  <svg
    key="ms"
    xmlns="http://www.w3.org/2000/svg"
    width="100"
    height="100"
    viewBox="0 0 48 48"
    className="icon"
  >
    <path fill="#ff5722" d="M6 6H22V22H6z" transform="rotate(-180 14 14)" />
    <path fill="#4caf50" d="M26 6H42V22H26z" transform="rotate(-180 34 14)" />
    <path fill="#ffc107" d="M26 26H42V42H26z" transform="rotate(-180 34 34)" />
    <path fill="#03a9f4" d="M6 26H22V42H6z" transform="rotate(-180 14 34)" />
  </svg>,
  <svg
    key="google"
    xmlns="http://www.w3.org/2000/svg"
    width="100"
    height="100"
    viewBox="0 0 48 48"
    className="icon"
  >
    <path
      fill="#1976d2"
      d="M38.193,18.359c-0.771-2.753-2.319-5.177-4.397-7.03l-4.598,4.598	c1.677,1.365,2.808,3.374,3.014,5.648v1.508c0.026,0,0.05-0.008,0.076-0.008c2.322,0,4.212,1.89,4.212,4.212S34.61,31.5,32.288,31.5	c-0.026,0-0.05-0.007-0.076-0.008V31.5h-6.666H24V38h8.212v-0.004c0.026,0,0.05,0.004,0.076,0.004C38.195,38,43,33.194,43,27.288	C43,23.563,41.086,20.279,38.193,18.359z"
    />
    <path
      fill="#4caf50"
      d="M15.712,31.5L15.712,31.5c-0.001,0-0.001,0-0.002,0c-0.611,0-1.188-0.137-1.712-0.373l-4.71,4.71	C11.081,37.188,13.301,38,15.71,38c0.001,0,0.001,0,0.002,0v0H24v-6.5H15.712z"
    />
    <path
      fill="#ffc107"
      d="M11.5,27.29c0-2.32,1.89-4.21,4.21-4.21c1.703,0,3.178,1.023,3.841,2.494l4.717-4.717	c-1.961-2.602-5.065-4.277-8.559-4.277C9.81,16.58,5,21.38,5,27.29c0,3.491,1.691,6.59,4.288,8.547l4.71-4.71	C12.53,30.469,11.5,28.999,11.5,27.29z"
    />
  </svg>,
];

const formatPlanStatus = (status) => {
  if (!status) return "-";
  if (status.toLowerCase() === "completed") return "Active";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const getPlanStatusClass = (status) => {
  const normalized = status?.toLowerCase();
  if (normalized === "completed" || normalized === "active")
    return styles.active;
  if (normalized === "expiring_soon" || normalized === "expiring") {
    return styles.expiring_soon;
  }
  if (normalized === "expired") return styles.expired;
  return "";
};

const getServicePath = (provider_id) => {
  if (provider_id === 1) return "tizzy";
  if (provider_id === 2) return "microsoft-solution-partner";
  if (provider_id === 3) return "google-workspace";
  return "google-workspace";
};

const SubscriptionsDetailsComponent = () => {
  const router = useRouter();
  const userData = Cookies.get("userData")
    ? JSON.parse(decodeURIComponent(Cookies.get("userData")))
    : {};
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [getSubscriptionDetails, { isLoading: isSubscriptionDetailsLoading }] =
    useGetSubscriptionDetailsMutation();

  const fetchSubscriptionDetails = async () => {
    if (!router?.query?.orderId) return;
    try {
      const res = await getSubscriptionDetails({
        body: {
          order_id: router?.query?.orderId,
        },
      });
      if (res?.data?.success) {
        setSubscriptionDetails(res?.data?.data);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    if (router?.isReady) {
      fetchSubscriptionDetails();
    }
  }, [router?.isReady, router?.query?.orderId]);

  const customer = subscriptionDetails?.customer;
  const plans = subscriptionDetails?.plans || [];
  const domainName = subscriptionDetails?.domain_name || plans?.[0]?.domain;
  const periodStart =
    subscriptionDetails?.subscription_start_date ||
    plans?.[0]?.subscription_start_date;
  const periodEnd =
    subscriptionDetails?.subscription_end_date ||
    plans?.[0]?.subscription_end_date;

  if (isSubscriptionDetailsLoading) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="row flex-column gy-4 py-4">
        <div className="col">
          <div className="row align-items-end">
            <div className="col">
              <nav className={`${styles.breadcrumb} mb-0`}>
                <Link href="/dashboard">Dashboard</Link> /{" "}
                {router?.query?.type === "renewals" ? (
                  <Link href="/renewals">Renewals</Link>
                ) : (
                  <Link href="/subscriptions">Subscriptions</Link>
                )}
                <span className="breadcrumb-item" />
                <h1 className="breadcrumb-item active" aria-current="page">
                  {router?.query?.type === "renewals"
                    ? "Renewal"
                    : "Subscription"}{" "}
                  - {router?.query?.orderId}
                </h1>
              </nav>
            </div>
            <div className="col-auto">
              <button
                onClick={() => router?.back()}
                className="btn small btnWhite"
              >
                <IoMdArrowBack />
                <span>Back</span>
              </button>
            </div>
          </div>
        </div>

        <div className="col">
          <div className={`${styles.sectionCard} py-4 py-sm-3 px-sm-4 px-3`}>
            <div className="row">
              <div
                className={`${styles.custProfBox} col-md-4 col-12 mb-3 mb-lg-0 position-relative`}
              >
                <div className="d-flex align-items-center mb-3">
                  <div
                    className={`${styles.profAvatar} ${styles.avatarColor_2} flex-shrink-0 text-capitalize`}
                    style={{ zoom: 1.4 }}
                  >
                    {customer?.company_name?.charAt(0) || "?"}
                  </div>
                  <div className={`${styles.profUser} mx-2`}>
                    <div
                      className={`${styles.profName} text-nowrap text-capitalize`}
                    >
                      <p className="mb-1">{customer?.company_name || "-"}</p>
                    </div>
                    {router?.query?.type !== "renewals" && (
                      <div className={`${styles.idBadge} mt-1`}>
                        Customer Id :{" "}
                        <strong>
                          {customer?.customer_id ||
                            router?.query?.customerId ||
                            "-"}
                        </strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-8 col-12 ps-md-4">
                <div className="row">
                  <div className="col-sm d-flex flex-wrap">
                    <div className="col-12 mb-3">
                      <small className="d-block textLight">Contact No.</small>
                      <Link
                        href={`tel:${customer?.mobile || ""}`}
                        className="text-muted"
                      >
                        {customer?.mobile || "-"}
                      </Link>
                    </div>
                  </div>

                  <div className="col-sm d-flex flex-wrap">
                    <div className="col-12 mb-3">
                      <small className="d-block textLight">
                        Contact Person
                      </small>
                      <div
                        className={`${styles.profName} fs-6 text-nowrap text-capitalize`}
                      >
                        {customer?.customer_name || "-"}
                      </div>
                      <div className="col-md-12 col-6 mb-3">
                        <Link
                          href={`mailto:${customer?.email || "#"}`}
                          className="text-muted"
                        >
                          {customer?.email || "-"}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className={`${styles.sectionCard} px-sm-4 px-3 py-1`}>
            <div className="border-bottom py-sm-2 py-3">
              <div className="row align-items-center position-relative">
                <div className="col-md-3 d-none d-md-block" />
                <div className="col-md-6 col text-center d-flex align-items-center justify-content-md-center">
                  <div className="d-inline-flex align-items-center domainSection">
                    <CiGlobe />
                    <h3 className="mb-0 ms-2 fw-semibold primaryColor">
                      {domainName || ""}
                    </h3>
                  </div>
                </div>
                {(plans?.[0]?.status?.toLowerCase() === "expiring" ||
                  plans?.[0]?.status?.toLowerCase() === "expired") && (
                  <div className="col-md-3 col-auto d-flex gap-2 justify-content-end">
                    <button
                      type="button"
                      onClick={() =>
                        router?.push({
                          pathname: "/order-summary",
                          query: {
                            type: "renew-plan",
                            order_id: subscriptionDetails?.order_id,
                          },
                        })
                      }
                      className={`${styles.crRenew} btn small btnWhite`}
                    >
                      <MdAutorenew
                        className="me-2"
                        size={14}
                        style={{ minWidth: "14px" }}
                      />
                      <span>Renew</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="py-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div>
                  <h2 className={styles.sectionCardHead}>
                    Current Subscription
                  </h2>
                </div>
                <div>
                  <small className="text-decoration-underline">
                    <Link
                      href={{
                        pathname: "/subscriptions/domain-history",
                        query: {
                          domains: domainName,
                          customerId: router?.query?.customerId,
                        },
                      }}
                    >
                      View History
                    </Link>
                  </small>
                </div>
              </div>

              {plans?.length > 0 ? (
                plans.map((plan) => (
                  <div
                    key={plan?.order_sub_id}
                    className={`${styles.contentRow} noHover`}
                  >
                    <div className="row align-items-center">
                      <div className="col-xl-3 col-12 d-flex align-items-center">
                        <div>
                          <p
                            className={`${styles.servBadge} m-0 flex-shrink-0`}
                          >
                            {planProviderIcons?.[plan?.provider_id - 1] || "-"}
                          </p>
                        </div>
                        <div className="ms-2">
                          <div className="fw-medium">
                            {plan?.plan_name || "-"}
                          </div>
                        </div>
                      </div>
                      <div className="col-xl col-md-9 col-sm-8">
                        <div className="row text-sm-center align-items-start justify-content-around gy-3">
                          <div className="col-md-auto col-sm-6 col-8">
                            <small className="d-block textLight">Price</small>
                            <span>₹ {plan?.subtotal ?? "-"}</span>
                            <small className="d-block">per user/year</small>
                          </div>
                          <div className="col-md-auto col-sm-6 col-4">
                            <small className="d-block textLight">License</small>
                            <span>{plan?.licenses ?? "-"}</span>
                            <button
                              type="button"
                              className={`${styles.iconBtn} btnWhite btn`}
                              onClick={() =>
                                router?.push({
                                  pathname: "/order-summary",
                                  query: {
                                    type: "renew-plan",
                                    order_id: subscriptionDetails?.order_id,
                                  },
                                })
                              }
                            >
                              <FaPen size={10} />
                            </button>
                          </div>
                          <div className="col-md-auto col-sm-6 col-8">
                            <small className="d-block textLight">Period</small>
                            <span>
                              {plan?.subscription_start_date ||
                                periodStart ||
                                "-"}{" "}
                              -{" "}
                              {plan?.subscription_end_date || periodEnd || "-"}
                            </span>
                          </div>
                          <div className="col-md-auto col-sm-6 col-4 align-self-center">
                            <div
                              className={`${styles.statusBadge} ${getPlanStatusClass(plan?.status)}`}
                            >
                              {formatPlanStatus(plan?.status)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-2 col-md-3 col-sm-4 col-12 text-center">
                        <div className={`${styles.updwngrade} text-uppercase`}>
                          <Link
                            href={{
                              pathname: `/services/${getServicePath(plan?.provider_id)}`,
                              query: {
                                type: "upgrade",
                                order_id: subscriptionDetails?.order_id,
                                customer_id: router?.query?.customerId,
                                plan_id: plan?.plan_id,
                                order_sub_id: plan?.order_sub_id,
                              },
                            }}
                            className={styles.updwngradeBtn}
                            onClick={() => {
                              Cookies.remove("customerData");
                              Cookies.set(
                                "customerData",
                                JSON.stringify({
                                  partner_id: userData?.id,
                                  customer_id: router?.query?.customerId,
                                  domain_name: domainName,
                                }),
                              );
                            }}
                          >
                            UPGRADE
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center">
                  <p className="text-muted">No plans found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SubscriptionsDetailsComponent;
