import React, { useEffect, useState } from "react";
import { ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { useGetTicketsMutation } from "@/redux/apis/supportTicketsApi";
import Cookies from "js-cookie";

const Support = () => {
  const [ticketsData, setTicketsData] = useState([]);
  const [getTickets, { isLoading }] = useGetTicketsMutation();
  const userData = Cookies.get("userData")
    ? JSON.parse(Cookies.get("userData"))
    : null;

  useEffect(() => {
    if (userData?.id) {
      const fetchTickets = async () => {
        const response = await getTickets({
          body: { partner_id: userData?.id },
        });
        setTicketsData(response?.data?.data?.tickets);
      };
      fetchTickets();
    }
  }, [userData?.id]);

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

  const domainColor = [
    "avatarRed",
    "avatarGold",
    "avatarBlue",
    "avatarPurple",
    "avatarTeal",
    "avatarNavy",
  ];

  return (
    <div className="col">
      <div className="sectionCard py-4">
        <div className="d-flex px-sm-4 px-3 mb-3 align-items-center">
          <div className="col">
            <h2 className="sectionCardHead">Support </h2>
          </div>

          <div className="col-auto">
            <Link
              href="/support/create-new-ticket"
              className="btn small btnDefault"
            >
              <Plus className="icon me-0" />
              <span>Open New Ticket</span>
            </Link>
          </div>
        </div>

        <div className="swiper supportSwiper px-sm-4 px-3 mb-4">
          <div className="swiper-wrapper mb-4">
            {ticketsData?.slice(0, 5)?.map((ticket, idx) => (
              <div className="swiper-slide">
                <div className="supportTkt btnDisplay d-flex flex-column">
                  <div className="stktTop d-flex align-items-center col-auto">
                    <div className="col">
                      <div className="stktNo">{ticket?.ticket_no}</div>
                      <span
                        className={`statusBadge subtle${ticket?.status?.toLowerCase()}`}
                      >
                        {ticket?.status}
                      </span>
                    </div>
                    <div className="col-auto">
                      <div className="stktDate">{ticket?.date}</div>
                    </div>
                  </div>
                  <div className="stktContent col">
                    <span
                      className={`priorityBadge ${ticket?.priority?.toLowerCase()}`}
                    >
                      {ticket?.priority}
                    </span>

                    <h3 className="stktHead my-2">{ticket?.subject}</h3>

                    <div className="">{ticket?.service}</div>
                  </div>
                  <div className="stktBtm d-flex align-items-center col-auto">
                    <div className="col">
                      <div className="crDomain d-flex align-items-center">
                        <div
                          className={`avatarSmall flex-shrink-0 ${domainColor[idx % domainColor.length]}`}
                        >
                          {ticket?.domain?.charAt(0)}
                        </div>
                        <div className="crDomainName ps-2">
                          {ticket?.domain}
                        </div>
                      </div>
                    </div>
                    <div className="col-auto">
                      <Link
                        href={`/support/ticket-details?ticket_id=${ticket?.ticket_id}`}
                        className="crBtn"
                      >
                        <ChevronRight className="icon me-0" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="swiper-scrollbar"></div>
        </div>

        <div className="d-sm-flex justify-content-center align-items-center px-sm-4 px-3 gap-2 mb-4">
          <div className="col-auto lightText text-center">
            <small>Quick Links:</small>
          </div>
          <div className="col-auto d-flex align-items-center justify-content-center gap-2 flex-wrap supportLinks">
            {/* <div className="">
              <a href="#" className="btn btnWhite small">
                <span>Awaiting Reply</span>{" "}
                <span className="dangerColor ms-1">(4)</span>
              </a>
            </div>
            <div className="">
              <a href="#" className="btn btnWhite small">
                <span>Assigned To You</span>{" "}
                <span className="dangerColor ms-1">(1)</span>
              </a>
            </div> */}
            <div className="">
              <Link href="/support" className="btn small btnDefault">
                <span>View All Tickets</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
