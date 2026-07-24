import { useEffect } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { ChevronRight, Plus, Calendar, Globe, Users } from "lucide-react";
import Link from "next/link";
import styles from "@/components/customers/customers-details/CustomerDetails.module.css";
import Layout from "@/components/layout/Layout";
import { useGetSpecificCustomerDetailsQuery } from "@/redux/apis/customerApi";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { BsPlusCircleDotted } from "react-icons/bs";
import { FaPen } from "react-icons/fa";
import createBtnBg from "@/assets/summary-count/createBtnBg.svg";
import Image from "next/image";
export default function CustomerDetail() {
  const router = useRouter();
  const userData = Cookies.get("userData")
    ? JSON.parse(decodeURIComponent(Cookies.get("userData")))
    : {};

  const { data: customerDetailsData, refetch: refetchCustomerDetails } =
    useGetSpecificCustomerDetailsQuery(
      {
        customer_id: router?.query?.customerId,
        partner_id: userData?.id,
      },
      {
        skip: !router?.isReady || !router?.query?.customerId || !userData?.id,
      },
    );

  const customerDetails = customerDetailsData?.data?.customer;
  const allPlans = customerDetailsData?.data?.current_plans;
  const allTransactions = customerDetailsData?.data?.transaction_history;

  useEffect(() => {
    if (router?.isReady) {
      if (router?.query?.customerId) {
        refetchCustomerDetails();
      }
    }
  }, [router?.isReady]);

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

  const transactions = [
    {
      avatarColor: "avatarRed",
    },
    {
      avatarColor: "avatarGold",
    },
    {
      avatarColor: "avatarBlue",
    },
    {
      avatarColor: "avatarPurple",
    },
    {
      avatarColor: "avatarTeal",
    },
  ];

  const allInnerPlans =
    allPlans?.flatMap((plan) =>
      (plan?.plans || []).map((innerPlan) => ({
        ...innerPlan,
        domain_name: plan?.domain_name,
      })),
    ) || [];

  const getServicePath = (provider_id) => {
    if (provider_id === 1) return "tizzy";
    if (provider_id === 2) return "microsoft-365";
    if (provider_id === 3) return "google-workspace";
    return "google-workspace";
  };

  return (
    <Layout>
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
              {/* LEFT: Profile card */}
              <div className="col-lg-4 col-12">
                <div className={`${styles.profCard}`}>
                  <div className={`${styles.profHeader} position-relative`}>
                    <Image
                      src={createBtnBg}
                      alt="Edit"
                      width={500}
                      height={500}
                      className={styles.createBtnBg}
                    />
                    <Image
                      src={createBtnBg}
                      alt="Edit"
                      width={500}
                      height={500}
                      className={styles.createBtnBg2}
                    />
                    <Link
                      href={`/customers/edit-customer?customerId=${router?.query?.customerId}`}
                      className={`${styles.profEditBtn}`}
                      title="Edit"
                    >
                      <FaPen />
                    </Link>
                    <div className={`${styles.profAvatarLg} text-capitalize`}>
                      {customerDetails?.company_name?.charAt(0)}
                    </div>
                    <h2 className={`${styles.profCompanyName} text-capitalize`}>
                      {customerDetails?.company_name}
                    </h2>
                    <div className={`${styles.profIdBadge}`}>
                      Customer Id : <strong>{customerDetails?.id}</strong>
                    </div>
                    <div className={`${styles.profCreated}`}>
                      Created On : {customerDetails?.created_at || "-"}
                    </div>
                  </div>

                  <div className={`${styles.profBody}`}>
                    <h3 className={`${styles.profBodyTitle}`}>
                      Basic Information
                    </h3>

                    <div className={`${styles.infoItem}`}>
                      <small className={`${styles.infoLabel}`}>Full Name</small>
                      <div className={`${styles.infoValue} text-capitalize`}>
                        {customerDetails?.name || "-"}
                      </div>
                    </div>

                    <div className={`${styles.infoItem}`}>
                      <small className={`${styles.infoLabel}`}>Email</small>
                      <div className={`${styles.infoValue}`}>
                        <Link href={`mailto:${customerDetails?.email || "#"}`}>
                          {customerDetails?.email || "-"}
                        </Link>
                      </div>
                    </div>

                    <div className={`${styles.infoItem}`}>
                      <small className={`${styles.infoLabel}`}>
                        Contact No.
                      </small>
                      <div className={`${styles.infoValue}`}>
                        <Link href={`tel:${customerDetails?.mobile || "#"}`}>
                          {customerDetails?.mobile || "-"}
                        </Link>
                      </div>
                    </div>

                    <div className={`${styles.infoItem}`}>
                      <small className={`${styles.infoLabel}`}>GSTIN</small>
                      <div className={`${styles.infoValue}`}>
                        {customerDetails?.gstin || "-"}
                      </div>
                    </div>

                    <div className={`${styles.infoItem}`}>
                      <small className={`${styles.infoLabel}`}>PAN No.</small>
                      <div className={`${styles.infoValue} text-uppercase`}>
                        {customerDetails?.pan_no || "-"}
                      </div>
                    </div>

                    <div className={`${styles.infoItem} mb-0`}>
                      <small className={`${styles.infoLabel}`}>Address</small>
                      <address
                        className={`${styles.infoValue} text-capitalize mb-0`}
                      >
                        {customerDetails?.company_address || "-"}
                      </address>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-8 col-12">
                <div className="row flex-column gy-4">
                  {/* Transaction History */}
                  <div className="col">
                    <div className={`${styles.card} p-sm-4 p-3`}>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <h2 className={`${styles.cardHead}`}>
                          Transaction History
                        </h2>
                        <Link
                          href={`/transactions?customerId=${router?.query?.customerId}`}
                          className={`${styles.viewAll} text-decoration-underline`}
                        >
                          View All
                        </Link>
                      </div>

                      {allTransactions?.length > 0 ? (
                        allTransactions?.slice(0, 5)?.map((txn, i) => (
                          <div className={`${styles.txnRow}`} key={i}>
                            <div className={`${styles.txnMeta}`}>
                              <div className={`${styles.txnDate}`}>
                                {txn?.created_at || "-"}
                              </div>
                              <div className={`${styles.txnId}`}>
                                {txn?.order_no}
                              </div>
                            </div>
                            <div className={`${styles.txnInfo}`}>
                              <div
                                className={`${styles.avatarSmall} ${transactions[i]?.avatarColor} flex-shrink-0`}
                              >
                                {txn?.domain_name?.charAt(0)?.toUpperCase() ||
                                  "-"}
                              </div>
                              <div className="ms-2">
                                <Link
                                  href="#"
                                  className={`${styles.txnDomain} d-block`}
                                >
                                  {txn?.domain_name || "-"}
                                </Link>
                                <small className={`${styles.txnDesc}`}>
                                  {txn?.order_name || "-"}
                                </small>
                              </div>
                            </div>
                            <div className={`${styles.txnAmount}`}>
                              <span
                                className={`${styles.txnStatus}
                              ${styles[txn?.status?.toLowerCase()]}`}
                              >
                                {txn?.status?.charAt(0)?.toUpperCase() +
                                  txn?.status?.slice(1)}
                              </span>
                              <strong>₹ {txn?.price}</strong>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center m-0 text-secondary">
                          No transactions found
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="col">
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
                          {/* Slide 1 */}
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

                          {/* Slide 2 */}
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

                          {/* Slide 3 */}
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

                          {/* Slide 4 */}
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

                          {/* Slide 5 */}
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

                          {/* Slide 6 */}
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CURRENT SUBSCRIPTION */}
        <div className="col">
          <div className={`${styles.pageWrap}`}>
            <div className={`${styles.card} p-sm-4 p-3`}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h2 className={`${styles.cardHead}`}>
                  Current Subscription{" "}
                  <span>({allInnerPlans?.length || 0})</span>
                </h2>
                <Link
                  href={`/subscriptions?customerId=${router?.query?.customerId}`}
                  className={`${styles.viewAll} text-decoration-underline`}
                >
                  View All
                </Link>
              </div>

              {allInnerPlans?.length === 0 ? (
                <div className="text-center d-flex flex-column align-items-center justify-content-center gap-2 py-3">
                  <p className="m-0">No Subscriptions</p>
                  <button
                    className="small btnDefault btn"
                    onClick={() => router.push("/services/google-workspace")}
                  >
                    <BsPlusCircleDotted className="me-2" size={14} />
                    <span>Buy New Subscription</span>
                  </button>
                </div>
              ) : (
                allInnerPlans?.slice(0, 5)?.map((innerPlan, idx) => (
                  <div className={`${styles.subRow}`} key={idx}>
                    <div className={`${styles.subTop}`}>
                      <div className={`${styles.subPlan}`}>
                        <p
                          className={`${styles.subPlanIcon} m-0 flex-shrink-0`}
                        >
                          {plansImg?.[innerPlan?.provider_id - 1] || "-"}
                        </p>
                        <div className="ms-2">
                          <div className={`${styles.subPlanName}`}>
                            {innerPlan?.plan_name || "-"}
                          </div>
                          <small className={`${styles.subPlanPrice}`}>
                            ₹{innerPlan?.price} <span>Per User / Per Year</span>
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
                          <Calendar className={`${styles.subMetaIcon}`} />
                          <div>
                            {/* <small className={`${styles.infoLabel}`}>
                              Billing Cycle
                            </small> */}
                            <div className={`${styles.subMetaValue}`}>
                              {innerPlan?.start_date} - {innerPlan?.end_date}
                            </div>
                          </div>
                        </div>

                        <div className={`${styles.subMetaItem}`}>
                          <Globe className={`${styles.subMetaIcon}`} />
                          <div>
                            {/* <small className={`${styles.infoLabel}`}>
                              Domain
                            </small> */}
                            <div className={`${styles.subMetaValue}`}>
                              {innerPlan?.domain_name || "-"}
                            </div>
                          </div>
                        </div>

                        <div className={`${styles.subMetaItem}`}>
                          <Users className={`${styles.subMetaIcon}`} />
                          <div>
                            {/* <small className={`${styles.infoLabel}`}>
                              Licenses
                            </small> */}
                            <div className={`${styles.subMetaValue}`}>
                              {innerPlan?.license_count || "-"} Users
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={`${styles.subActions}`}>
                        {(innerPlan?.status?.toLowerCase() === "expiring" ||
                          innerPlan?.status?.toLowerCase() === "expired") && (
                          <button
                            className={`${styles.subRenewBtn}`}
                            onClick={() =>
                              router?.push({
                                pathname: "/order-summary",
                                query: {
                                  type: "renew-plan",
                                  order_id: innerPlan?.order_id,
                                },
                              })
                            }
                          >
                            Renew
                          </button>
                        )}
                        {innerPlan?.status?.toLowerCase() !== "draft" &&
                          innerPlan?.status?.toLowerCase() !== "pending" && (
                            <Link
                              href={{
                                pathname: `/services/${
                                  innerPlan?.provider_name === "Tizzy Mail"
                                    ? "tizzy"
                                    : innerPlan?.provider_name ===
                                        "Microsoft 365"
                                      ? "microsoft-365"
                                      : "google-workspace"
                                }`,
                                query: {
                                  type: "upgrade",
                                  order_id: innerPlan?.order_id,
                                  customer_id: router?.query?.customerId,
                                  plan_id: innerPlan?.plan_id,
                                  order_sub_id: innerPlan?.order_sub_id,
                                },
                              }}
                              className={`${styles.subUpgradeBtn}`}
                              onClick={() => {
                                Cookies.remove("customerData");
                                Cookies.set(
                                  "customerData",
                                  JSON.stringify({
                                    partner_id: userData?.id,
                                    customer_id: router?.query?.customerId,
                                    domain_name: innerPlan?.domain_name,
                                  }),
                                );
                              }}
                            >
                              Upgrade
                            </Link>
                          )}
                        {(innerPlan?.status?.toLowerCase() === "expiring" ||
                          innerPlan?.status?.toLowerCase() === "expired") && (
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
                                  customer_id: router?.query?.customerId,
                                  plan_id: innerPlan?.plan_id,
                                  order_sub_id: innerPlan?.order_sub_id,
                                },
                              }}
                              onClick={() => {
                                Cookies.remove("customerData");
                                Cookies.set(
                                  "customerData",
                                  JSON.stringify({
                                    partner_id: userData?.id,
                                    customer_id: router?.query?.customerId,
                                    domain_name: innerPlan?.domain_name,
                                  }),
                                );
                              }}
                            >
                              Downgrade
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
