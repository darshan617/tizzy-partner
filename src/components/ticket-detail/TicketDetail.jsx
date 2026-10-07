import React, { useEffect, useRef, useState } from "react";
import styles from "@/components/ticket-detail/TicketDetail.module.css";
import {
  FiAlertTriangle,
  FiPaperclip,
  FiSend,
  FiUser,
  FiGlobe,
  FiLayers,
  FiCalendar,
  FiBox,
  FiMessageCircle,
  FiX,
} from "react-icons/fi";
import { BsPrinter } from "react-icons/bs";
import { useRouter } from "next/router";
import {
  useCloseTicketMutation,
  useGetTicketConversationMutation,
  useGetTicketDetailMutation,
  useReplyTicketMutation,
} from "@/redux/apis/supportTicketsApi";
import Cookies from "js-cookie";
import { CiMail } from "react-icons/ci";
import SupportChat from "./SupportChat";
import { SIDEBAR_SERVICES_CONSTANTS } from "../layout/sidebar/SidebarConstant";
import usePermissions from "@/custom-hooks/permissions/usePermissions";
import { CgMailReply } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsPopupVisible,
  setIsPopupVisible,
} from "@/redux/slices/popupSlice";
import CustomPopup from "@/common-components/custom-popup/CustomPopup";
import { useToast } from "@/custom-hooks/toast/ToastProvider";

const activitiesColor = [
  {
    id: 1,
    color: "rgba(2, 188, 156, 1)",
  },
  {
    id: 2,
    color: "rgba(91, 195, 225, 1)",
  },
  {
    id: 3,
    color: "rgba(249, 191, 89, 1)",
  },
  {
    id: 4,
    color: "rgba(247, 87, 126, 1)",
  },
];

const formatConversationDate = (item) => {
  const value = item?.created_at || item?.created_on;
  if (!value) return item?.time || "";

  const date = new Date(
    /^\d{4}-\d{2}-\d{2}/.test(value) ? value.replace(" ", "T") : value,
  );

  if (Number.isNaN(date.getTime())) return item?.created_on || item?.time || "";

  const dateLabel = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  const timeLabel = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);

  return `${dateLabel} (${timeLabel})`;
};

const getConversationRole = (item) => {
  if (item?.is_system || item?.author_role === "system") return "System";
  if (item?.author_role === "partner") return "Partner";
  if (item?.is_staff || item?.author_role === "support") return "Support";
  return item?.author_role || "User";
};

