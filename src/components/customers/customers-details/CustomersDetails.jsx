import { useEffect } from "react";
import { FaPencil } from "react-icons/fa6";
import { CiGlobe } from "react-icons/ci";
import { BiTransfer } from "react-icons/bi";
import { IoMdArrowBack } from "react-icons/io";
import { ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import styles from "@/components/customers/customers-details/CustomerDetails.module.css";
import Layout from "@/components/layout/Layout";
import { useGetSpecificCustomerDetailsQuery } from "@/redux/apis/customerApi";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Image from "next/image";
import VerifyOtp from "@/components/auth/verify-otp/VerifyOtp";

export default function CustomerDetail() {
  const router = useRouter();

  const userData = Cookies.get("userData")
    ? JSON.parse(decodeURIComponent(Cookies.get("userData")))
    : {};

  const { data: customerDetailsData } = useGetSpecificCustomerDetailsQuery(
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

  return (
    <Layout>
      <div className="row flex-column gy-4 py-4">
        <div className="col">
          <div className="row align-items-end ">
            <div className="col">
              <nav className={`${styles.breadcrumb} mb-0`}>
                <Link href={"/dashboard"}>Dashboard</Link> /{" "}
                <Link href={"/customers"}>Customer</Link>
                <span className="breadcrumb-item"></span>
                <h1 className="breadcrumb-item active" aria-current="page">
                  Customer - {router?.query?.customerId}
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

        <div className="col">
          <div className={`${styles.sectionCard} py-4 py-sm-3 px-sm-4 px-3`}>
            <div className="border-bottom pb-3 mb-4">
              <small className="row justify-content-between">
                <div className="col-auto">
                  <span className="d-sm-inline-block d-block">Status : </span>
                  <span className="statusBadge successBg">Active</span>
                </div>
                <div className="col text-center">
                  <span className="d-sm-inline-block d-block">
                    Created On :{" "}
                  </span>
                  <strong className="d-inline-block">
                    {customerDetails?.created_at || ""}
                  </strong>
                </div>
                <div className="col-auto text-end">
                  <span className="d-sm-inline-block d-block">
                    Last Updated :{" "}
                  </span>
                  <strong className="d-inline-block">
                    {customerDetails?.updated_at || "-"}
                  </strong>
                </div>
              </small>
            </div>

            <div className="row">
              <div
                className={`${styles.custProfBox} col-md-4 col-12 mb-3 mb-lg-0 position-relative `}
              >
                <a
                  href="add_new_customer.html"
                  className="btn small me-4 btnWhite pfEditBtn"
                >
                  <FaPencil />
                  <span className="d-md-none d-lg-inline-block">Edit</span>
                </a>

                <div className="d-flex align-items-center mb-3">
                  <div
                    className={`${styles.profAvatar} ${styles.avatarColor_2} flex-shrink-0 text-capitalize`}
                    style={{ zoom: 1.4 }}
                  >
                    {customerDetails?.company_name?.charAt(0)}
                  </div>
                  <div className={`${styles.profUser} mx-2`}>
                    <div
                      className={`${styles.profName} text-nowrap text-capitalize`}
                    >
                      {customerDetails?.company_name}
                      {/* {customerDetails?.name} */}
                    </div>
                    <div className={`${styles.idBadge} mt-1`}>
                      Customer Id : <strong>{customerDetails?.id}</strong>
                    </div>
                  </div>
                </div>

                <div className={`${styles.custProfBox2} ms-md-5`}>
                  <div className="row">
                    <div className="mb-3 mb-sm-0">
                      <small className="d-block textLight">Address</small>
                      <address
                        className={`${styles.addressWidth} mb-0 text-capitalize`}
                        style={{ lineHeight: "1.8rem" }}
                      >
                        {customerDetails?.company_address}
                      </address>
                    </div>
                    {/* <div className="col-md-12 col-6 mb-3">
                      <small className="d-block textLight">Email Id</small>
                      <Link href={`mailto:${customerDetails?.email || "#"}`}>
                        {customerDetails?.email || ""}
                      </Link>
                    </div> */}
                    {/* <div className="col-md-12 col-6">
                      <small className="d-block textLight">Mobile No.</small>
                      <Link href="tel:+9198123456780">
                        {customerDetails?.mobile || ""}
                      </Link>
                    </div> */}
                  </div>
                </div>
              </div>

              <div className="col-md-8 col-12 ps-md-4">
                <div className="row">
                  <div className="col-sm d-flex flex-wrap">
                    <div className="col-12 mb-3">
                      <small className="d-block textLight">Contact No.</small>
                      <Link href="tel:+9198123456780" className="text-muted">
                        {customerDetails?.mobile || "-"}
                      </Link>
                    </div>
                    <div className="col-6 col-sm-12 mb-sm-3">
                      <small className="d-block textLight">PAN No.</small>
                      {customerDetails?.pan_no || "-"}
                    </div>
                    <div className="col-6 col-sm-12">
                      <small className="d-block textLight">GSTIN</small>
                      {customerDetails?.gstin || "-"}
                    </div>
                  </div>
                  {/* <div className="col-sm">
                    <div className="mb-3">
                      <small className="d-block textLight text ">
                        Company Name
                      </small>
                      <span className="text-capitalize">
                        {" "}
                        {customerDetails?.company_name}
                      </span>
                    </div>
                    <div className="mb-3 mb-sm-0">
                      <small className="d-block textLight">Address</small>
                      <address
                        className={`${styles.addressWidth} mb-0 text-capitalize`}
                        style={{ lineHeight: "1.8rem" }}
                      >
                        {customerDetails?.company_address}
                      </address>
                    </div>
                  </div> */}

                  <div className="col-sm d-flex flex-wrap">
                    <div className="col-12 mb-3">
                      <small className="d-block textLight">
                        Contact Person
                      </small>
                      <div
                        className={`${styles.profName} fs-6 t text-nowrap text-capitalize `}
                      >
                        {customerDetails?.name}
                      </div>
                      <div className="col-md-12 col-6 mb-3">
                        <Link
                          href={`mailto:${customerDetails?.email || "#"}`}
                          className="text-muted"
                        >
                          {customerDetails?.email || ""}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {allPlans?.map((plan, idx) => {
          const otherPlans = plan?.plans;
          return (
            <div className="col">
              <div className={`${styles.sectionCard} px-sm-4 px-3 py-1`}>
                <div className="border-bottom py-sm-2 py-3">
                  <div className="row align-items-center position-relative">
                    <div className="col-md-3 d-none d-md-block"></div>
                    <div className="col-md-6 col text-center d-flex align-items-center justify-content-md-center">
                      <div className="d-inline-flex align-items-center domainSection">
                        <CiGlobe />
                        <h3 className="mb-0 ms-2 fw-semibold primaryColor">
                          {plan?.domain_name || ""}
                        </h3>
                      </div>
                    </div>
                    <div className="col-md-3 col-auto text-end">
                      <button
                        className="btn small btnWhite"
                        data-bs-toggle="modal"
                        data-bs-target="#modalTransferCode"
                      >
                        <BiTransfer />
                        <span>Transfer Code</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="py-3">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div>
                      <h2 className={`${styles.sectionCardHead}`}>
                        Current Subscription
                      </h2>
                    </div>
                    <div>
                      <small className="text-decoration-underline">
                        <Link href="">View History</Link>
                      </small>
                    </div>
                  </div>

                  {otherPlans?.map((innerPlan, idx) => {
                    return (
                      <div className={`${styles.contentRow} noHover`}>
                        <div className="row align-items-center">
                          <div
                            div
                            className="col-xl-3 col-12 d-flex align-items-center"
                          >
                            {/* <div
                              className={`${styles.servBadge} ${styles.tizzy}  flex-shrink-0`}
                              title="Tizzy Mail"
                            ></div> */}
                            <div>
                              <Image src={plansImg?.[innerPlan?.provider_id]} />
                            </div>
                            <div className="ms-2">
                              <div className="fw-medium">
                                {innerPlan?.plan_name || "-"}
                              </div>
                            </div>
                          </div>
                          <div className="col-xl col-md-9 col-sm-8">
                            <div className="row text-sm-center align-items-start justify-content-around gy-3">
                              <div className="col-md-auto col-sm-6 col-8">
                                <small className="d-block textLight">
                                  Price
                                </small>
                                <span>₹ {innerPlan?.price}</span>
                                <small className="d-block">per user/year</small>
                              </div>
                              <div className="col-md-auto col-sm-6 col-4">
                                <small className="d-block textLight">
                                  License
                                </small>
                                <span>{innerPlan?.license_count || "-"}</span>
                                <button
                                  className={`${styles.iconBtn} btnWhite btn`}
                                  onClick={() =>
                                    router?.push({
                                      pathname: "/order-summary",
                                      query: {
                                        type: "renew-plan",
                                      },
                                    })
                                  }
                                >
                                  <FaPencil />
                                </button>
                              </div>
                              <div className="col-md-auto col-sm-6 col-8">
                                <small className="d-block textLight">
                                  Period
                                </small>
                                <span>
                                  {innerPlan?.start_date} -{" "}
                                  {innerPlan?.end_date}
                                </span>
                              </div>
                              <div className="col-md-auto col-sm-6 col-4 align-self-center">
                                <div
                                  className={`${styles.statusBadge} ${styles.subtleSuccess}`}
                                >
                                  {innerPlan?.status || "-"}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-xl-2 col-md-3 col-sm-4 col-12 text-center">
                            <button
                              onClick={() =>
                                router?.push({
                                  pathname: "/order-summary",
                                  query: {
                                    type: "renew-plan",
                                  },
                                })
                              }
                              className={`${styles.crRenew} btn small btnWhite`}
                            >
                              <span>Renew</span>
                            </button>
                            <div
                              className={`${styles.updwngrade} mt-2 text-uppercase`}
                            >
                              <button
                                className={styles.updwngradeBtn}
                                onClick={() =>
                                  router.push({
                                    pathname: "/services/tizzy",
                                    query: {
                                      type: "upgrade-plan",
                                    },
                                  })
                                }
                              >
                                UPGRADE
                              </button>{" "}
                              /
                              <button
                                className={styles.downgradeBtn}
                                onClick={() =>
                                  router.push({
                                    pathname: "/services/tizzy",
                                    query: {
                                      type: "downgrade-plan",
                                    },
                                  })
                                }
                              >
                                DOWNGRADE
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        <div className="col">
          <div className={`${styles.sectionCard} py-4`}>
            <div className="d-flex px-sm-4 px-3 mb-3 align-items-center">
              <div className="col">
                <h2 className={`${styles.sectionCardHead}`}>Support Tickets</h2>
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
                        <div className={`${styles.stktNo}`}>SUP2523</div>
                        <span
                          className={`${styles.statusBadge} ${styles.subtleSuccess}`}
                        >
                          Active
                        </span>
                      </div>
                      <div className="col-auto">
                        <div className={`${styles.stktDate}`}>20 Mar, 2026</div>
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
                      <div className="">Tizzy® Mail Enterprise - 100 GB</div>
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
                          <ChevronRight className={`${styles.icon} me-0`} />
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
                        <div className={`${styles.stktNo}`}>SUP2523</div>
                        <span
                          className={`${styles.statusBadge} ${styles.subtleSuccess}`}
                        >
                          Active
                        </span>
                      </div>
                      <div className="col-auto">
                        <div className={`${styles.stktDate}`}>20 Mar, 2026</div>
                      </div>
                    </div>
                    <div className={`${styles.stktContent} col`}>
                      <span className={`${styles.priorityBadge} ${styles.low}`}>
                        Low Priority
                      </span>
                      <Link href="#">
                        <h3 className={`${styles.stktHead} my-2`}>
                          Can&apos;t access dashboard after update
                        </h3>
                      </Link>
                      <div className="">Tizzy® Mail Enterprise - 100 GB</div>
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
                          <div className={`${styles.crDomainName} ps-2`}>
                            goyalinfotech.com
                          </div>
                        </div>
                      </div>
                      <div className="col-auto">
                        <Link href="#" className={`${styles.crBtn}`}>
                          <ChevronRight className={`${styles.icon} me-0`} />
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
                        <div className={`${styles.stktNo}`}>SUP2523</div>
                        <span
                          className={`${styles.statusBadge} ${styles.statusBadge} ${styles.subtleSuccess}`}
                        >
                          Active
                        </span>
                      </div>
                      <div className="col-auto">
                        <div className={`${styles.stktDate}`}>20 Mar, 2026</div>
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
                      <div className="">Tizzy® Mail Enterprise - 100 GB</div>
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
                          <div className={`${styles.crDomainName} ps-2`}>
                            kingstonmarketing.net
                          </div>
                        </div>
                      </div>
                      <div className="col-auto">
                        <Link href="#" className={`${styles.crBtn}`}>
                          <ChevronRight className={`${styles.icon} me-0`} />
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
                        <div className={`${styles.stktNo}`}>SUP2523</div>
                        <span
                          className={`${styles.statusBadge} ${styles.subtleSuccess}`}
                        >
                          Active
                        </span>
                      </div>
                      <div className="col-auto">
                        <div className={`${styles.stktDate}`}>20 Mar, 2026</div>
                      </div>
                    </div>
                    <div className={`${styles.stktContent} col`}>
                      <span className={`${styles.priorityBadge} ${styles.med}`}>
                        Medium Priority
                      </span>
                      <Link href="#">
                        <h3 className={`${styles.stktHead} my-2`}>
                          Can&apos;t access dashboard after update
                        </h3>
                      </Link>
                      <div className="">Tizzy® Mail Enterprise - 100 GB</div>
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
                          <ChevronRight className={`${styles.icon} me-0`} />
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
                        <div className={`${styles.stktNo}`}>SUP2523</div>
                        <span
                          className={`${styles.statusBadge} ${styles.subtleSuccess}`}
                        >
                          Active
                        </span>
                      </div>
                      <div className="col-auto">
                        <div className={`${styles.stktDate}`}>20 Mar, 2026</div>
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
                      <div className="">Tizzy® Mail Enterprise - 100 GB</div>
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
                          <div className={`${styles.crDomainName} ps-2`}>
                            ganeshenterprises.com
                          </div>
                        </div>
                      </div>
                      <div className="col-auto">
                        <Link href="#" className={`${styles.crBtn}`}>
                          <ChevronRight className={`${styles.icon} me-0`} />
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
                        <div className={`${styles.stktNo}`}>SUP2523</div>
                        <span
                          className={`${styles.statusBadge} ${styles.subtleSuccess}`}
                        >
                          Active
                        </span>
                      </div>
                      <div className="col-auto">
                        <div className={`${styles.stktDate}`}>20 Mar, 2026</div>
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
                      <div className="">Tizzy® Mail Enterprise - 100 GB</div>
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
                          <div className={`${styles.crDomainName} ps-2`}>
                            ganeshenterprises.com
                          </div>
                        </div>
                      </div>
                      <div className="col-auto">
                        <Link href="#" className={`${styles.crBtn}`}>
                          <ChevronRight className={`${styles.icon} me-0`} />
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
    </Layout>
  );
}
