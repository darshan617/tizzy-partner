import React, { useEffect, useState } from "react";
import styles from "@/components/ticket-detail/TicketDetail.module.css";
import { FiUser, FiGlobe, FiLayers, FiCalendar } from "react-icons/fi";
import { BsPrinter } from "react-icons/bs";
import { IoReturnUpForwardOutline } from "react-icons/io5";
import { useRouter } from "next/router";
import { useGetTicketDetailMutation } from "@/redux/apis/supportTicketsApi";
import Cookies from "js-cookie";
import Image from "next/image";

const activities = [
  {
    id: 1,
    date: "Today",
    title: "Ticket Resolved",
    description:
      "Issue fixed after applying the latest patch. Confirmed working on staging.",
    by: "User One",
    color: "rgba(2, 188, 156, 1)",
  },
  {
    id: 2,
    date: "20 Mar 2026, 3:15 PM",
    title: "Status Changed to 'In Progress'",
    description: "Assigned to support agent for further investigation.",
    by: "User Two",
    color: "rgba(91, 195, 225, 1)",
  },
  {
    id: 3,
    date: "17 Mar 2026, 1:00 PM",
    title: "User Comment Added",
    description: "Customer mentioned the issue is urgent for production use.",
    by: "User Two",
    color: "rgba(249, 191, 89, 1)",
  },
  {
    id: 4,
    date: "15 Mar 2026, 4:30 PM",
    title: "Ticket Created",
    description: "Initial report about app freezing on login.",
    by: "User One",
    color: "rgba(247, 87, 126, 1)",
  },
];

const TicketDetail = () => {
  const router = useRouter();
  const userData = Cookies.get("userData")
    ? JSON.parse(Cookies.get("userData"))
    : {};
  const [ticketDetail, setTicketDetail] = useState(null);
  console.log(ticketDetail, "ticketDetail");
  const [getTicketDetail, { isLoading: isGettingTicketDetail }] =
    useGetTicketDetailMutation();
  useEffect(() => {
    if (router?.query?.ticket_id && router?.isReady) {
      const fetchTicketDetail = async () => {
        try {
          const response = await getTicketDetail({
            body: {
              partner_id: userData?.id,
              ticket_id: router?.query?.ticket_id,
            },
          });
          if (response?.data?.success) {
            setTicketDetail(response?.data?.data);
          }
        } catch (error) {
          console.log(error, "error");
        }
      };
      fetchTicketDetail();
    }
  }, [userData?.id, router?.query?.ticket_id, router?.isReady]);

  const priorityPillClass = {
    High: styles.pillDanger,
    Medium: styles.pillWarning,
    Low: styles.pillSuccess,
  };
  return (
    <div className={styles.page}>
      <div className={styles.headerBar}>
        <div className={styles.headerLeft}>
          <span className={styles.ticketId}>{ticketDetail?.ticket_no} :</span>
          <span
            className={styles.ticketTitle}
            style={{ textTransform: "capitalize" }}
          >
            {ticketDetail?.subject}
          </span>
        </div>
        {/* <div className={styles.headerBadges}>
          <span className={`${styles.pill} ${styles.pillDanger}`}>
            High Priority
          </span>
          <span className={`${styles.pill} ${styles.pillWarning}`}>
            Pending
          </span>
        </div> */}
      </div>

      <div className={styles.contentGrid}>
        <section className={styles.detailCard}>
          <div className={styles.customerHeader}>
            <div className={styles.avatar} aria-hidden="true">
              {ticketDetail?.name?.charAt(0)}
            </div>
            <div>
              <p className={styles.fieldLabel}>Customer Name</p>
              <h2 className={styles.customerName}>{ticketDetail?.name}</h2>
            </div>
          </div>

          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <p className={styles.fieldLabel}>Customer Name</p>
              <p className={styles.metaValue}>
                <FiUser className={styles.metaIcon} />
                {ticketDetail?.name}
              </p>
            </div>
            <div className={styles.metaItem}>
              <p className={styles.fieldLabel}>Domain</p>
              <p className={styles.metaValue}>
                <FiGlobe className={styles.metaIcon} />
                {ticketDetail?.domain}
              </p>
            </div>
            <div className={styles.metaItem}>
              <p className={styles.fieldLabel}>Service</p>
              <p className={styles.metaValue}>
                <FiLayers className={styles.metaIcon} />
                {ticketDetail?.service}
              </p>
            </div>
            <div className={styles.metaItem}>
              <p className={styles.fieldLabel}>Priority</p>
              <span
                className={`${styles.pill} ${
                  priorityPillClass[ticketDetail?.priority] ??
                  styles.pillDefault
                } ${styles.pillSm}`}
              >
                {ticketDetail?.priority}
              </span>
            </div>
            <div className={styles.metaItem}>
              <p className={styles.fieldLabel}>Status</p>
              <span
                className={`${styles.pill} ${styles.pillWarning} ${styles.pillSm}`}
              >
                {ticketDetail?.status}
              </span>
            </div>
            <div className={styles.metaItem}>
              <p className={styles.fieldLabel}>Created On</p>
              <p className={styles.metaValue}>
                <FiCalendar className={styles.metaIcon} />
                {ticketDetail?.created_on}
              </p>
            </div>
          </div>

          <div className={styles.sectionBlock}>
            <p className={styles.fieldLabel}>Subject</p>
            <p className={styles.bodyText}>{ticketDetail?.subject}</p>
          </div>

          <div className={styles.sectionBlock}>
            <p className={styles.fieldLabel}>Description</p>
            <div className={styles.descriptionBody}>
              <p>{ticketDetail?.description}</p>
            </div>
          </div>

          <div className={styles.sectionBlock}>
            <p className={styles.fieldLabel}>Attachments</p>
            <div className={styles.descriptionBody}>
              {ticketDetail?.attachments?.map((item) => (
                <p>{item?.url}</p>
              ))}
            </div>
          </div>

          <div className={styles.actions}>
            {/* <button type="button" className={styles.actionBtn}>
              <BsReply />
              Reply
            </button> */}
            <button type="button" className={styles.actionBtn}>
              <IoReturnUpForwardOutline />
              Forward
            </button>
            <button type="button" className={styles.actionBtn}>
              <BsPrinter />
              Print
            </button>
          </div>
        </section>

        <aside className={styles.activityCard}>
          <div className={styles.activityHeader}>
            <p className={styles.fieldLabel}>Activity</p>
          </div>
          <div className={styles.boder}></div>
          <ul className={styles.timeline}>
            {activities.map((item) => (
              <li key={item.id} className={styles.timelineItem}>
                <div className={styles.timelineLeft}>
                  <span className={styles.timelineDate}>{item.date}</span>
                  <span
                    className={styles.timelineDot}
                    style={{ backgroundColor: item.color }}
                  />
                </div>
                <div className={styles.timelineContent}>
                  <h3 className={styles.timelineTitle}>{item.title}</h3>
                  <p className={styles.timelineDesc}>{item.description}</p>
                  <button type="button" className={styles.timelineBy}>
                    By {item.by}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default TicketDetail;
