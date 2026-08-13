import { useEffect, useMemo, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import {
  ChevronRight,
  Plus,
  Calendar,
  Globe,
  Users,
  FileCheck,
  Ticket,
  UserRound,
  WandSparkles,
  SquarePen,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import styles from "@/components/customers/customers-details/CustomerDetails.module.css";
import Layout from "@/components/layout/Layout";
import { useGetSpecificCustomerDetailsQuery } from "@/redux/apis/customerApi";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { BsPlusCircleDotted } from "react-icons/bs";
import { FiLayers } from "react-icons/fi";
import { usePartialUpgradeAddToCartMutation } from "@/redux/apis/addToCartApi";
import {
  useInvoicesPaymentDetailsMutation,
  usePaymentVerifyMutation,
} from "@/redux/apis/invoiceApi";
import { useToast } from "@/custom-hooks/toast/ToastProvider";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { BiChevronRight } from "react-icons/bi";
import { MdOutlineFileDownload } from "react-icons/md";
import DownloadExcel from "@/common-components/download-excel/DownloadExcel";
import Pagination from "@/common-components/pagination/Pagination";
import Loader from "@/common-components/loader/Loader";

const TXN_ITEM_PER_PAGE = 5;

const txnDownloadColumns = [
  { label: "Date", key: "created_at" },
  { label: "Order No", key: "order_no" },
  { label: "Domain", key: "domain_name" },
  { label: "Plan", key: "order_name" },
  { label: "Status", key: "status" },
  { label: "Amount", key: "price" },
];

const invoiceDownloadColumns = [
  {
    label: "Date",
    key: "date",
    getValue: (inv) => inv?.date || inv?.created_at || "",
  },
  {
    label: "Invoice No",
    key: "invoice_no",
    getValue: (inv) => inv?.invoice_no || inv?.order_no || "",
  },
  { label: "Domain Name", key: "domain_name" },
  {
    label: "Plan Name",
    key: "plan_name",
    getValue: (inv) => inv?.plan_name || inv?.order_name || inv?.plan || "",
  },
  { label: "Status", key: "status" },
  {
    label: "Amount",
    key: "amount",
    getValue: (inv) => inv?.amount ?? inv?.price ?? "",
  },
];

const getTxnStatusKey = (status) =>
  String(status || "")
    .trim()
    .toLowerCase();

const getTxnStatusClass = (status, stylesMap) => {
  const key = getTxnStatusKey(status);
  if (["completed", "success", "paid", "active"].includes(key)) {
    return stylesMap.txnStatusSuccess;
  }
  if (["pending", "processing"].includes(key)) {
    return stylesMap.txnStatusPending;
  }
  if (["failed", "cancelled", "rejected", "overdue"].includes(key)) {
    return stylesMap.txnStatusFailed;
  }
  return stylesMap.txnStatusDefault;
};

const formatTxnStatus = (status) => {
  const key = getTxnStatusKey(status);
  if (!key) return "-";
  if (key === "completed") return "Success";
  return key.charAt(0).toUpperCase() + key.slice(1);
};

const formatTxnAmount = (amount) => {
  const num = Number(amount || 0);
  return `₹ ${num.toFixed(2)}`;
};

const showInvoicePayNow = (status) => {
  const key = getTxnStatusKey(status);
  return key === "pending" || key === "overdue";
};

const getInvoiceId = (invoice) =>
  invoice?.invoice_id ||
  invoice?.id ||
  invoice?.invoice_no ||
  invoice?.order_no;

const isInvoiceSelectable = (invoice) => {
  const key = getTxnStatusKey(invoice?.status);
  return key !== "paid" && key !== "cancelled";
};

export default function CustomerDetail() {
  const { showToast } = useToast();
  const router = useRouter();
  const [txnTab, setTxnTab] = useState("transactions");
  const [txnPage, setTxnPage] = useState(1);
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState([]);
  console.log(selectedInvoiceIds);

  const userData = Cookies.get("userData")
    ? JSON.parse(decodeURIComponent(Cookies.get("userData")))
    : {};
  const {
    data: customerDetailsData,
    isLoading: isCustomerDetailsLoading,
    refetch: refetchCustomerDetails,
  } = useGetSpecificCustomerDetailsQuery(
    {
      customer_id: router?.query?.customerId,
      partner_id: userData?.id,
    },
    {
      skip: !router.isReady || !router?.query?.customerId,
      refetchOnMountOrArgChange: true,
    },
  );
  const [
    partialUpgradeAddToCart,
    { isLoading: isPartialUpgradeAddToCartLoading },
  ] = usePartialUpgradeAddToCartMutation();
  const [invoicesPaymentDetails] = useInvoicesPaymentDetailsMutation();
  const [paymentVerify] = usePaymentVerifyMutation();

  const customerDetails = customerDetailsData?.data?.customer;
  const allPlans = customerDetailsData?.data?.current_plans;
  const allTransactions = customerDetailsData?.data?.transaction_history || [];
  const allInvoices = customerDetailsData?.data?.invoices || [];
  const summary = customerDetailsData?.data?.summary;
  const txnTotal = allTransactions?.length || 0;
  const txnStartIndex = (txnPage - 1) * TXN_ITEM_PER_PAGE;
  const txnEndIndex = Math.min(txnStartIndex + TXN_ITEM_PER_PAGE, txnTotal);
  const pagedTransactions =
    allTransactions?.slice(txnStartIndex, txnStartIndex + TXN_ITEM_PER_PAGE) ||
    [];

  const selectableInvoiceIds = useMemo(
    () =>
      allInvoices
        ?.filter(isInvoiceSelectable)
        ?.map(getInvoiceId)
        ?.filter(Boolean) || [],
    [allInvoices],
  );

  const allInvoicesSelected =
    selectableInvoiceIds.length > 0 &&
    selectableInvoiceIds.every((id) => selectedInvoiceIds.includes(id));

  const toggleSelectAllInvoices = () => {
    setSelectedInvoiceIds((prev) =>
      selectableInvoiceIds.every((id) => prev.includes(id))
        ? prev.filter((id) => !selectableInvoiceIds.includes(id))
        : [...new Set([...prev, ...selectableInvoiceIds])],
    );
  };

  const toggleSelectInvoice = (invoiceId) => {
    if (!invoiceId) return;
    setSelectedInvoiceIds((prev) =>
      prev.includes(invoiceId)
        ? prev.filter((id) => id !== invoiceId)
        : [...prev, invoiceId],
    );
  };

  const handleInvoicePayNow = async (invoiceId, type = "single") => {
    if (!invoiceId) return;
    try {
      const res = await invoicesPaymentDetails({
        body: {
          invoice_id: type === "single" ? [invoiceId] : selectedInvoiceIds,
        },
      });
      if (res?.data?.success || res?.data?.status) {
        showToast(res?.data?.message, "success");
        const razorpay = res?.data?.data;
        const options = {
          key: razorpay.razorpay_key,
          amount: razorpay.amount,
          currency: razorpay.currency,
          name: razorpay.customer_name,
          order_id: razorpay.order_id,
          handler: async function (response) {
            const verifyPaymentRes = await paymentVerify({
              body: {
                invoice_id:
                  type === "single" ? [invoiceId] : selectedInvoiceIds,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                razorpay_order_id: response.razorpay_order_id,
              },
            });
            if (
              verifyPaymentRes?.data?.success ||
              verifyPaymentRes?.data?.status
            ) {
              showToast(
                verifyPaymentRes?.data?.message || "Payment Successful",
                "success",
              );
            } else {
              showToast(
                verifyPaymentRes?.data?.message || "Payment Failed",
                "error",
              );
            }
            await refetchCustomerDetails();
          },
          theme: { color: "#3399cc" },
        };
        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", async function (response) {
          showToast(response.error.description, "error");
          await refetchCustomerDetails();
        });
        rzp.open();
      } else {
        showToast(res?.data?.message || res?.error?.data?.message, "error");
      }
    } catch (error) {
      showToast(error?.data?.message || error?.error?.data?.message, "error");
    }
  };

  useEffect(() => {
    const initSwiper = async () => {
      const { default: Swiper } = await import("swiper");
      const { Scrollbar, Mousewheel } = await import("swiper/modules");

      new Swiper(".supportSwiper", {
        modules: [Scrollbar, Mousewheel],
        slidesPerView: 1.1,
        spaceBetween: 15,
        scrollbar: {
          el: ".swiper-scrollbar",
          hide: false,
          draggable: true,
          dragSize: 80,
          snapOnRelease: true,
        },
        mousewheel: {
          forceToAxis: false,
          releaseOnEdges: true,
          sensitivity: 0.5,
        },
        breakpoints: {
          576: { slidesPerView: 1.4, spaceBetween: 20 },
          768: { slidesPerView: 1.8, spaceBetween: 20 },
          992: { slidesPerView: 2.1, spaceBetween: 20 },
          1200: { slidesPerView: 2.4, spaceBetween: 20 },
          1400: { slidesPerView: 2.8, spaceBetween: 20 },
        },
      });
    };

    initSwiper();
  }, []);

  const plansImg = [
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="400"
      height="400"
      viewBox="0 0 400 400"
      class="icon"
    >
      <path
        fill="#34a853"
        d="M49,59s86.637-1.833,172,99L282,21,350,9V20s-36.234-2.265-53,43L144,391l-14-39,80-172S164.162,106.238,49,69V59Z"
      ></path>
    </svg>,
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="100"
      height="100"
      viewBox="0 0 48 48"
      class="icon"
    >
      <path
        fill="#ff5722"
        d="M6 6H22V22H6z"
        transform="rotate(-180 14 14)"
      ></path>
      <path
        fill="#4caf50"
        d="M26 6H42V22H26z"
        transform="rotate(-180 34 14)"
      ></path>
      <path
        fill="#ffc107"
        d="M26 26H42V42H26z"
        transform="rotate(-180 34 34)"
      ></path>
      <path
        fill="#03a9f4"
        d="M6 26H22V42H6z"
        transform="rotate(-180 14 34)"
      ></path>
    </svg>,
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="100"
      height="100"
      viewBox="0 0 48 48"
      class="icon"
    >
      <path
        fill="#1976d2"
        d="M38.193,18.359c-0.771-2.753-2.319-5.177-4.397-7.03l-4.598,4.598	c1.677,1.365,2.808,3.374,3.014,5.648v1.508c0.026,0,0.05-0.008,0.076-0.008c2.322,0,4.212,1.89,4.212,4.212S34.61,31.5,32.288,31.5	c-0.026,0-0.05-0.007-0.076-0.008V31.5h-6.666H24V38h8.212v-0.004c0.026,0,0.05,0.004,0.076,0.004C38.195,38,43,33.194,43,27.288	C43,23.563,41.086,20.279,38.193,18.359z"
      ></path>
      <path
        fill="#ffe082"
        d="M19.56,25.59l4.72-4.72c-0.004-0.005-0.008-0.009-0.011-0.013l-4.717,4.717	C19.554,25.579,19.557,25.584,19.56,25.59z"
        opacity=".5"
      ></path>
      <path
        fill="#90caf9"
        d="M19.56,25.59l4.72-4.72c-0.004-0.005-0.008-0.009-0.011-0.013l-4.717,4.717	C19.554,25.579,19.557,25.584,19.56,25.59z"
        opacity=".5"
      ></path>
      <path
        fill="#ff3d00"
        d="M24,7.576c-8.133,0-14.75,6.617-14.75,14.75c0,0.233,0.024,0.46,0.035,0.69h6.5	c-0.019-0.228-0.035-0.457-0.035-0.69c0-4.549,3.701-8.25,8.25-8.25c1.969,0,3.778,0.696,5.198,1.851l4.598-4.598	C31.188,9.003,27.761,7.576,24,7.576z"
      ></path>
      <path
        fill="#90caf9"
        d="M15.712,31.5L15.712,31.5c-0.001,0-0.001,0-0.002,0c-0.611,0-1.188-0.137-1.712-0.373	l-4.71,4.71C11.081,37.188,13.301,38,15.71,38c0.001,0,0.001,0,0.002,0v0H24v-6.5H15.712z"
        opacity=".5"
      ></path>
      <path
        fill="#4caf50"
        d="M15.712,31.5L15.712,31.5c-0.001,0-0.001,0-0.002,0c-0.611,0-1.188-0.137-1.712-0.373l-4.71,4.71	C11.081,37.188,13.301,38,15.71,38c0.001,0,0.001,0,0.002,0v0H24v-6.5H15.712z"
      ></path>
      <path
        fill="#ffc107"
        d="M11.5,27.29c0-2.32,1.89-4.21,4.21-4.21c1.703,0,3.178,1.023,3.841,2.494l4.717-4.717	c-1.961-2.602-5.065-4.277-8.559-4.277C9.81,16.58,5,21.38,5,27.29c0,3.491,1.691,6.59,4.288,8.547l4.71-4.71	C12.53,30.469,11.5,28.999,11.5,27.29z"
      ></path>
    </svg>,
  ];

  const allInnerPlans =
    allPlans?.flatMap((plan) =>
      (plan?.plans || []).map((innerPlan) => ({
        ...innerPlan,
        domain_name: plan?.domain_name,
      })),
    ) || [];

  const metricCards = [
    {
      title: "Total Subscriptions",
      value: summary?.total_subscriptions || 0,
      badge: "Active",
      icon: <FiLayers size={18} />,
      iconTheme: "metricIconBlue",
    },
    {
      title: "Renewals Due",
      value: summary?.renewals_due || 0,
      badge: "This Month",
      icon: <FileCheck size={18} />,
      iconTheme: "metricIconOrange",
    },
    {
      title: "Total Spent",
      value: `₹${summary?.total_spent?.toFixed(2)}`,
      badge: "Life Time",
      icon: <FaIndianRupeeSign size={16} />,
      iconTheme: "metricIconTeal",
    },
    {
      title: "Open Tickets",
      value: summary?.open_tickets || 0,
      badge: "Active",
      icon: <Ticket size={18} />,
      iconTheme: "metricIconPink",
    },
  ];

  const getServicePath = (provider_id) => {
    if (provider_id === 1) return "tizzy";
    if (provider_id === 2) return "microsoft-365";
    if (provider_id === 3) return "google-workspace";
    return "google-workspace";
  };

  const handlePartialUpgrade = async (plan) => {
    console.log("Plan", plan);
    try {
      const res = await partialUpgradeAddToCart({
        body: {
          partner_id: userData?.id,
          order_id: plan?.order_id,
          order_sub_id: plan?.order_sub_id,
          licenses: plan?.license_count,
          customer_id: router?.query?.customerId,
        },
      });

      if (res?.data?.success) {
        console.log("Res", res?.data?.data);
        router?.push({
          pathname: "/order-summary",
          query: {
            type: "partial-upgrade",
            order_id: plan?.order_id,
            order_sub_id: plan?.order_sub_id,
            licenses: plan?.license_count,
            customer_id: router?.query?.customerId,
            main_cart_id: res?.data?.data?.main_cart_id,
          },
        });
      } else {
        showToast(res?.error?.data?.message, "error");
      }
    } catch (error) {
      console.log("partialUpgradeAddToCart Error", error);
      showToast("Something went wrong", "error");
    }
  };

  return (
    <Layout>
      {isCustomerDetailsLoading ? (
        <Loader />
      ) : (
        <div className="row flex-column gy-4 py-4">
          <div className="col">
            <div className={`${styles.pageWrap}`}>
              <div className={`${styles.headerRow} row align-items-end`}>
                <div className="col">
                  <nav className={`${styles.breadcrumbs} mb-0`}>
                    <Link href={"/dashboard"}>Dashboard</Link> /{" "}
                    <Link href={"/customers"}>Customer</Link>
                    <h1
                      className={`${styles.breadcrumbItem} active fs-4`}
                      aria-current="page"
                    >
                      Customer - {customerDetails?.name}
                    </h1>
                  </nav>
                </div>
                <div className="col-auto">
                  <Link href="/customers" className="btn small btnWhite">
                    <IoMdArrowBack />
                    <span>Back</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="col">
            <div className={`${styles.pageWrap}`}>
              <div className="row gy-4">
                {/* LEFT: Profile + Quick Action */}
                <div className="col-lg-4 col-12">
                  <div className="d-flex flex-column gap-3">
                    <div className={styles.sideCard}>
                      <div className={styles.sideCardHeader}>
                        <div className={styles.sideCardTitle}>
                          <UserRound size={18} strokeWidth={1.75} />
                          <span>Customer Information</span>
                        </div>
                        <span
                          className={`${styles.custStatusBadge} ${
                            String(
                              customerDetails?.status || "",
                            ).toLowerCase() === "active" ||
                            !customerDetails?.status
                              ? styles.custStatusActive
                              : styles.custStatusInactive
                          }`}
                        >
                          {customerDetails?.status
                            ? String(customerDetails.status)
                                .charAt(0)
                                .toUpperCase() +
                              String(customerDetails.status).slice(1)
                            : "Active"}
                        </span>
                      </div>

                      <div className={styles.sideCardBody}>
                        <div className={styles.custIdentity}>
                          <div
                            className={`${styles.custAvatar} text-capitalize`}
                          >
                            {customerDetails?.company_name?.charAt(0) || "-"}
                          </div>
                          <div className={styles.custIdentityMeta}>
                            <h2
                              className={`${styles.custCompanyName} text-capitalize`}
                            >
                              {customerDetails?.company_name || "-"}
                            </h2>
                            <div className={styles.custIdBadge}>
                              Customer Id : {customerDetails?.id || "-"}
                            </div>
                          </div>
                        </div>

                        <div className={styles.infoItem}>
                          <small className={styles.infoLabel}>Full Name</small>
                          <div
                            className={`${styles.infoValue} text-capitalize`}
                          >
                            {customerDetails?.name || "-"}
                          </div>
                        </div>

                        <div className={styles.infoItem}>
                          <small className={styles.infoLabel}>Email</small>
                          <div className={styles.infoValue}>
                            <Link
                              href={`mailto:${customerDetails?.email || "#"}`}
                            >
                              {customerDetails?.email || "-"}
                            </Link>
                          </div>
                        </div>

                        <div className={styles.infoItem}>
                          <small className={styles.infoLabel}>
                            Contact No.
                          </small>
                          <div className={styles.infoValue}>
                            <Link
                              href={`tel:${customerDetails?.mobile || "#"}`}
                            >
                              {customerDetails?.mobile || "-"}
                            </Link>
                          </div>
                        </div>

                        <div className={styles.infoItem}>
                          <small className={styles.infoLabel}>GSTIN</small>
                          <div className={styles.infoValue}>
                            {customerDetails?.gstin || "-"}
                          </div>
                        </div>

                        <div className={styles.infoItem}>
                          <small className={styles.infoLabel}>PAN No.</small>
                          <div className={`${styles.infoValue} text-uppercase`}>
                            {customerDetails?.pan_no || "-"}
                          </div>
                        </div>

                        <div className={styles.infoItem}>
                          <small className={styles.infoLabel}>Address</small>
                          <address
                            className={`${styles.infoValue} text-capitalize mb-0`}
                          >
                            {customerDetails?.company_address || "-"}
                          </address>
                        </div>

                        <div className={`${styles.infoItem} mb-0`}>
                          <small className={styles.infoLabel}>Create On</small>
                          <div className={styles.infoValue}>
                            {customerDetails?.created_at || "-"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={styles.sideCard}>
                      <div className={styles.sideCardHeader}>
                        <div className={styles.sideCardTitle}>
                          <WandSparkles size={18} strokeWidth={1.75} />
                          <span>Quick Action</span>
                        </div>
                      </div>

                      <div className={styles.quickActionBody}>
                        <Link
                          href={`/customers/edit-customer?customerId=${router?.query?.customerId}`}
                          className={styles.quickActionItem}
                        >
                          <SquarePen size={16} strokeWidth={1.75} />
                          <span>Edit Customer</span>
                        </Link>
                        <Link
                          href={`/services/google-workspace?customerId=${router?.query?.customerId}`}
                          className={styles.quickActionItem}
                        >
                          <ShoppingCart size={16} strokeWidth={1.75} />
                          <span>Create Order</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-8 col-12">
                  <div className="row flex-column gy-4">
                    <div className="col">
                      <div className="row g-3">
                        {metricCards.map((metric, index) => (
                          <div className="col-6 col-xl-3" key={index}>
                            <div className={styles.metricCard}>
                              <div className={styles.metricCardTop}>
                                <div
                                  className={`${styles.metricIcon} ${styles[metric.iconTheme]}`}
                                >
                                  {metric.icon}
                                </div>
                                <span className={styles.metricBadge}>
                                  {metric.badge}
                                </span>
                              </div>
                              <div className={styles.metricTitle}>
                                {metric.title}
                              </div>
                              <div className={styles.metricValue}>
                                {metric.value}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="col">
                      <div className={`${styles.pageWrap}`}>
                        <div className={`${styles.card} p-sm-4 p-3`}>
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <h2 className={`${styles.cardHead}`}>
                              Current Subscription{" "}
                              <span>({allInnerPlans?.length || 0})</span>
                            </h2>
                            {allInnerPlans?.length > 0 && (
                              <Link
                                href={`/subscriptions/all-subscriptions`}
                                className={`${styles.viewAll} text-decoration-underline`}
                              >
                                View All
                              </Link>
                            )}
                          </div>

                          {allInnerPlans?.length === 0 ? (
                            <div className="text-center d-flex flex-column align-items-center justify-content-center gap-2 py-3">
                              <p className="m-0">No Subscriptions</p>
                              <button
                                className="small btnDefault btn"
                                onClick={() =>
                                  router.push("/services/google-workspace")
                                }
                              >
                                <BsPlusCircleDotted
                                  className="me-2"
                                  size={14}
                                />
                                <span>Buy New Subscription</span>
                              </button>
                            </div>
                          ) : (
                            allInnerPlans
                              ?.slice(0, 5)
                              ?.map((innerPlan, idx) => (
                                <div className={`${styles.subRow}`} key={idx}>
                                  <div className={`${styles.subTop}`}>
                                    <div className={`${styles.subPlan}`}>
                                      <p
                                        className={`${styles.subPlanIcon} m-0 flex-shrink-0`}
                                      >
                                        {plansImg?.[
                                          innerPlan?.provider_id - 1
                                        ] || "-"}
                                      </p>
                                      <div className="ms-2">
                                        <div
                                          className={`${styles.subPlanName}`}
                                        >
                                          {innerPlan?.plan_name || "-"}
                                        </div>
                                        <small
                                          className={`${styles.subPlanPrice}`}
                                        >
                                          ₹{innerPlan?.price}{" "}
                                          <span>Per User / Per Year</span>
                                        </small>
                                      </div>
                                    </div>

                                    <span
                                      className={`${styles.statusBadge} ${styles?.[innerPlan?.status?.toLowerCase()?.replace(" ", "_")]}`}
                                    >
                                      {innerPlan?.status || "-"}
                                    </span>
                                  </div>

                                  <div className={`${styles.subBottom}`}>
                                    <div className={`${styles.subMeta} ps-1`}>
                                      <div className={`${styles.subMetaItem}`}>
                                        <FiLayers
                                          className={`${styles.subMetaIcon}`}
                                        />
                                        <div
                                          className={`${styles.subMetaValue}`}
                                        >
                                          #{innerPlan?.subscription_id}
                                        </div>
                                      </div>
                                      <div className={`${styles.subMetaItem}`}>
                                        <Calendar
                                          className={`${styles.subMetaIcon}`}
                                        />
                                        <div>
                                          <div
                                            className={`${styles.subMetaValue}`}
                                          >
                                            {innerPlan?.start_date} -{" "}
                                            {innerPlan?.end_date}
                                          </div>
                                        </div>
                                      </div>

                                      <div className={`${styles.subMetaItem}`}>
                                        <Globe
                                          className={`${styles.subMetaIcon}`}
                                        />
                                        <div>
                                          <div
                                            className={`${styles.subMetaValue}`}
                                          >
                                            {innerPlan?.domain_name || "-"}
                                          </div>
                                        </div>
                                      </div>

                                      <div className={`${styles.subMetaItem}`}>
                                        <Users
                                          className={`${styles.subMetaIcon}`}
                                        />
                                        <div>
                                          <div
                                            className={`${styles.subMetaValue}`}
                                          >
                                            {innerPlan?.license_count || "-"}{" "}
                                            Users
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* <div className={`${styles.subActions}`}>
                                  {(innerPlan?.status?.toLowerCase() ===
                                    "expiring" ||
                                    innerPlan?.status?.toLowerCase() ===
                                      "expired") && (
                                    <button
                                      className={`${styles.subRenewBtn}`}
                                      onClick={() =>
                                        router?.push({
                                          pathname: "/order-summary",
                                          query: {
                                            type: "renew-plan",
                                            order_id: innerPlan?.order_id,
                                            order_sub_id:
                                              innerPlan?.order_sub_id,
                                            planId: innerPlan?.plan_id,
                                          },
                                        })
                                      }
                                    >
                                      Renew
                                    </button>
                                  )}
                                  {innerPlan?.status?.toLowerCase() !==
                                    "draft" &&
                                    innerPlan?.status?.toLowerCase() !==
                                      "pending" && (
                                      <>
                                        <Link
                                          href={{
                                            pathname: `/services/${
                                              innerPlan?.provider_name ===
                                              "Tizzy Mail"
                                                ? "tizzy"
                                                : innerPlan?.provider_name ===
                                                    "Microsoft 365"
                                                  ? "microsoft-365"
                                                  : "google-workspace"
                                            }`,
                                            query: {
                                              type: "upgrade",
                                              order_id: innerPlan?.order_id,
                                              customer_id:
                                                router?.query?.customerId,
                                              plan_id: innerPlan?.plan_id,
                                              order_sub_id:
                                                innerPlan?.order_sub_id,
                                            },
                                          }}
                                          className={`${styles.subUpgradeBtn}`}
                                          onClick={() => {
                                            Cookies.remove("customerData");
                                            Cookies.set(
                                              "customerData",
                                              JSON.stringify({
                                                partner_id: userData?.id,
                                                customer_id:
                                                  router?.query?.customerId,
                                                domain_name:
                                                  innerPlan?.domain_name,
                                              }),
                                            );
                                          }}
                                        >
                                          Upgrade
                                        </Link>
                                        <button
                                          onClick={() =>
                                            handlePartialUpgrade(innerPlan)
                                          }
                                          className={styles.subUpgradeTextLink}
                                        >
                                          Partial Upgrade
                                        </button>
                                      </>
                                    )}
                                  {(innerPlan?.status?.toLowerCase() ===
                                    "expiring" ||
                                    innerPlan?.status?.toLowerCase() ===
                                      "expired") && (
                                    <>
                                      <Link
                                        className={`${styles.subUpgradeBtn}`}
                                        href={{
                                          pathname: `/services/${getServicePath(
                                            innerPlan?.provider_id,
                                          )}`,
                                          query: {
                                            type: "downgrade",
                                            order_id: innerPlan?.order_id,
                                            customer_id:
                                              router?.query?.customerId,
                                            plan_id: innerPlan?.plan_id,
                                            order_sub_id:
                                              innerPlan?.order_sub_id,
                                          },
                                        }}
                                        onClick={() => {
                                          Cookies.remove("customerData");
                                          Cookies.set(
                                            "customerData",
                                            JSON.stringify({
                                              partner_id: userData?.id,
                                              customer_id:
                                                router?.query?.customerId,
                                              domain_name:
                                                innerPlan?.domain_name,
                                            }),
                                          );
                                        }}
                                      >
                                        Downgrade
                                      </Link>
                                    </>
                                  )}
                                </div> */}
                                    <div className={`${styles.subActions}`}>
                                      <button
                                        className={styles.subActionBtnViewMore}
                                        onClick={() =>
                                          router.push({
                                            pathname: "/plan-details",
                                            query: {
                                              planId: innerPlan?.plan_id,
                                              orderId: innerPlan?.order_id,
                                            },
                                          })
                                        }
                                      >
                                        <BiChevronRight size={16} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col">
                      <div className={`${styles.card} p-sm-4 p-3`}>
                        <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
                          <div>
                            <h2 className={styles.cardHead}>Transactions</h2>
                            <p className={`${styles.txnShowing} mb-0`}>
                              Showing{" "}
                              <strong>
                                {txnTotal === 0
                                  ? "0 - 0"
                                  : `${txnStartIndex + 1} - ${txnEndIndex}`}
                              </strong>{" "}
                              from <strong>{txnTotal}</strong> Transactions
                            </p>
                          </div>
                          <Link
                            href={`/transactions?customerId=${router?.query?.customerId}`}
                            className={`${styles.viewAll} text-decoration-underline`}
                          >
                            View All
                          </Link>
                        </div>

                        <div className={styles.txnToolbar}>
                          <div className={styles.txnTabs} role="tablist">
                            <button
                              type="button"
                              role="tab"
                              aria-selected={txnTab === "transactions"}
                              className={`${styles.txnTab} ${
                                txnTab === "transactions"
                                  ? styles.txnTabActive
                                  : ""
                              }`}
                              onClick={() => {
                                setTxnTab("transactions");
                                setTxnPage(1);
                              }}
                            >
                              TRANSACTIONS
                            </button>
                            <button
                              type="button"
                              role="tab"
                              aria-selected={txnTab === "invoice"}
                              className={`${styles.txnTab} ${
                                txnTab === "invoice" ? styles.txnTabActive : ""
                              }`}
                              onClick={() => {
                                setTxnTab("invoice");
                                setTxnPage(1);
                                setSelectedInvoiceIds([]);
                              }}
                            >
                              Invoice
                            </button>
                          </div>
                          {txnTab === "transactions" && (
                            <DownloadExcel
                              data={allTransactions}
                              columns={txnDownloadColumns}
                              fileName="customer-transactions"
                              className={styles.txnDownloadBtn}
                              buttonText="Download List"
                            />
                          )}
                        </div>

                        {txnTab === "transactions" ? (
                          allTransactions?.length > 0 ? (
                            <>
                              <div className={styles.txnList}>
                                {pagedTransactions?.map((txn, i) => (
                                  <div
                                    className={styles.txnCard}
                                    key={txn?.order_no || txn?.id || i}
                                  >
                                    <div className={styles.txnMeta}>
                                      <div className={styles.txnDate}>
                                        {txn?.created_at || "-"}
                                      </div>
                                      <div className={styles.txnId}>
                                        {txn?.order_no || "-"}
                                      </div>
                                    </div>

                                    <div className={styles.txnInfo}>
                                      <div className={styles.txnPlanName}>
                                        {txn?.order_name ||
                                          txn?.plan ||
                                          txn?.domain_name ||
                                          "-"}
                                      </div>
                                      <div className={styles.txnCategory}>
                                        {txn?.order_category ||
                                          txn?.domain_name ||
                                          "-"}
                                      </div>
                                    </div>
                                    <span
                                        className={`${styles.txnStatus} ${getTxnStatusClass(
                                          txn?.status,
                                          styles,
                                        )}`}
                                      >
                                        {formatTxnStatus(txn?.status)}
                                      </span>

                                    <div className={styles.txnRight}>
                                      
                                      <strong className={styles.txnPrice}>
                                        {formatTxnAmount(txn?.amount)}
                                      </strong>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {txnTotal > TXN_ITEM_PER_PAGE && (
                                <div className="mt-3">
                                  <Pagination
                                    data={allTransactions}
                                    currentPage={txnPage}
                                    setCurrentPage={setTxnPage}
                                    itemPerPage={TXN_ITEM_PER_PAGE}
                                  />
                                </div>
                              )}
                            </>
                          ) : (
                            <p className="text-center m-0 text-secondary py-3">
                              No transactions found
                            </p>
                          )
                        ) : allInvoices?.length > 0 ? (
                          <>
                            <div className={styles.invToolbar}>
                              <label
                                className={styles.invCheckAll}
                                style={{
                                  cursor:
                                    selectableInvoiceIds.length === 0 ||
                                    allInvoices?.some(
                                      (invoice) =>
                                        invoice?.payment_retry
                                          ?.payment_link_expired,
                                    )
                                      ? "not-allowed"
                                      : "pointer",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={allInvoicesSelected}
                                  onChange={toggleSelectAllInvoices}
                                  disabled={
                                    selectableInvoiceIds.length === 0 ||
                                    allInvoices?.some(
                                      (invoice) =>
                                        invoice?.payment_retry
                                          ?.payment_link_expired,
                                    )
                                  }
                                  style={{
                                    pointerEvents:
                                      selectableInvoiceIds.length === 0 ||
                                      allInvoices?.some(
                                        (invoice) =>
                                          invoice?.payment_retry
                                            ?.payment_link_expired,
                                      )
                                        ? "none"
                                        : undefined,
                                  }}
                                />
                                <span>Check All</span>
                              </label>

                              <div className="d-flex align-items-center gap-2">
                                <span
                                  className={
                                    selectedInvoiceIds?.length === 0
                                      ? styles.disabledCursorWrap
                                      : undefined
                                  }
                                  style={
                                    selectedInvoiceIds?.length === 0
                                      ? undefined
                                      : {
                                          display: "inline-flex",
                                          cursor: "pointer",
                                        }
                                  }
                                >
                                  <button
                                    className="btnDefault btn small"
                                    disabled={selectedInvoiceIds?.length === 0}
                                    style={{
                                      opacity:
                                        selectedInvoiceIds?.length === 0
                                          ? 0.5
                                          : 1,
                                      pointerEvents:
                                        selectedInvoiceIds?.length === 0
                                          ? "none"
                                          : undefined,
                                    }}
                                    onClick={() =>
                                      handleInvoicePayNow(
                                        selectedInvoiceIds,
                                        "multiple",
                                      )
                                    }
                                  >
                                    Pay Selected
                                  </button>
                                </span>
                                <DownloadExcel
                                  data={allInvoices}
                                  columns={invoiceDownloadColumns}
                                  fileName="customer-invoices"
                                  className={styles.txnDownloadBtn}
                                  buttonText="Download List"
                                />
                              </div>
                            </div>

                            <div className={styles.txnList}>
                              {allInvoices?.map((invoice, i) => {
                                const invoiceId = getInvoiceId(invoice);
                                const canSelect = isInvoiceSelectable(invoice);
                                const canPay = showInvoicePayNow(
                                  invoice?.status,
                                );
                                const pdfUrl = invoice?.invoice_pdf_url;

                                return (
                                  <div
                                    className={styles.invCard}
                                    key={invoiceId || i}
                                  >
                                    <div
                                      className={styles.invCheckCol}
                                      style={{
                                        cursor:
                                          canSelect &&
                                          !invoice?.payment_retry
                                            ?.payment_link_expired
                                            ? "pointer"
                                            : "not-allowed",
                                      }}
                                    >
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={selectedInvoiceIds.includes(
                                          invoiceId,
                                        )}
                                        onChange={() =>
                                          toggleSelectInvoice(invoiceId)
                                        }
                                        disabled={
                                          !canSelect ||
                                          invoice?.payment_retry
                                            ?.payment_link_expired
                                        }
                                        style={{
                                          pointerEvents:
                                            !canSelect ||
                                            invoice?.payment_retry
                                              ?.payment_link_expired
                                              ? "none"
                                              : undefined,
                                        }}
                                      />
                                    </div>

                                    <div className={styles.invCardBody}>
                                      <div className={styles.txnMeta}>
                                        <div className={styles.txnDate}>
                                          {invoice?.date ||
                                            invoice?.created_at ||
                                            "-"}
                                        </div>
                                        <div className={styles.txnId}>
                                          {invoice?.invoice_no ||
                                            invoice?.order_no ||
                                            "-"}
                                        </div>
                                      </div>

                                      <div className={styles.txnInfo}>
                                        <div className={styles.txnPlanName}>
                                          {invoice?.plan_name ||
                                            invoice?.order_name ||
                                            invoice?.plan ||
                                            invoice?.domain_name ||
                                            "-"}
                                        </div>
                                        <div className={styles.invCategory}>
                                          {invoice?.order_category ||
                                            invoice?.domain_name ||
                                            "-"}
                                        </div>
                                      </div>

                                      <div className={styles.invRight}>
                                        <span
                                          className={`${styles.txnStatus} ${getTxnStatusClass(
                                            invoice?.status,
                                            styles,
                                          )}`}
                                        >
                                          {formatTxnStatus(invoice?.status)}
                                        </span>

                                        <strong className={styles.txnPrice}>
                                          {invoice?.formatted_amount ||
                                            formatTxnAmount(
                                              invoice?.amount ?? invoice?.price,
                                            )}
                                        </strong>

                                        <div className={styles.invActions}>
                                          <span
                                            className={
                                              !canPay ||
                                              invoice?.payment_retry
                                                ?.payment_link_expired
                                                ? styles.disabledCursorWrap
                                                : undefined
                                            }
                                            style={
                                              canPay &&
                                              !invoice?.payment_retry
                                                ?.payment_link_expired
                                                ? {
                                                    display: "inline-flex",
                                                    cursor: "pointer",
                                                  }
                                                : undefined
                                            }
                                          >
                                            <button
                                              type="button"
                                              className={styles.invPayNowBtn}
                                              disabled={
                                                !canPay ||
                                                invoice?.payment_retry
                                                  ?.payment_link_expired
                                              }
                                              onClick={() =>
                                                handleInvoicePayNow(
                                                  invoiceId,
                                                  "single",
                                                )
                                              }
                                            >
                                              Pay Now
                                            </button>
                                          </span>
                                          {pdfUrl ? (
                                            <Link
                                              href={pdfUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className={styles.invDownloadBtn}
                                              aria-label="Download invoice"
                                            >
                                              <MdOutlineFileDownload
                                                size={18}
                                              />
                                            </Link>
                                          ) : (
                                            <span
                                              className={styles.invDownloadBtn}
                                              aria-disabled="true"
                                              style={{
                                                opacity: 0.45,
                                                cursor: "not-allowed",
                                              }}
                                            >
                                              <MdOutlineFileDownload
                                                size={18}
                                              />
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        ) : (
                          <p className="text-center m-0 text-secondary py-3">
                            No invoices found
                          </p>
                        )}
                      </div>
                    </div>

                    {/* <div className="col">
                    <div className={`${styles.card} py-4`}>
                      <div className="d-flex px-sm-4 px-3 mb-3 align-items-center">
                        <div className="col">
                          <h2 className={`${styles.cardHead}`}>
                            Support Tickets <span>(10)</span>
                          </h2>
                        </div>
                        <div className="col-auto">
                          <Link
                            href="#"
                            className={`${styles.btnDefault} ${styles.small} ${styles.btn}`}
                          >
                            <Plus className={styles.icon} size={14} />
                            <span>Open New Ticket</span>
                          </Link>
                        </div>
                      </div>

                      <div className="swiper supportSwiper px-sm-4 px-3 mb-4">
                        <div className="swiper-wrapper mb-4">

                          <div className="swiper-slide">
                            <div
                              className={`${styles.supportTkt} btnDisplay d-flex flex-column`}
                            >
                              <div
                                className={`${styles.stktTop} d-flex align-items-center col-auto`}
                              >
                                <div className="col">
                                  <div className={`${styles.stktNo}`}>
                                    SUP2523
                                  </div>
                                  <span
                                    className={`${styles.statusBadge} ${styles.subtleSuccess}`}
                                  >
                                    Active
                                  </span>
                                </div>
                                <div className="col-auto">
                                  <div className={`${styles.stktDate}`}>
                                    20 Mar, 2026
                                  </div>
                                </div>
                              </div>
                              <div className={`${styles.stktContent} col`}>
                                <span
                                  className={`${styles.priorityBadge} ${styles.high}`}
                                >
                                  High Priority
                                </span>
                                <Link href="#">
                                  <h3 className={`${styles.stktHead} my-2`}>
                                    Can&apos;t access dashboard after update
                                  </h3>
                                </Link>
                                <div className="">
                                  Tizzy® Mail Enterprise - 100 GB
                                </div>
                              </div>
                              <div
                                className={`${styles.stktBtm} d-flex align-items-center col-auto`}
                              >
                                <div className="col">
                                  <div
                                    className={`${styles.crDomain} d-flex align-items-center`}
                                  >
                                    <div
                                      className={`${styles.avatarSmall} flex-shrink-0 warningBg`}
                                    >
                                      G
                                    </div>
                                    <div className="crDomainName ps-2">
                                      ganeshenterprises.com
                                    </div>
                                  </div>
                                </div>
                                <div className="col-auto">
                                  <Link href="#" className={`${styles.crBtn}`}>
                                    <ChevronRight
                                      className={`${styles.icon} me-0`}
                                    />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="swiper-slide">
                            <div
                              className={`${styles.supportTkt} ${styles.supportTkt} d-flex flex-column`}
                            >
                              <div
                                className={`${styles.stktTop} d-flex align-items-center col-auto`}
                              >
                                <div className="col">
                                  <div className={`${styles.stktNo}`}>
                                    SUP2523
                                  </div>
                                  <span
                                    className={`${styles.statusBadge} ${styles.subtleSuccess}`}
                                  >
                                    Active
                                  </span>
                                </div>
                                <div className="col-auto">
                                  <div className={`${styles.stktDate}`}>
                                    20 Mar, 2026
                                  </div>
                                </div>
                              </div>
                              <div className={`${styles.stktContent} col`}>
                                <span
                                  className={`${styles.priorityBadge} ${styles.low}`}
                                >
                                  Low Priority
                                </span>
                                <Link href="#">
                                  <h3 className={`${styles.stktHead} my-2`}>
                                    Can&apos;t access dashboard after update
                                  </h3>
                                </Link>
                                <div className="">
                                  Tizzy® Mail Enterprise - 100 GB
                                </div>
                              </div>
                              <div
                                className={`${styles.stktBtm} d-flex align-items-center col-auto`}
                              >
                                <div className="col">
                                  <div
                                    className={`${styles.crDomain} d-flex align-items-center`}
                                  >
                                    <div
                                      className={`${styles.avatarSmall} flex-shrink-0 successBg`}
                                    >
                                      A
                                    </div>
                                    <div
                                      className={`${styles.crDomainName} ps-2`}
                                    >
                                      goyalinfotech.com
                                    </div>
                                  </div>
                                </div>
                                <div className="col-auto">
                                  <Link href="#" className={`${styles.crBtn}`}>
                                    <ChevronRight
                                      className={`${styles.icon} me-0`}
                                    />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="swiper-slide">
                            <div
                              className={`${styles.supportTkt} ${styles.btnDisplay} d-flex flex-column`}
                            >
                              <div
                                className={`${styles.stktTop} d-flex align-items-center col-auto`}
                              >
                                <div className="col">
                                  <div className={`${styles.stktNo}`}>
                                    SUP2523
                                  </div>
                                  <span
                                    className={`${styles.statusBadge} ${styles.statusBadge} ${styles.subtleSuccess}`}
                                  >
                                    Active
                                  </span>
                                </div>
                                <div className="col-auto">
                                  <div className={`${styles.stktDate}`}>
                                    20 Mar, 2026
                                  </div>
                                </div>
                              </div>
                              <div className={`${styles.stktContent} col`}>
                                <span
                                  className={`${styles.priorityBadge} ${styles.high}`}
                                >
                                  High Priority
                                </span>
                                <Link href="#">
                                  <h3 className={`${styles.stktHead} my-2`}>
                                    Can&apos;t access dashboard after update
                                  </h3>
                                </Link>
                                <div className="">
                                  Tizzy® Mail Enterprise - 100 GB
                                </div>
                              </div>
                              <div
                                className={`${styles.stktBtm} d-flex align-items-center col-auto`}
                              >
                                <div className="col">
                                  <div
                                    className={`${styles.crDomain} d-flex align-items-center`}
                                  >
                                    <div
                                      className={`${styles.avatarSmall} flex-shrink-0 secondaryBg`}
                                    >
                                      P
                                    </div>
                                    <div
                                      className={`${styles.crDomainName} ps-2`}
                                    >
                                      kingstonmarketing.net
                                    </div>
                                  </div>
                                </div>
                                <div className="col-auto">
                                  <Link href="#" className={`${styles.crBtn}`}>
                                    <ChevronRight
                                      className={`${styles.icon} me-0`}
                                    />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="swiper-slide">
                            <div
                              className={`${styles.supportTkt} ${styles.btnDisplay} d-flex flex-column`}
                            >
                              <div
                                className={`${styles.stktTop} d-flex align-items-center col-auto`}
                              >
                                <div className="col">
                                  <div className={`${styles.stktNo}`}>
                                    SUP2523
                                  </div>
                                  <span
                                    className={`${styles.statusBadge} ${styles.subtleSuccess}`}
                                  >
                                    Active
                                  </span>
                                </div>
                                <div className="col-auto">
                                  <div className={`${styles.stktDate}`}>
                                    20 Mar, 2026
                                  </div>
                                </div>
                              </div>
                              <div className={`${styles.stktContent} col`}>
                                <span
                                  className={`${styles.priorityBadge} ${styles.med}`}
                                >
                                  Medium Priority
                                </span>
                                <Link href="#">
                                  <h3 className={`${styles.stktHead} my-2`}>
                                    Can&apos;t access dashboard after update
                                  </h3>
                                </Link>
                                <div className="">
                                  Tizzy® Mail Enterprise - 100 GB
                                </div>
                              </div>
                              <div
                                className={`${styles.stktBtm} d-flex align-items-center col-auto`}
                              >
                                <div className="col">
                                  <div
                                    className={`${styles.crDomain} d-flex align-items-center`}
                                  >
                                    <div
                                      className={`${styles.avatarSmall} ${styles.infoBg} flex-shrink-0`}
                                    >
                                      G
                                    </div>
                                    <div className="crDomainName ps-2">
                                      pinchthewallet.com
                                    </div>
                                  </div>
                                </div>
                                <div className="col-auto">
                                  <Link href="#" className={`${styles.crBtn}`}>
                                    <ChevronRight
                                      className={`${styles.icon} me-0`}
                                    />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="swiper-slide">
                            <div
                              className={`${styles.supportTkt} ${styles.btnDisplay} d-flex flex-column`}
                            >
                              <div
                                className={`${styles.stktTop} d-flex align-items-center col-auto`}
                              >
                                <div className="col">
                                  <div className={`${styles.stktNo}`}>
                                    SUP2523
                                  </div>
                                  <span
                                    className={`${styles.statusBadge} ${styles.subtleSuccess}`}
                                  >
                                    Active
                                  </span>
                                </div>
                                <div className="col-auto">
                                  <div className={`${styles.stktDate}`}>
                                    20 Mar, 2026
                                  </div>
                                </div>
                              </div>
                              <div className={`${styles.stktContent} col`}>
                                <span
                                  className={`${styles.priorityBadge} ${styles.high}`}
                                >
                                  High Priority
                                </span>
                                <Link href="#">
                                  <h3 className={`${styles.stktHead} my-2`}>
                                    Can&apos;t access dashboard after update
                                  </h3>
                                </Link>
                                <div className="">
                                  Tizzy® Mail Enterprise - 100 GB
                                </div>
                              </div>
                              <div
                                className={`${styles.stktBtm} d-flex align-items-center col-auto`}
                              >
                                <div className="col">
                                  <div
                                    className={`${styles.crDomain} d-flex align-items-center`}
                                  >
                                    <div
                                      className={`${styles.avatarSmall} flex-shrink-0 warningBg`}
                                    >
                                      G
                                    </div>
                                    <div
                                      className={`${styles.crDomainName} ps-2`}
                                    >
                                      ganeshenterprises.com
                                    </div>
                                  </div>
                                </div>
                                <div className="col-auto">
                                  <Link href="#" className={`${styles.crBtn}`}>
                                    <ChevronRight
                                      className={`${styles.icon} me-0`}
                                    />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="swiper-slide">
                            <div
                              className={`${styles.supportTkt} ${styles.btnDisplay} d-flex flex-column`}
                            >
                              <div
                                className={`${styles.stktTop} d-flex align-items-center col-auto`}
                              >
                                <div className="col">
                                  <div className={`${styles.stktNo}`}>
                                    SUP2523
                                  </div>
                                  <span
                                    className={`${styles.statusBadge} ${styles.subtleSuccess}`}
                                  >
                                    Active
                                  </span>
                                </div>
                                <div className="col-auto">
                                  <div className={`${styles.stktDate}`}>
                                    20 Mar, 2026
                                  </div>
                                </div>
                              </div>
                              <div className={`${styles.stktContent} col`}>
                                <span
                                  className={`${styles.priorityBadge} ${styles.high}`}
                                >
                                  High Priority
                                </span>
                                <Link href="#">
                                  <h3 className={`${styles.stktHead} my-2`}>
                                    Can&apos;t access dashboard after update
                                  </h3>
                                </Link>
                                <div className="">
                                  Tizzy® Mail Enterprise - 100 GB
                                </div>
                              </div>
                              <div
                                className={`${styles.stktBtm} d-flex align-items-center col-auto`}
                              >
                                <div className="col">
                                  <div
                                    className={`${styles.crDomain} d-flex align-items-center`}
                                  >
                                    <div
                                      className={`${styles.avatarSmall} flex-shrink-0 dangerBg`}
                                    >
                                      G
                                    </div>
                                    <div
                                      className={`${styles.crDomainName} ps-2`}
                                    >
                                      ganeshenterprises.com
                                    </div>
                                  </div>
                                </div>
                                <div className="col-auto">
                                  <Link href="#" className={`${styles.crBtn}`}>
                                    <ChevronRight
                                      className={`${styles.icon} me-0`}
                                    />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="swiper-scrollbar"></div>
                      </div>
                    </div>
                  </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
