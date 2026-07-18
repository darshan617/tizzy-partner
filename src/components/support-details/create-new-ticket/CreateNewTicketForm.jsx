import React, { useEffect, useState } from "react";
import { BiChevronDown, BiX } from "react-icons/bi";
import styles from "./CreateNewTicketForm.module.css";
import {
  useAddTicketMutation,
  useGetAllServiceListQuery,
  useGetOrdersByPartnerMutation,
  usePlanViewByPartnerQuery,
} from "@/redux/apis/supportTicketsApi";
import { GrAttachment } from "react-icons/gr";
import { FaTrash } from "react-icons/fa";
import Image from "next/image";
import Cookies from "js-cookie";
import CustomDropdown from "@/common-components/custom-dropdown/CustomDropdown";
import { useToast } from "@/custom-hooks/toast/ToastProvider";

const MAX_DESCRIPTION_LENGTH = 200;
const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_TOTAL_ATTACHMENTS_MB = 5;
const MAX_TOTAL_ATTACHMENTS_BYTES = MAX_TOTAL_ATTACHMENTS_MB * 1024 * 1024;

const serviceOptions = [
  "Tizzy® Mail Enterprise 300 GB",
  "Tizzy® Mail Enterprise - 100 GB",
  "Tizzy® Mail Enterprise - 50 GB",
];

const priorityOptions = ["Low", "Medium", "High"];

const initialFormData = {
  orderId: "",
  name: "",
  email: "",
  domain: "",
  service: "",
  subject: "",
  priority: "Low",
  description: "",
  attachments: [],
};

const toServiceOptions = (list) =>
  (Array.isArray(list) ? list : [])
    .map((item) => {
      const name =
        typeof item === "string" ? item : item?.name || item?.plan_name || "";
      return name ? { label: name, value: name } : null;
    })
    .filter(Boolean);

