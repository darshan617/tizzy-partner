import React, { useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import styles from "./CreateNewTicketForm.module.css";

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
};

const CreateNewTicketForm = () => {
  const [formData, setFormData] = useState(initialFormData);

  const remainingCharacters =
    MAX_DESCRIPTION_LENGTH - formData.description.length;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
                      formData.priority === priority ? styles.priorityActive : ""
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
