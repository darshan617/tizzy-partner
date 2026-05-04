import Link from "next/link";
import { Plus, ChevronUp } from "lucide-react";
import styles from "@/components/customers/customer-summary/CustomerSummary.module.css";
import { useRouter } from "next/router";

const ActiveCustomerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className="icon"
  >
    <path fill="currentColor" d="M16 6a4 4 0 1 1-8 0a4 4 0 0 1 8 0" />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M16.5 22c-1.65 0-2.475 0-2.987-.513C13 20.975 13 20.15 13 18.5s0-2.475.513-2.987C14.025 15 14.85 15 16.5 15s2.475 0 2.987.513C20 16.025 20 16.85 20 18.5s0 2.475-.513 2.987C18.975 22 18.15 22 16.5 22m1.968-4.254a.583.583 0 1 0-.825-.825l-1.92 1.92l-.366-.365a.583.583 0 1 0-.825.825l.778.778a.583.583 0 0 0 .825 0z"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      d="M14.477 21.92c-.726.053-1.547.08-2.477.08c-8 0-8-2.015-8-4.5S7.582 13 12 13c2.88 0 5.406.856 6.814 2.141C18.298 15 17.574 15 16.5 15c-1.65 0-2.475 0-2.987.513C13 16.025 13 16.85 13 18.5s0 2.475.513 2.987c.237.238.542.365.964.434"
      opacity="0.5"
    />
  </svg>
);

const InactiveCustomerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className="icon"
  >
    <path fill="currentColor" d="M16 6a4 4 0 1 1-8 0a4 4 0 0 1 8 0" />
    <path
      fill="currentColor"
      d="M14.477 21.92c-.726.053-1.547.08-2.477.08c-8 0-8-2.015-8-4.5S7.582 13 12 13c2.88 0 5.406.856 6.814 2.141C18.298 15 17.574 15 16.5 15c-1.65 0-2.475 0-2.987.513C13 16.025 13 16.85 13 18.5s0 2.475.513 2.987c.237.238.542.365.964.434"
      opacity="0.5"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M16.5 22c-1.65 0-2.475 0-2.987-.513C13 20.975 13 20.15 13 18.5s0-2.475.513-2.987C14.025 15 14.85 15 16.5 15s2.475 0 2.987.513C20 16.025 20 16.85 20 18.5s0 2.475-.513 2.987C18.975 22 18.15 22 16.5 22m-1.143-5.468a.583.583 0 1 0-.825.825l1.143 1.143l-1.143 1.143a.583.583 0 1 0 .825.825l1.143-1.143l1.143 1.143a.583.583 0 1 0 .825-.825L17.325 18.5l1.143-1.143a.583.583 0 1 0-.825-.825L16.5 17.675z"
      clipRule="evenodd"
    />
  </svg>
);

const ClosedCustomerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className="icon"
  >
    <path fill="currentColor" d="M12 10a4 4 0 1 0 0-8a4 4 0 0 0 0 8" />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M16.5 15.75a2.75 2.75 0 0 0-2.383 4.123l3.756-3.756a2.74 2.74 0 0 0-1.373-.367m2.42 1.442l-3.728 3.728a2.75 2.75 0 0 0 3.728-3.728M12.25 18.5a4.25 4.25 0 1 1 8.5 0a4.25 4.25 0 0 1-8.5 0"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      d="M17.996 14.521a4.25 4.25 0 0 0-3.979 7.429Q13.107 22 12 22c-8 0-8-2.015-8-4.5S7.582 13 12 13c2.387 0 4.53.588 5.996 1.521"
      opacity="0.4"
    />
  </svg>
);

import React, { useEffect, useRef, useState } from "react";
import { RiLoader2Fill } from "react-icons/ri";
import Loader from "@/components/common-components/Loader";