const CreateNewTicketForm = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [serviceOptionsList, setServiceOptionsList] = useState([]);
  const userData = Cookies.get("userData")
    ? JSON.parse(Cookies.get("userData"))
    : {};
  const { data: serviceList } = usePlanViewByPartnerQuery();
  const [addTicket, { isLoading: isAddingTicket }] = useAddTicketMutation();
  const [getOrdersByPartner, { isLoading: isGettingOrders }] =
    useGetOrdersByPartnerMutation();

  const remainingCharacters =
    MAX_DESCRIPTION_LENGTH - formData.description.length;

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    if (name === "attachments") {
      const selectedFiles = Array.from(files || []);
      const oversized = selectedFiles.find(
        (file) => file.size > MAX_FILE_SIZE_BYTES,
      );
      if (oversized) {
        showToast(
          `"${oversized.name}" exceeds ${MAX_FILE_SIZE_MB}MB. Please choose a smaller file.`,
          "error",
        );
        event.target.value = "";
        return;
      }

      const nextAttachments = [...formData.attachments, ...selectedFiles];
      const totalSize = nextAttachments.reduce(
        (sum, file) => sum + file.size,
        0,
      );
      if (totalSize > MAX_TOTAL_ATTACHMENTS_BYTES) {
        showToast(
          `Total attachments must be under ${MAX_TOTAL_ATTACHMENTS_MB}MB.`,
          "error",
        );
        event.target.value = "";
        return;
      }

      setFormData((prev) => ({
        ...prev,
        attachments: nextAttachments,
      }));
      event.target.value = "";
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = "Name is required";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    }
    if (!formData.domain) {
      newErrors.domain = "Domain is required";
    }
    if (!formData.service || formData.service === "") {
      newErrors.service = "Service is required";
    }
    if (!formData.subject) {
      newErrors.subject = "Subject is required";
    }
    if (!formData.priority) {
      newErrors.priority = "Priority is required";
    }
    if (!formData.description) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleServiceChange = (option) => {
    setFormData((prev) => ({
      ...prev,
      service: option?.label || "",
    }));
    setErrors((prev) => ({
      ...prev,
      service: "",
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
    setErrors((prev) => ({
      ...prev,
      description: "",
    }));
  };

  const handlePriorityChange = (priority) => {
    setFormData((prev) => ({
      ...prev,
      priority,
    }));
    setErrors((prev) => ({
      ...prev,
      priority: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    try {
      const { attachments, ...fields } = formData;
      const body = new FormData();

      body.append("partner_id", String(userData?.id ?? ""));
      Object.entries(fields).forEach(([key, value]) => {
        body.append(key, value ?? "");
      });
      attachments.forEach((file) => {
        body.append("attachments[]", file);
      });

      const res = await addTicket({ body });
      if (res?.data?.success) {
        showToast(res?.data?.message, "success");
        setFormData(initialFormData);
        return;
      }

      if (res?.error?.status === 413) {
        showToast(
          "Attachments are too large for the server. Please use smaller files.",
          "error",
        );
        return;
      }

      showToast(res?.error?.data?.message || "Something went wrong", "error");
    } catch (error) {
      showToast(error?.data?.message || "Something went wrong", "error");
    }
  };

  const handleSearchOrders = async () => {
    try {
      const res = await getOrdersByPartner({
        body: { partner_id: userData.id, order_no: formData.orderId },
      });

      if (res?.data?.success) {
        const planOptions = toServiceOptions(res?.data?.data?.plan_list);
        setServiceOptionsList(planOptions);
        setFormData((prev) => ({
          ...prev,
          name: res?.data?.data?.name,
          email: res?.data?.data?.email,
          domain: res?.data?.data?.domain,
          service: planOptions[0]?.label || prev.service || "",
        }));
      } else {
        setFormData({
          orderId: "",
          name: "",
          email: "",
          domain: "",
          service: "",
          subject: "",
          priority: "Low",
          description: "",
          attachments: [],
        });
        showToast(res?.error?.data?.message || "Something went wrong", "error");
      }
    } catch (error) {
      showToast(error?.data?.message, "error");
      setFormData({
        orderId: "",
        name: "",
        email: "",
        domain: "",
        service: "",
        subject: "",
        priority: "Low",
        description: "",
        attachments: [],
      });
    }
  };

  useEffect(() => {
    if (!serviceList?.data) return;
    setServiceOptionsList(toServiceOptions(serviceList.data));
  }, [serviceList]);

  return (
    <div className={styles.wrapper}>
      <div className={`sectionCard ${styles.formCard}`}>
        <form onSubmit={handleSubmit} noValidate>
          <h2 className={`${styles.sectionTitle} sectionCardHead`}>
            Customer Details
          </h2>

          <div className={styles.grid}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="ticket-email">
                Order ID
              </label>
              <div className={styles.orderIdGroup}>
                <input
                  id="ticket-orderId"
                  type="text"
                  name="orderId"
                  value={formData.orderId}
                  onChange={handleChange}
                  className="form-control"
                />
                <button
                  type="button"
                  className={styles.searchBtn}
                  onClick={handleSearchOrders}
                  disabled={isGettingOrders || formData.orderId === ""}
                  style={{
                    cursor:
                      isGettingOrders || formData.orderId === ""
                        ? "not-allowed"
                        : "pointer",
                    opacity:
                      isGettingOrders || formData.orderId === "" ? 0.5 : 1,
                  }}
                >
                  {isGettingOrders ? "Searching..." : "Search"}
                </button>
              </div>
            </div>
          </div>
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
              {errors.name && <p className={styles.error}>{errors.name}</p>}
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
              {errors.email && <p className={styles.error}>{errors.email}</p>}
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
              {errors.domain && <p className={styles.error}>{errors.domain}</p>}
            </div>

            <div className={styles.formGroup}>
              {/* <label className={styles.label} htmlFor="ticket-service">
                Service<span className={styles.required}>*</span>
              </label> */}
              <div className={styles.selectWrap}>
                {/* <select
                  id="ticket-service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className={`form-control ${styles.select}`}
                >
                  {formData?.service?.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
                <BiChevronDown className={styles.selectIcon} aria-hidden /> */}
                <CustomDropdown
                  label="Service"
                  options={serviceOptionsList}
                  onChange={handleServiceChange}
                  value={formData.service}
                  placeholder="Select Service"
                  isSearchable={true}
                  customHeight="39px"
                />
                {errors.service && (
                  <p className={styles.error}>{errors.service}</p>
                )}
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
              {errors.subject && (
                <p className={styles.error}>{errors.subject}</p>
              )}
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
              {errors.priority && (
                <p className={styles.error}>{errors.priority}</p>
              )}
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
            <div className="d-flex align-items-center gap-2 justify-content-between">
              {errors.description ? (
                <p className={`${styles.error} ${styles.charCount}`}>
                  {errors.description}
                </p>
              ) : (
                <p className="m-0"></p>
              )}
              <p className={styles.charCount}>
                Remaining {remainingCharacters} Characters
              </p>
            </div>
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
              accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip"
            />
            <p className="text-warning small mt-1 m-0">
              Note: jpg,jpeg,png,gif,pdf,doc,docx,xls,xlsx,txt,zip are
              supported.
            </p>
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
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isAddingTicket}
              style={{
                cursor: isAddingTicket ? "not-allowed" : "pointer",
                opacity: isAddingTicket ? 0.5 : 1,
              }}
            >
              {isAddingTicket ? "Creating..." : "Create Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNewTicketForm;
