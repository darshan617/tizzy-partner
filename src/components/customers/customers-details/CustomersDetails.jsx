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

export default function CustomerDetail() {
  const router = useRouter();

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

  const { data: customerDetailsData } = useGetSpecificCustomerDetailsQuery(
    {
      customer_id: router?.query?.customerId,
    },
    {
      skip: !router?.isReady || !router?.query?.customerId,
    },
  );

  const customerDetails = customerDetailsData?.data?.customer;
  console.log(customerDetails, "customerDetailscustomerDetailscustomerDetails");

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
                    {customerDetails?.last_updated || "-"}
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
                    className={`${styles.profAvatar} ${styles.avatarColor_2} flex-shrink-0`}
                    style={{ zoom: 1.4 }}
                  >
                    {customerDetails?.name?.charAt(0)}
                  </div>
                  <div className={`${styles.profUser} mx-2`}>
                    <div
                      className={`${styles.profName} text-nowrap text-truncate`}
                    >
                      {customerDetails?.name}
                    </div>
                    <div className={`${styles.idBadge} mt-1`}>
                      Customer Id : <strong>{customerDetails?.id}</strong>
                    </div>
                  </div>
                </div>

                <div className={`${styles.custProfBox2} ms-md-5`}>
                  <div className="row">
                    <div className="col-md-12 col-6 mb-3">
                      <small className="d-block textLight">Email Id</small>
                      <Link href={`mailto:${customerDetails?.email || "#"}`}>
                        {customerDetails?.email || ""}
                      </Link>
                    </div>
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
                  <div className="col-sm">
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
                  </div>
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
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className={`${styles.sectionCard} px-sm-4 px-3 py-1`}>
            <div className="border-bottom py-sm-2 py-3">
              <div className="row align-items-center position-relative">
                <div className="col-md-3 d-none d-md-block"></div>
                <div className="col-md-6 col text-center d-flex align-items-center justify-content-md-center">
                  <div className="d-inline-flex align-items-center domainSection">
                    <CiGlobe />
                    <h3 className="mb-0 ms-2 fw-semibold primaryColor">
                      goyalinfotech.com
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

              <div className={`${styles.contentRow} noHover`}>
                <div className="row align-items-center">
                  <div className="col-xl-3 col-12 d-flex align-items-center">
                    <div
                      className={`${styles.servBadge} ${styles.tizzy}  flex-shrink-0`}
                      title="Tizzy Mail"
                    ></div>
                    <div className="ms-2">
                      <div className="fw-medium">
                        Tizzy® Mail Enterprise 100 GB
                      </div>
                    </div>
                  </div>
                  <div className="col-xl col-md-9 col-sm-8">
                    <div className="row text-sm-center align-items-start justify-content-around gy-3">
                      <div className="col-md-auto col-sm-6 col-8">
                        <small className="d-block textLight">Price</small>
                        <span>₹ 1000.00</span>
                        <small className="d-block">per user/year</small>
                      </div>
                      <div className="col-md-auto col-sm-6 col-4">
                        <small className="d-block textLight">License</small>
                        <span>10</span>
                        <Link
                          href=""
                          className={`${styles.iconBtn} btnWhite btn`}
                        >
                          <FaPencil />
                        </Link>
                      </div>
                      <div className="col-md-auto col-sm-6 col-8">
                        <small className="d-block textLight">Period</small>
                        <span>25 May, 2025 - 25 May, 2026</span>
                      </div>
                      <div className="col-md-auto col-sm-6 col-4 align-self-center">
                        <div
                          className={`${styles.statusBadge} ${styles.subtleSuccess}`}
                        >
                          Active
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-2 col-md-3 col-sm-4 col-12 text-center">
                    <Link
                      href="#"
                      className={`${styles.crRenew} btn small btnWhite`}
                    >
                      <span>Renew</span>
                    </Link>
                    <div className={`${styles.updwngrade} mt-2 text-uppercase`}>
                      <Link href="">Upgrade / Downgrade</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
