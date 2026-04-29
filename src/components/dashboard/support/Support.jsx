
import React, { useEffect } from "react";

const Support = () => {
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
    <div className="col">
      <div className="sectionCard py-4">

        <div className="d-flex px-sm-4 px-3 mb-3 align-items-center">
          <div className="col"><h2 className="sectionCardHead">Support</h2></div>
          <div className="col-auto">
            <a href="#" className="btn small btnDefault">
              <i className="icon" data-lucide="plus" strokeWidth="3"></i>
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
                    <a href="#" className="crBtn"><i className="icon me-0" data-lucide="chevron-right"></i></a>
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
                    <a href="#" className="crBtn"><i className="icon me-0" data-lucide="chevron-right"></i></a>
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
                    <a href="#" className="crBtn"><i className="icon me-0" data-lucide="chevron-right"></i></a>
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
                    <a href="#" className="crBtn"><i className="icon me-0" data-lucide="chevron-right"></i></a>
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
                    <a href="#" className="crBtn"><i className="icon me-0" data-lucide="chevron-right"></i></a>
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
                    <a href="#" className="crBtn"><i className="icon me-0" data-lucide="chevron-right"></i></a>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div className="swiper-scrollbar"></div>
        </div>

        <div className="d-sm-flex justify-content-center align-items-center px-sm-4 px-3 gap-2 mb-4">
          <div className="col-auto lightText text-center"><small>Quick Links:</small></div>
          <div className="col-auto d-flex align-items-center justify-content-center gap-2 flex-wrap supportLinks">
            <div className="">
              <a href="#" className="btn btnWhite small"><span>Awaiting Reply</span> <span className="dangerColor ms-1">(4)</span></a>
            </div>
            <div className="">
              <a href="#" className="btn btnWhite small"><span>Assigned To You</span> <span className="dangerColor ms-1">(1)</span></a>
            </div>
            <div className="">
              <a href="#" className="btn btnWhite small"><span>All Tickets</span></a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Support;