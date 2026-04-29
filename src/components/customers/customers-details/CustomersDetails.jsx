import { useEffect, useRef } from "react";
import { FaPencil } from "react-icons/fa6";
import { CiGlobe } from "react-icons/ci";
import { BiTransfer } from "react-icons/bi";
import { IoMdArrowBack } from "react-icons/io";
import { ChevronRight, Plus } from "lucide-react";
import styles from '@/components/customers/customers-details/CustomerDetails.module.css'


export default function CustomerDetail() {
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

    return (
        <div className="row flex-column gy-4 py-4">
            <div className="col">
                <div className="row align-items-end ">
                    <div className="col">
                        <nav className={`${styles.breadcrumb} mb-0`}>
                            <a href="index.html" className="breadcrumb-item">
                                Dashboard
                            </a>
                            <a href="customers.html" className="breadcrumb-item">
                                Customers
                            </a>
                            <span className="breadcrumb-item"></span>
                            <h1 className="breadcrumb-item active" aria-current="page">
                                Customer - 00024
                            </h1>
                        </nav>
                    </div>
                    <div className="col-auto">
                        <a href="customers.html" className="btn small btnWhite">
                            <IoMdArrowBack />
                            <span>Back</span>
                        </a>
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
                                <span className="d-sm-inline-block d-block">Created On : </span>
                                <strong className="d-inline-block">
                                    25 Jun, 2021{" "}
                                    <span className="d-inline-block">(63 Months)</span>
                                </strong>
                            </div>
                            <div className="col-auto text-end">
                                <span className="d-sm-inline-block d-block">
                                    Last Updated :{" "}
                                </span>
                                <strong className="d-inline-block">15 Mar, 2026</strong>
                            </div>
                        </small>
                    </div>

                    <div className="row">
                        <div className={`${styles.custProfBox} col-md-4 col-12 mb-3 mb-lg-0 position-relative `}>
                            <a
                                href="add_new_customer.html"
                                className="btn small me-4 btnWhite pfEditBtn"
                            >
                                <FaPencil />
                                <span className="d-md-none d-lg-inline-block">Edit</span>
                            </a>

                            <div className="d-flex align-items-center mb-3">
                                <div
                                    className="profAvatar flex-shrink-0 avatarColor_2"
                                    style={{ zoom: 1.4 }}
                                >
                                    V
                                </div>
                                <div className="profUser mx-2">
                                    <div className="profName text-nowrap text-truncate">
                                        Vikas Goyal
                                    </div>
                                    <div className="idBadge mt-1">
                                        Customer Id : <strong>00024</strong>
                                    </div>
                                </div>
                            </div>

                            <div className={`${styles.custProfBox2} ms-md-5`}>
                                <div className="row">
                                    <div className="col-md-12 col-6 mb-3">
                                        <small className="d-block textLight">Email Id</small>
                                        <a href="mailto:vikasgoyal@gmail.com">
                                            vikasgoyal@gmail.com
                                        </a>
                                    </div>
                                    <div className="col-md-12 col-6">
                                        <small className="d-block textLight">Mobile No.</small>
                                        <a href="tel:+9198123456780">+91 981234 56780</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-8 col-12 ps-md-4">
                            <div className="row">
                                <div className="col-sm">
                                    <div className="mb-3">
                                        <small className="d-block textLight">Company Name</small>
                                        Goyal Infotech Pvt. Ltd.
                                    </div>
                                    <div className="mb-3 mb-sm-0">
                                        <small className="d-block textLight">Address</small>
                                        <address
                                            className={`${styles.addressWidth} mb-0 `}
                                            style={{ lineHeight: "1.8rem" }}
                                        >
                                            Office No. 410, 9 Business Bay, Mindspace, Malad West,
                                            Mumbai, Maharashtra- 400064. INDIA
                                        </address>
                                    </div>
                                </div>
                                <div className="col-sm d-flex flex-wrap">
                                    <div className="col-12 mb-3">
                                        <small className="d-block textLight">Contact No.</small>
                                        +91 981234 56780
                                    </div>
                                    <div className="col-6 col-sm-12 mb-sm-3">
                                        <small className="d-block textLight">PAN No.</small>
                                        ABCFU1234D
                                    </div>
                                    <div className="col-6 col-sm-12">
                                        <small className="d-block textLight">GSTIN</small>
                                        27ABCFU1234D2Z5
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
                                <h2 className={`${styles.sectionCardHead}`}>Current Subscription</h2>
                            </div>
                            <div>
                                <small className="text-decoration-underline">
                                    <a href="">View History</a>
                                </small>
                            </div>
                        </div>

                        <div className={`${styles.contentRow} noHover`}>
                            <div className="row align-items-center">
                                <div className="col-xl-3 col-12 d-flex align-items-center">
                                    <div
                                        className="servBadge tizzy flex-shrink-0"
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
                                            <a href="" className="btnWhite btn iconBtn">
                                                <FaPencil />
                                            </a>
                                        </div>
                                        <div className="col-md-auto col-sm-6 col-8">
                                            <small className="d-block textLight">Period</small>
                                            <span>25 May, 2025 - 25 May, 2026</span>
                                        </div>
                                        <div className="col-md-auto col-sm-6 col-4 align-self-center">
                                            <div className="statusBadge subtleSuccess">Active</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-md-3 col-sm-4 col-12 text-center">
                                    <a href="#" className="btn small btnWhite crRenew">
                                        <span>Renew</span>
                                    </a>
                                    <div className="mt-2 text-uppercase updwngrade">
                                        <a href="">Upgrade / Downgrade</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col">
                <div className="sectionCard py-4">
                    <div className="d-flex px-sm-4 px-3 mb-3 align-items-center">
                        <div className="col">
                            <h2 className="sectionCardHead">Support Tickets</h2>
                        </div>
                        <div className="col-auto">
                            <a href="#" className="btn small btnDefault">
                                <Plus className={styles.icon} size={14} />
                                <span>Open New Ticket</span>
                            </a>
                        </div>
                    </div>

                    <div className="swiper supportSwiper px-sm-4 px-3 mb-4">
                        <div className="swiper-wrapper mb-4">

                            {/* Slide 1 */}
                            <div className="swiper-slide">
                                <div className="supportTkt btnDisplay d-flex flex-column">
                                    <div className="stktTop d-flex align-items-center col-auto">
                                        <div className="col">
                                            <div className="stktNo">SUP2523</div>
                                            <span className="statusBadge subtleSuccess">Active</span>
                                        </div>
                                        <div className="col-auto">
                                            <div className="stktDate">20 Mar, 2026</div>
                                        </div>
                                    </div>
                                    <div className="stktContent col">
                                        <span className="priorityBadge high">High Priority</span>
                                        <a href="#"><h3 className="stktHead my-2">Can&apos;t access dashboard after update</h3></a>
                                        <div className="">Tizzy® Mail Enterprise - 100 GB</div>
                                    </div>
                                    <div className="stktBtm d-flex align-items-center col-auto">
                                        <div className="col">
                                            <div className="crDomain d-flex align-items-center">
                                                <div className="avatarSmall flex-shrink-0 warningBg">G</div>
                                                <div className="crDomainName ps-2">ganeshenterprises.com</div>
                                            </div>
                                        </div>
                                        <div className="col-auto">
                                            <a href="#" className="crBtn"><ChevronRight className="icon me-0" /></a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Slide 2 */}
                            <div className="swiper-slide">
                                <div className="supportTkt btnDisplay d-flex flex-column">
                                    <div className="stktTop d-flex align-items-center col-auto">
                                        <div className="col">
                                            <div className="stktNo">SUP2523</div>
                                            <span className="statusBadge subtleSuccess">Active</span>
                                        </div>
                                        <div className="col-auto">
                                            <div className="stktDate">20 Mar, 2026</div>
                                        </div>
                                    </div>
                                    <div className="stktContent col">
                                        <span className="priorityBadge low">Low Priority</span>
                                        <a href="#"><h3 className="stktHead my-2">Can&apos;t access dashboard after update</h3></a>
                                        <div className="">Tizzy® Mail Enterprise - 100 GB</div>
                                    </div>
                                    <div className="stktBtm d-flex align-items-center col-auto">
                                        <div className="col">
                                            <div className="crDomain d-flex align-items-center">
                                                <div className="avatarSmall flex-shrink-0 successBg">A</div>
                                                <div className="crDomainName ps-2">goyalinfotech.com</div>
                                            </div>
                                        </div>
                                        <div className="col-auto">
                                            <a href="#" className="crBtn"><ChevronRight className="icon me-0" /></a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Slide 3 */}
                            <div className="swiper-slide">
                                <div className="supportTkt btnDisplay d-flex flex-column">
                                    <div className="stktTop d-flex align-items-center col-auto">
                                        <div className="col">
                                            <div className="stktNo">SUP2523</div>
                                            <span className="statusBadge subtleSuccess">Active</span>
                                        </div>
                                        <div className="col-auto">
                                            <div className="stktDate">20 Mar, 2026</div>
                                        </div>
                                    </div>
                                    <div className="stktContent col">
                                        <span className="priorityBadge high">High Priority</span>
                                        <a href="#"><h3 className="stktHead my-2">Can&apos;t access dashboard after update</h3></a>
                                        <div className="">Tizzy® Mail Enterprise - 100 GB</div>
                                    </div>
                                    <div className="stktBtm d-flex align-items-center col-auto">
                                        <div className="col">
                                            <div className="crDomain d-flex align-items-center">
                                                <div className="avatarSmall flex-shrink-0 secondaryBg">P</div>
                                                <div className="crDomainName ps-2">kingstonmarketing.net</div>
                                            </div>
                                        </div>
                                        <div className="col-auto">
                                            <a href="#" className="crBtn"><ChevronRight className="icon me-0" /></a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Slide 4 */}
                            <div className="swiper-slide">
                                <div className="supportTkt btnDisplay d-flex flex-column">
                                    <div className="stktTop d-flex align-items-center col-auto">
                                        <div className="col">
                                            <div className="stktNo">SUP2523</div>
                                            <span className="statusBadge subtleSuccess">Active</span>
                                        </div>
                                        <div className="col-auto">
                                            <div className="stktDate">20 Mar, 2026</div>
                                        </div>
                                    </div>
                                    <div className="stktContent col">
                                        <span className="priorityBadge med">Medium Priority</span>
                                        <a href="#"><h3 className="stktHead my-2">Can&apos;t access dashboard after update</h3></a>
                                        <div className="">Tizzy® Mail Enterprise - 100 GB</div>
                                    </div>
                                    <div className="stktBtm d-flex align-items-center col-auto">
                                        <div className="col">
                                            <div className="crDomain d-flex align-items-center">
                                                <div className="avatarSmall flex-shrink-0 infoBg">G</div>
                                                <div className="crDomainName ps-2">pinchthewallet.com</div>
                                            </div>
                                        </div>
                                        <div className="col-auto">
                                            <a href="#" className="crBtn"><ChevronRight className="icon me-0" /></a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Slide 5 */}
                            <div className="swiper-slide">
                                <div className="supportTkt btnDisplay d-flex flex-column">
                                    <div className="stktTop d-flex align-items-center col-auto">
                                        <div className="col">
                                            <div className="stktNo">SUP2523</div>
                                            <span className="statusBadge subtleSuccess">Active</span>
                                        </div>
                                        <div className="col-auto">
                                            <div className="stktDate">20 Mar, 2026</div>
                                        </div>
                                    </div>
                                    <div className="stktContent col">
                                        <span className="priorityBadge high">High Priority</span>
                                        <a href="#"><h3 className="stktHead my-2">Can&apos;t access dashboard after update</h3></a>
                                        <div className="">Tizzy® Mail Enterprise - 100 GB</div>
                                    </div>
                                    <div className="stktBtm d-flex col-auto">
                                        <div className="col">
                                            <div className="crDomain d-flex align-items-center">
                                                <div className="avatarSmall flex-shrink-0 warningBg">G</div>
                                                <div className="crDomainName ps-2">ganeshenterprises.com</div>
                                            </div>
                                        </div>
                                        <div className="col-auto">
                                            <a href="#" className="crBtn"><ChevronRight className="icon me-0" /></a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Slide 6 */}
                            <div className="swiper-slide">
                                <div className="supportTkt btnDisplay d-flex flex-column">
                                    <div className="stktTop d-flex align-items-center col-auto">
                                        <div className="col">
                                            <div className="stktNo">SUP2523</div>
                                            <span className="statusBadge subtleSuccess">Active</span>
                                        </div>
                                        <div className="col-auto">
                                            <div className="stktDate">20 Mar, 2026</div>
                                        </div>
                                    </div>
                                    <div className="stktContent col">
                                        <span className="priorityBadge high">High Priority</span>
                                        <a href="#"><h3 className="stktHead my-2">Can&apos;t access dashboard after update</h3></a>
                                        <div className="">Tizzy® Mail Enterprise - 100 GB</div>
                                    </div>
                                    <div className="stktBtm d-flex align-items-center col-auto">
                                        <div className="col">
                                            <div className="crDomain d-flex align-items-center">
                                                <div className="avatarSmall flex-shrink-0 dangerBg">G</div>
                                                <div className="crDomainName ps-2">ganeshenterprises.com</div>
                                            </div>
                                        </div>
                                        <div className="col-auto">
                                            <a href="#" className="crBtn"><ChevronRight className="icon me-0" /></a>
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
    );
}