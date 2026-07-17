import React, { useState } from "react";
import { BiChevronDown, BiX } from "react-icons/bi";
import styles from "./CreateNewTicketForm.module.css";
import { useAddTicketMutation } from "@/redux/apis/supportTicketsApi";
import { GrAttachment } from "react-icons/gr";
import { FaTrash } from "react-icons/fa";
import Image from "next/image";

const MAX_DESCRIPTION_LENGTH = 200;

const serviceOptions = [
  "Tizzy® Mail Enterprise 300 GB",
  "Tizzy® Mail Enterprise - 100 GB",
  "Tizzy® Mail Enterprise - 50 GB",
];

const priorityOptions = ["Low", "Medium", "High"];

const initialFormData = {
  name: "",
  email: "",
  domain: "",
  service: serviceOptions[0],
  subject: "",
  priority: "Low",
  description: "",
  attachments: [],
};

const CreateNewTicketForm = () => {
  const [addTicket, { isLoading: isAddingTicket }] = useAddTicketMutation();
  const [formData, setFormData] = useState(initialFormData);
  console.log(formData);

  const remainingCharacters =
    MAX_DESCRIPTION_LENGTH - formData.description.length;

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    console.log(files, "file");

    if (name === "attachments") {
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...Array.from(files)],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDescriptionChange = (event) => {
    const { value } = event.target;
    if (value.length <= MAX_DESCRIPTION_LENGTH) {
      setFormData((prev) => ({
        ...prev,
        description: value,
      }));
    }
  };

  const handlePriorityChange = (priority) => {
    setFormData((prev) => ({
      ...prev,
      priority,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className={styles.wrapper}>
      <div className={`sectionCard ${styles.formCard}`}>
        <form onSubmit={handleSubmit} noValidate>
          <h2 className={`${styles.sectionTitle} sectionCardHead`}>
            Customer Details
          </h2>

          <div className={styles.grid}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="ticket-name">
                Name<span className={styles.required}>*</span>
              </label>
              <input
                id="ticket-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="ticket-email">
                Email<span className={styles.required}>*</span>
              </label>
              <input
                id="ticket-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>

          <div className={styles.grid}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="ticket-domain">
                Domain<span className={styles.required}>*</span>
              </label>
              <input
                id="ticket-domain"
                type="text"
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="ticket-service">
                Service<span className={styles.required}>*</span>
              </label>
              <div className={styles.selectWrap}>
                <select
                  id="ticket-service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className={`form-control ${styles.select}`}
                >
                  {serviceOptions.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
                <BiChevronDown className={styles.selectIcon} aria-hidden />
              </div>
            </div>
          </div>

          <h2 className={`${styles.sectionTitle} sectionCardHead`}>
            Ticket Details
          </h2>

          <div className={styles.grid}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="ticket-subject">
                Subject<span className={styles.required}>*</span>
              </label>
              <input
                id="ticket-subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className={styles.formGroup}>
              <span className={styles.label}>
                Priority<span className={styles.required}>*</span>
              </span>
              <div className={styles.priorityGroup}>
                {priorityOptions.map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    className={`${styles.priorityBtn} ${
                      formData.priority === priority
                        ? styles.priorityActive
                        : ""
                    }`}
                    onClick={() => handlePriorityChange(priority)}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.descriptionGroup}>
            <label className={styles.label} htmlFor="ticket-description">
              Description<span className={styles.required}>*</span>
            </label>
            <textarea
              id="ticket-description"
              name="description"
              value={formData.description}
              onChange={handleDescriptionChange}
              className={`form-control ${styles.textarea}`}
              placeholder="Describe the issue in detail"
              // rows={2}
              style={{ resize: "none" }}
            />
            <p className={styles.charCount}>
              Remaining {remainingCharacters} Characters
            </p>
          </div>

          <div className={styles.attachmentsGroup}>
            <p className={styles.label}>Attachments</p>

            <label
              htmlFor="ticket-attachments"
              className={styles.attachmentsBtn}
            >
              <GrAttachment /> Add Attachments
            </label>
            <input
              id="ticket-attachments"
              type="file"
              name="attachments"
              multiple
              style={{ display: "none" }}
              onChange={handleChange}
            />
            <br />
            <div className={styles.allAttachments}>
              {formData?.attachments?.map((attachment, idx) => {
                return (
                  <div key={idx} className={styles.attachmentItem}>
                    {attachment.type.includes("image") ? (
                      <Image
                        src={URL.createObjectURL(attachment)}
                        alt="attachment"
                        width={80}
                        height={80}
                        style={{ objectFit: "cover", borderRadius: "4px" }}
                      />
                    ) : (
                      <span>{attachment.name}</span>
                    )}
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          attachments: prev.attachments.filter(
                            (_, i) => i !== idx,
                          ),
                        }));
                      }}
                    >
                      <BiX />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.submitWrap}>
            <button type="submit" className={styles.submitBtn}>
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNewTicketForm;
