import React, { useEffect, useRef, useState } from "react";
import styles from "./SupportChat.module.css";
import {
  useGetConvertationMutation,
  useSendMessageMutation,
} from "@/redux/apis/supportTicketsApi";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Link from "next/link";

const getMessageDate = (message) => {
  const value = message?.created_at || message?.created_on;
  if (!value) return null;

  const date = new Date(
    /^\d{4}-\d{2}-\d{2}/.test(value) ? value.replace(" ", "T") : value,
  );
  return Number.isNaN(date.getTime()) ? null : date;
};

const getDateKey = (date) =>
  date
    ? `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    : "unknown";

const formatDateLabel = (date) => {
  if (!date) return "Date unavailable";

  const today = new Date();
  const todayKey = getDateKey(today);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (getDateKey(date) === todayKey) return "Today";
  if (getDateKey(date) === getDateKey(yesterday)) return "Yesterday";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const SupportChat = () => {
  const router = useRouter();
  const userData = Cookies.get("userData")
    ? JSON.parse(Cookies.get("userData"))
    : {};
  const [sendMessage, { isLoading: isSendMessageLoading }] =
    useSendMessageMutation();
  const [getMessage, { isLoading: isGetMessageLoading }] =
    useGetConvertationMutation();
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  console.log(selectedFiles, "selectedFiles");

  const fileInputRef = useRef(null);
  const attachMenuRef = useRef(null);

  const handleGetMessage = async () => {
    try {
      const res = await getMessage({
        body: {
          partner_id: userData?.id,
          ticket_id: router?.query?.ticket_id,
        },
      });
      if (res?.data?.success) {
        setChats(res?.data?.data?.conversation);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendMessage = async () => {
    try {
      const formData = new FormData();

      formData.append("partner_id", userData?.id);
      formData.append("ticket_id", router?.query?.ticket_id);
      formData.append("message", message);
      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          formData.append("attachments[]", file);
        });
      } else {
        formData.append("attachments[]", []);
      }
      const res = await sendMessage({
        body: formData,
      });
      if (res?.data?.success) {
        handleGetMessage();
        setMessage("");
        setSelectedFiles([]);
      }
    } catch (error) {
      console.log(error, "error in handleSendMessage");
    }
  };

  const handlePlusClick = () => {
    setIsAttachMenuOpen((prev) => !prev);
  };

  const handleUploadDocumentClick = () => {
    setIsAttachMenuOpen(false);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);
    }
    e.target.value = "";
  };

  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (attachMenuRef.current && !attachMenuRef.current.contains(e.target)) {
        setIsAttachMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!router?.isReady) return;

    handleGetMessage();

    const interval = setInterval(() => {
      handleGetMessage();
    }, 15000);

    return () => clearInterval(interval);
  }, [router?.isReady]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.avatar}>ST</div>
        <div className={styles.headerName}>Support Team</div>
      </div>

      {/* Messages */}
      <div className={styles.msgContainer}>
        <div className={styles.messages}>
          {chats?.length > 0 ? (
            chats?.map((item, idx) => {
              const messageDate = getMessageDate(item);
              const dateKey = getDateKey(messageDate);
              const previousDate = getMessageDate(chats[idx - 1]);
              const hasNewDate =
                idx === 0 || dateKey !== getDateKey(previousDate);

              return (
                <div key={idx} className={styles.messageGroup}>
                  {hasNewDate && (
                    <div className={styles.datePillWrap}>
                      <span className={styles.datePill}>
                        {formatDateLabel(messageDate)}
                      </span>
                    </div>
                  )}
                  {item?.author_role === "support" ? (
                    <div className={`${styles.messageRow} ${styles.left}`}>
                      <div className={styles.receiverBubble}>
                        {item?.message}
                        {item?.attachments?.length > 0 && (
                          <div className={styles.attachmentContainer}>
                            {item?.attachments?.map((item, idx) => {
                              return (
                                <div className={styles.attachment}>
                                  <svg
                                    xmlns="http://w3.org"
                                    viewBox="0 0 100 100"
                                    width="10%"
                                    height="10%"
                                  >
                                    <path
                                      d="M78.5,35.5 L48.5,65.5 C43,71 34,71 28.5,65.5 C23,60 23,51 28.5,45.5 L55.5,18.5 C59.5,14.5 66,14.5 70,18.5 C74,22.5 74,29 70,33 L43,60 C40.5,62.5 36.5,62.5 34,60 C31.5,57.5 31.5,53.5 34,51 L58,27"
                                      fill="none"
                                      stroke="#ffffff75"
                                      stroke-width="5"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                  </svg>

                                  <Link href={item?.url} target="_blank">
                                    {item?.filename}
                                  </Link>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <span className={styles.timestamp}>{item?.time}</span>
                    </div>
                  ) : (
                    <div className={`${styles.messageRow} ${styles.right}`}>
                      <div className={styles.senderBubble}>
                        {item?.message}
                        {item?.attachments?.length > 0 && (
                          <div className={styles.attachmentContainer}>
                            {item?.attachments?.map((item, idx) => {
                              return (
                                <div className={styles.attachment}>
                                  <svg
                                    xmlns="http://w3.org"
                                    viewBox="0 0 100 100"
                                    width="10%"
                                    height="10%"
                                  >
                                    <path
                                      d="M78.5,35.5 L48.5,65.5 C43,71 34,71 28.5,65.5 C23,60 23,51 28.5,45.5 L55.5,18.5 C59.5,14.5 66,14.5 70,18.5 C74,22.5 74,29 70,33 L43,60 C40.5,62.5 36.5,62.5 34,60 C31.5,57.5 31.5,53.5 34,51 L58,27"
                                      fill="none"
                                      stroke="#ffffff75"
                                      stroke-width="5"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                  </svg>

                                  <Link href={item?.url} target="_blank">
                                    {item?.filename}
                                  </Link>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <span className={styles.timestamp}>{item?.time}</span>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="w-100 text-center mt-auto mb-auto">
              No chats available
            </p>
          )}
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className={styles.attachmentPreviewList}>
          {selectedFiles.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className={styles.attachmentPreview}
            >
              <span className={styles.attachmentName}>{file.name}</span>
              <button
                type="button"
                className={styles.attachmentRemove}
                onClick={() => handleRemoveFile(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className={styles.inputBar}>
        <div className={styles.attachWrap} ref={attachMenuRef}>
          <button
            type="button"
            className={styles.plusButton}
            onClick={handlePlusClick}
          >
            +
          </button>

          {isAttachMenuOpen && (
            <div className={styles.attachDropdown}>
              <button
                type="button"
                className={styles.attachDropdownItem}
                onClick={handleUploadDocumentClick}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                Upload Document
              </button>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            className={styles.hiddenFileInput}
            multiple
            onChange={handleFileChange}
          />
        </div>

        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e?.target?.value)}
          className={styles.textInput}
        />
        <button
          className={styles.sendButton}
          onClick={() => handleSendMessage()}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SupportChat;