const summaryCards = [
  {
    title: "Active Customers",
    key: "active",
    value: "124k",
    trend: "8.72%",
    boxClass: "successGrad",
    iconClass: "successColor",
    badgeClass: "down",
    icon: <ActiveCustomerIcon />,
  },
  {
    title: "Inactive Customers",
    key: "inactive",
    value: "51k",
    trend: "8.72%",
    boxClass: "dangerGrad",
    iconClass: "dangerColor",
    badgeClass: "up",
    icon: <InactiveCustomerIcon />,
  },
  {
    title: "Closed Customers",
    key: "closed",
    value: "75k",
    trend: "8.72%",
    boxClass: "warningGrad",
    iconClass: "warningColor",
    badgeClass: "up",
    icon: <ClosedCustomerIcon />,
  },
];

// const Counter = ({ target, suffix }) => {
//   const ref = useRef();
//   useEffect(() => {
//     let start = 0;
//     let raf;
//     const isInt = Number.isInteger(target);
//     const displayTarget = target >= 1000 ? target / 1000 : target;
//     const animate = () => {
//       if (start < displayTarget) {
//         start += displayTarget / 100;
//         if (start > displayTarget) start = displayTarget;
//         ref.current.innerText =
//           Math.floor(start) + (suffix || "");
//         raf = requestAnimationFrame(animate);
//       } else {
//         ref.current.innerText =
//           Math.floor(displayTarget) + (suffix || "");
//       }
//     };
//     animate();
//     return () => raf && cancelAnimationFrame(raf);
//   }, [target, suffix]);
//   return <span ref={ref}>0{suffix || ""}</span>;
// };

export default function CustomerSummary({
  allCustomers,
  isFetchingAllCustomers,
}) {
  const router = useRouter();
  const [asOnDate, setAsOnDate] = useState("");
  useEffect(() => {
    setAsOnDate(
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    );
  }, []);
  const count = allCustomers?.data?.count;

  const counts = {};
  return (
    <div>
      <div className="col">
        <div className="row align-items-end">
          <div className="col">
            <nav className={`${styles.breadcrumb} mb-0`}>
              <button
                onClick={() => router.push("/dashboard")}
                className={styles.breadcrumbItem}
              >
                Dashboard
              </button>{" "}
              /
              <button
                onClick={() => router.push("/customers")}
                className={styles.breadcrumbItem}
              >
                Customers
              </button>
              <h1 className="breadcrumb-item active" aria-current="page">
                Customer Management
              </h1>
            </nav>
          </div>
        </div>
      </div>
      <div className="col mt-3">
        <div className={`${styles.sectionCard} py-4 px-sm-4 px-3`}>
          <div className="mb-2">
            <h2 className={`${styles.sectionCardHead}`}>Summary</h2>
            {asOnDate ? (
              <small className="ms-1 textSecondary">{`(As on ${asOnDate})`}</small>
            ) : null}
          </div>

          <div className="row row-cols-md-4 row-cols-sm-4 row-cols-2 g-sm-4 g-3">
            {summaryCards.map((card, index) => {
              // console.log(count[card?.title.toLowerCase()]);

              return (
                <div className="col pt-4" key={index}>
                  <div className={`statBox ${card.boxClass}`}>
                    <div className={`statIcon ${card.iconClass}`}>
                      {card.icon}
                    </div>

                    <a href="#" className={`${styles.statText}  mt-3`}>
                      <div className={`${styles.statLabel}  mb-2`}>
                        {card.title}
                      </div>
                      <div className="d-flex align-items-center">
                        <div className={`${styles.statValue}`}>
                          {isFetchingAllCustomers ? (
                            <Loader />
                          ) : (
                            count?.[card?.key.toLowerCase()]
                          )}
                        </div>
                        {/* <div className={`statusBadge ${card.badgeClass}`}>
                       <ChevronUp className="icon me-0" />
                        <span>{card.trend}</span>
                      </div> */}
                      </div>
                    </a>
                  </div>
                </div>
              );
            })}
            <div className="col pt-4">
              <button
                className="boxLink primaryBg d-flex flex-column align-items-center justify-content-center border-0 outline-0"
                onClick={() => router.push("/customers/create-customer")}
              >
                <div className={`${styles.iconBx} mb-2`}>
                  <Plus className={`${styles.icon}`} size={18} />
                </div>
                <div>Add New Customer</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