const TicketDetail = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const userData = Cookies.get("userData")
    ? JSON.parse(Cookies.get("userData"))
    : {};
  const { showToast } = useToast();
  const isPopupVisible = useSelector(selectIsPopupVisible);
  const [ticketDetail, setTicketDetail] = useState(null);
  const [ticketConversation, setTicketConversation] = useState(null);
  const [isSupportChatOpen, setIsSupportChatOpen] = useState(false);
  const detailCardRef = useRef(null);
  const [detailCardHeight, setDetailCardHeight] = useState(null);
  const { canAdd, canDelete, canEdit, canView } = usePermissions();
  const [closeTicketMessage, setCloseTicketMessage] = useState("");
  const [isReplyFormVisible, setIsReplyFormVisible] = useState(false);
  const [replyEmail, setReplyEmail] = useState(userData?.email || "");
  const effectiveReplyEmail =
    replyEmail ||
    ticketDetail?.email ||
    ticketDetail?.customer_email ||
    userData?.email ||
    "";
  const [replyMessage, setReplyMessage] = useState("");
  const [replyAttachments, setReplyAttachments] = useState([]);
  const replyFileInputRef = useRef(null);

  const [getTicketDetail, { isLoading: isGettingTicketDetail }] =
    useGetTicketDetailMutation();

  const [getTicketConversation, { isLoading: isGettingTicketConversation }] =
    useGetTicketConversationMutation();

  const [closeTicket, { isLoading: isClosingTicket }] =
    useCloseTicketMutation();

  const [replyTicket, { isLoading: isReplying }] = useReplyTicketMutation();

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

  const fetchTicketConversation = async () => {
    try {
      const response = await getTicketConversation({
        body: {
          partner_id: userData?.id,
          ticket_id: router?.query?.ticket_id,
        },
      });
      if (response?.data?.success) {
        setTicketConversation(response?.data?.data?.conversation);
        console.log(response?.data);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleReplyFilesSelected = (event) => {
    const files = Array.from(event.target.files || []);
    console.log(files);

    if (files.length) {
      setReplyAttachments((currentFiles) => [...currentFiles, ...files]);
    }
    event.target.value = "";
  };

  const handleRemoveReplyAttachment = (fileIndex) => {
    setReplyAttachments((currentFiles) =>
      currentFiles.filter((_, index) => index !== fileIndex),
    );
  };

  const handleSendTicketReply = async (event) => {
    event.preventDefault();
    const trimmedMessage = replyMessage.trim();

    if (!userData?.id) {
      showToast(
        "Unable to identify the partner user. Please sign in again.",
        "error",
      );
      return;
    }
    if (!trimmedMessage) {
      showToast("Please enter a reply message.", "error");
      return;
    }
    if (!effectiveReplyEmail.trim()) {
      showToast("Please enter an email address.", "error");
      return;
    }

    const body = new FormData();
    body.append("partner_id", String(userData.id));
    body.append("ticket_id", String(router?.query?.ticket_id || ""));
    body.append("partner_user_id", String(userData?.partner_user_id || null));
    body.append("message", trimmedMessage);
    body.append("email", effectiveReplyEmail.trim());
    replyAttachments.forEach((file) => body.append("attachments[]", file));

    try {
      const response = await replyTicket({ body });
      if (response?.data?.success) {
        showToast(
          response?.data?.message || "Reply sent successfully.",
          "success",
        );
        setReplyMessage("");
        setReplyAttachments([]);
        setIsReplyFormVisible(false);
        await fetchTicketConversation();
      } else {
        showToast(
          response?.data?.message || "Unable to send the reply.",
          "error",
        );
      }
    } catch (error) {
      console.error("Ticket reply failed:", error);
      showToast("Unable to send the reply. Please try again.", "error");
    }
  };

  const handleCloseTicket = async () => {
    try {
      const response = await closeTicket({
        body: {
          partner_id: userData?.id,
          ticket_id: router?.query?.ticket_id,
          message: closeTicketMessage.trim(),
        },
      });

      if (response?.data?.success) {
        setCloseTicketMessage("");
        dispatch(setIsPopupVisible(null));
        showToast(response?.data?.message, "success");
        fetchTicketDetail();
      } else {
        console.error(
          "Ticket close failed:",
          response?.error || response?.data?.message,
        );
      }
    } catch (error) {
      console.error("Ticket close failed:", error);
    }
  };

  useEffect(() => {
    if (!router?.query?.ticket_id || !router?.isReady) return;

    let isCurrent = true;
    const ticketId = router.query.ticket_id;

    getTicketDetail({
      body: { partner_id: userData?.id, ticket_id: ticketId },
    })
      .unwrap()
      .then((response) => {
        if (isCurrent && response?.success) {
          setTicketDetail(response?.data);
        }
      })
      .catch((error) => {
        console.error("Ticket detail fetch failed:", error);
      });

    getTicketConversation({
      body: { partner_id: userData?.id, ticket_id: ticketId },
    })
      .unwrap()
      .then((response) => {
        if (isCurrent && response?.success) {
          setTicketConversation(response?.data?.conversation);
        }
      })
      .catch((error) => {
        console.error("Ticket conversation fetch failed:", error);
      });

    return () => {
      isCurrent = false;
    };
  }, [
    getTicketConversation,
    getTicketDetail,
    router?.isReady,
    router?.query?.ticket_id,
    userData?.id,
  ]);

  useEffect(() => {
    const detailCard = detailCardRef.current;
    if (!detailCard) return;

    const updateHeight = () => setDetailCardHeight(detailCard.offsetHeight);
    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(detailCard);

    return () => observer.disconnect();
  }, []);

  const priorityPillClass = {
    High: styles.pillDanger,
    Medium: styles.pillWarning,
    Low: styles.pillSuccess,
  };
  return (
    <>
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
          <div className={styles.leftColumn}>
            <section ref={detailCardRef} className={styles.detailCard}>
              <div
                className="d-flex justify-content-between align-items-center"
                style={{ borderBottom: "1px solid #eef1f5" }}
              >
                <div className={styles.customerHeader}>
                  <div className={styles.avatar} aria-hidden="true">
                    {ticketDetail?.company_name?.charAt(0)}
                  </div>
                  <div>
                    {/* <p className={styles.fieldLabel}>Company Name</p> */}
                    <h2 className={styles.customerName}>
                      {ticketDetail?.company_name}
                    </h2>
                    <p className="m-0">{ticketDetail?.customer_name}</p>
                  </div>
                </div>
                <div
                  className={`${styles.metaItem} d-flex flex-column justify-content-end align-items-end `}
                >
                  <p className={styles.fieldLabel}>
                    {ticketDetail?.created_on}
                  </p>
                  {ticketDetail?.status !== "Closed" && (
                    <button
                      type="button"
                      className={styles.actionBtn}
                      style={{
                        background: "#ffeded",
                        border: "1px solid #ffc2c2",
                        color: "#fc6565",
                      }}
                      onClick={() =>
                        dispatch(setIsPopupVisible("close-ticket"))
                      }
                    >
                      Close Ticket
                    </button>
                  )}
                </div>
              </div>

              <div className={styles.metaGrid}>
                {/* <div className={styles.metaItem}>
                <p className={styles.fieldLabel}>Company Name</p>
                <p className={styles.metaValue}>
                  <FiUser className={styles.metaIcon} />
                  {ticketDetail?.company_name}
                </p>
              </div> */}
                <div className={styles.metaItem}>
                  <div className={styles.metaValue}>
                    <div
                      style={{
                        width: 25,
                        height: 25,
                        minWidth: 25,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {
                        SIDEBAR_SERVICES_CONSTANTS?.find(
                          (item) =>
                            item?.id === Number(ticketDetail?.provider_id),
                        )?.image
                      }
                    </div>

                    <div>
                      <p className={styles.metaValue}>
                        {/* <FiLayers className={styles.metaIcon} /> */}
                        {ticketDetail?.service}
                      </p>
                      <p className={styles.metaValue}>
                        {/* <FiGlobe className={styles.metaIcon} /> */}
                        {ticketDetail?.domain}
                      </p>
                      <div className="d-flex justify-content-between align-items-center gap-1 mt-2">
                        <p className={styles.metaValue}>
                          <FiBox className={styles.metaIcon} />
                          {ticketDetail?.order_category}
                        </p>
                        <p className={styles.metaValue}>
                          <FiLayers className={styles.metaIcon} />
                          {ticketDetail?.subscription_id}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className={styles.metaItem}>
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
              </div> */}
                {/* <div className={styles.metaItem}>
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
              </div> */}
                {/* <div className={styles.metaItem}>
              <p className={styles.fieldLabel}>Created On</p>
              <p className={styles.metaValue}>
                <FiCalendar className={styles.metaIcon} />
                {ticketDetail?.created_on}
              </p>
            </div> */}
                <div className={styles.metaItem}>
                  <p className={styles.fieldLabel}>CC Mails</p>
                  <p className={styles.metaValue}>
                    <CiMail className={styles.metaIcon} />
                    {ticketDetail?.cc_emails?.map((item, idx) => item)}
                  </p>
                </div>
              </div>

              {/* <div className={styles.sectionBlock}>
            <p className={styles.fieldLabel}>Subject</p>
            <p className={styles.bodyText}>{ticketDetail?.subject}</p>
          </div> */}

              <div
                className={`${styles.sectionBlock} ${styles.descriptionSection}`}
              >
                <div className={styles.descriptionHeader}>
                  <h4 className={styles.descriptionTitle}>Description</h4>
                  <div className={styles.descriptionPills}>
                    <div className={styles.descriptionPillGroup}>
                      <span className={styles.descriptionPillLabel}>
                        Priority
                      </span>
                      <span
                        className={`${styles.pill} ${
                          priorityPillClass[ticketDetail?.priority] ??
                          styles.pillDefault
                        } ${styles.pillSm}`}
                      >
                        {ticketDetail?.priority}
                      </span>
                    </div>
                    <div className={styles.descriptionPillGroup}>
                      <span className={styles.descriptionPillLabel}>
                        Status
                      </span>
                      <span
                        className={`${styles.pill} ${styles.pillWarning} ${styles.pillSm} ${styles[ticketDetail?.status?.toLowerCase()]}`}
                      >
                        {ticketDetail?.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.descriptionBody}>
                  <p>{ticketDetail?.description}</p>
                </div>
              </div>

              <div className={styles.sectionBlock}>
                <p className={styles.fieldLabel}>Attachments</p>
                <div className={styles.allAttachments}>
                  {ticketDetail?.attachments?.length > 0 ? (
                    ticketDetail?.attachments?.map((item) => {
                      const src = item?.url?.replace(/([^:]\/)\/+/g, "$1");
                      const isImage = item?.mime_type?.startsWith("image/");

                      if (isImage) {
                        return (
                          <a
                            key={item.id}
                            href={src}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.attachmentThumb}
                          >
                            <img
                              src={src}
                              alt={item?.filename || "Attachment"}
                            />
                          </a>
                        );
                      }

                      return (
                        <a
                          key={item.id}
                          href={src}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.attachmentLink}
                        >
                          {item?.filename || "Download file"}
                        </a>
                      );
                    })
                  ) : (
                    <p className="text-muted small-text">
                      No attachments found
                    </p>
                  )}
                </div>
              </div>
            </section>
            <div className={styles.activityCard}>
              <div className={styles.activityHeader}>
                <p className={styles.fieldLabel}>Conversation</p>
                {ticketDetail?.status !== "Closed" && (
                  <button
                    type="button"
                    className={styles.actionBtn}
                    onClick={() => setIsReplyFormVisible((visible) => !visible)}
                    aria-expanded={isReplyFormVisible}
                  >
                    <CgMailReply /> Reply
                  </button>
                )}
              </div>
              {isReplyFormVisible && (
                <form
                  className={styles.replyForm}
                  onSubmit={handleSendTicketReply}
                >
                  <label
                    className={styles.replyFieldLabel}
                    htmlFor="reply-email"
                  >
                    Email
                  </label>
                  <input
                    id="reply-email"
                    type="email"
                    className={styles.replyEmailInput}
                    value={effectiveReplyEmail}
                    onChange={(event) => setReplyEmail(event.target.value)}
                    placeholder="Email address"
                    required
                    disabled={isReplying}
                  />
                  <label
                    className={styles.replyFieldLabel}
                    htmlFor="ticket-reply-message"
                  >
                    Message
                  </label>
                  <textarea
                    id="ticket-reply-message"
                    className={styles.replyMessageInput}
                    value={replyMessage}
                    onChange={(event) => setReplyMessage(event.target.value)}
                    placeholder="Write your reply..."
                    rows={5}
                    required
                    disabled={isReplying}
                  />
                  {replyAttachments.length > 0 && (
                    <ul className={styles.replyAttachmentList}>
                      {replyAttachments.map((file, index) => (
                        <li
                          key={`${file.name}-${file.lastModified}-${index}`}
                          className={styles.replyAttachmentItem}
                        >
                          <span>{file.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveReplyAttachment(index)}
                            aria-label={`Remove ${file.name}`}
                            disabled={isReplying}
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  <input
                    ref={replyFileInputRef}
                    className={styles.replyFileInput}
                    type="file"
                    multiple
                    onChange={handleReplyFilesSelected}
                    disabled={isReplying}
                  />
                  <div className={styles.replyFormActions}>
                    <button
                      type="button"
                      className={styles.replyAttachButton}
                      onClick={() => replyFileInputRef.current?.click()}
                      disabled={isReplying}
                    >
                      <FiPaperclip />
                      Attach files
                    </button>
                    <button
                      type="submit"
                      className={styles.replySendButton}
                      disabled={isReplying}
                    >
                      <FiSend />
                      {isReplying ? "Sending..." : "Send reply"}
                    </button>
                  </div>
                </form>
              )}
              <div className={styles.boder}></div>
              {ticketConversation?.length > 0 ? (
                ticketConversation.map((item, idx) => {
                  const role = getConversationRole(item);
                  const isStaffMessage =
                    item?.is_staff ||
                    item?.is_system ||
                    item?.author_role === "support";

                  return (
                    <article
                      key={item?.id ?? idx}
                      className={`${styles.conversationMessage} ${
                        isStaffMessage ? styles.conversationStaff : ""
                      }`}
                    >
                      <header className={styles.conversationMessageHeader}>
                        <div className={styles.conversationAuthor}>
                          <span
                            className={styles.conversationAvatar}
                            aria-hidden="true"
                          >
                            <FiUser />
                          </span>
                          <div className={styles.conversationAuthorInfo}>
                            <span className={styles.conversationAuthorName}>
                              {item?.author || role}
                            </span>
                            <span
                              className={`${styles.conversationRole} ${
                                role === "Partner"
                                  ? styles.conversationRoleOwner
                                  : role === "Operator"
                                    ? styles.conversationRoleOperator
                                    : styles.conversationRoleSystem
                              }`}
                            >
                              {role}
                            </span>
                          </div>
                        </div>
                        <time className={styles.conversationDate}>
                          {formatConversationDate(item)}
                        </time>
                      </header>
                      <div className={styles.conversationBody}>
                        {item?.message}
                        {item?.attachments?.length > 0 && (
                          <div className={styles.conversationAttachments}>
                            {item.attachments.map(
                              (attachment, attachmentIdx) => {
                                const filename =
                                  attachment?.filename || "Attachment";

                                return attachment?.url ? (
                                  <a
                                    key={attachment?.id ?? attachmentIdx}
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.conversationAttachment}
                                  >
                                    {filename}
                                  </a>
                                ) : (
                                  <span
                                    key={attachment?.id ?? attachmentIdx}
                                    className={styles.conversationAttachment}
                                  >
                                    {filename}
                                  </span>
                                );
                              },
                            )}
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })
              ) : (
                <p className="mt-4 mb-2 text-center">
                  No Conversation Available
                </p>
              )}
            </div>

            {/* <div className={styles.activityCard}>
              <div className={styles.activityHeader}>
                <p className={styles.fieldLabel}>Activity</p>
              </div>
              <div className={styles.boder}></div>
              <ul className={styles.timeline}>
                {ticketDetail?.activities?.map((item, idx) => (
                  <li key={item.id} className={styles.timelineItem}>
                    <div className={styles.timelineLeft}>
                      <span className={styles.timelineDate}>{item.date}</span>
                      <span
                        className={styles.timelineDot}
                        style={{
                          backgroundColor:
                            activitiesColor?.[idx % activitiesColor.length]
                              ?.color,
                        }}
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
            </div> */}
          </div>
          {/* {canEdit("support") && (
          <aside
            className={styles.chatAside}
            style={{ height: detailCardHeight || undefined }}
          >
            <SupportChat />
          </aside>
        )} */}
          <div
            className={styles.chatAside}
            style={{ height: detailCardHeight || undefined }}
          >
            {/* <SupportChat /> */}
            <div className={styles.activityCard}>
              <div className={styles.activityHeader}>
                <p className={styles.fieldLabel}>Activity</p>
              </div>
              <div className={styles.boder}></div>
              <ul className={styles.timeline}>
                {ticketDetail?.activities?.map((item, idx) => (
                  <li key={item.id} className={styles.timelineItem}>
                    <div className={styles.timelineLeft}>
                      <span className={styles.timelineDate}>{item.date}</span>
                      <span
                        className={styles.timelineDot}
                        style={{
                          backgroundColor:
                            activitiesColor?.[idx % activitiesColor.length]
                              ?.color,
                        }}
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
            </div>
          </div>
        </div>
      </div>
      <div className={styles.supportChatWidget}>
        {isSupportChatOpen && (
          <div
            id="ticket-support-chat"
            className={styles.supportChatPanel}
            role="dialog"
            aria-label="Support chat"
          >
            <SupportChat />
          </div>
        )}
        <button
          type="button"
          className={styles.supportChatLauncher}
          onClick={() => setIsSupportChatOpen((isOpen) => !isOpen)}
          aria-label={
            isSupportChatOpen ? "Close support chat" : "Open support chat"
          }
          aria-expanded={isSupportChatOpen}
        >
          {isSupportChatOpen ? <FiX /> : <FiMessageCircle />}
        </button>
      </div>
      {isPopupVisible === "close-ticket" && (
        <CustomPopup
          onClose={() => dispatch(setIsPopupVisible(null))}
          title="Close ticket"
          maxWidth="440px"
          bodyPadding="0px"
        >
          <div className={styles.closeTicketPopup}>
            <div className={styles.closeTicketIcon} aria-hidden="true">
              <FiAlertTriangle />
            </div>
            <div className={styles.closeTicketMessage}>
              <h3>Are you sure you want to close this ticket?</h3>
              <p>
                {ticketDetail?.ticket_no
                  ? `Ticket ${ticketDetail.ticket_no} will be marked as closed.`
                  : "This ticket will be marked as closed."}{" "}
                You may not be able to continue this conversation afterward.
              </p>
            </div>
          </div>
          <div className={styles.closeTicketInputWrap}>
            <label
              className={styles.closeTicketInputLabel}
              htmlFor="close-ticket-message"
            ></label>
            <textarea
              id="close-ticket-message"
              className={styles.closeTicketInput}
              value={closeTicketMessage}
              onChange={(e) => setCloseTicketMessage(e?.target?.value)}
              placeholder="Add a message about why you are closing this ticket..."
              rows={3}
              disabled={isClosingTicket}
            />
          </div>
          <div className={styles.closeTicketActions}>
            <button
              type="button"
              className={styles.closeTicketCancel}
              onClick={() => dispatch(setIsPopupVisible(null))}
              disabled={isClosingTicket}
            >
              Cancel
            </button>
            <button
              type="button"
              className={styles.closeTicketConfirm}
              onClick={handleCloseTicket}
              disabled={isClosingTicket || closeTicketMessage?.trim() === ""}
            >
              {isClosingTicket ? "Closing..." : "Close ticket"}
            </button>
          </div>
        </CustomPopup>
      )}
    </>
  );
};

export default TicketDetail;
