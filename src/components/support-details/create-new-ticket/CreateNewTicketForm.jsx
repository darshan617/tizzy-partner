import React, { useEffect, useState } from "react";
import { BiChevronDown, BiX } from "react-icons/bi";
import styles from "./CreateNewTicketForm.module.css";
import {
  useAddTicketMutation,
  useDetailsForSupportMutation,
  useGetOrdersByPartnerMutation,
} from "@/redux/apis/supportTicketsApi";
import { GrAttachment } from "react-icons/gr";
import Image from "next/image";
import Cookies from "js-cookie";
import CustomDropdown from "@/common-components/custom-dropdown/CustomDropdown";
import { useToast } from "@/custom-hooks/toast/ToastProvider";
import { useGetAllCustomersQuery } from "@/redux/apis/customerApi";
import { useRouter } from "next/router";

const MAX_DESCRIPTION_LENGTH = 200;
const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_TOTAL_ATTACHMENTS_MB = 5;
const MAX_TOTAL_ATTACHMENTS_BYTES = MAX_TOTAL_ATTACHMENTS_MB * 1024 * 1024;
const priorityOptions = ["Low", "Medium", "High"];

const initialFormData = {
  partner_id: "",
  customer_id: "",
  provider_id: "",
  cc_emails: [],
  domain: "",
  service: "",
  subject: "",
  priority: "",
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

const toPlanOptions = (list) =>
  (Array.isArray(list) ? list : [])
    .map((plan) => ({
      label: plan?.plan_name,
      value: plan?.plan_id,
      domains: plan?.domains,
      order_id: plan?.order_id,
    }))
    .filter((plan) => plan.label);

const toDomainOptions = (list) =>
  (Array.isArray(list) ? list : [])
    .map((domain) => ({
      label: domain?.domain_name || domain?.domain,
      value: domain?.domain_name || domain?.domain,
      order_id: domain?.order_id,
    }))
    .filter((domain) => domain.label);

const CreateNewTicketForm = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [formData, setFormData] = useState(initialFormData);
  const [ccEmailInput, setCcEmailInput] = useState("");
  const [errors, setErrors] = useState({});
  const [optionsList, setOptionsList] = useState({
    serviceDdList: [],
    domainDdList: [],
    providerDdList: [],
  });
  const [selectedId, setSelectedId] = useState({
    customer: null,
    provider: null,
  });
  const [planId, setPlanId] = useState("");
  const [orderId, setOrderId] = useState("");

  const userData = Cookies.get("userData")
    ? JSON.parse(Cookies.get("userData"))
    : {};
  const [addTicket, { isLoading: isAddingTicket }] = useAddTicketMutation();
  const [getOrdersByPartner, { isLoading: isGettingOrders }] =
    useGetOrdersByPartnerMutation();
  const [detailsForSupport, { isLoading }] = useDetailsForSupportMutation();
  const {
    data: allCustomers,
    isFetching: isFetchingAllCustomers,
    refetch,
  } = useGetAllCustomersQuery({
    partner_id: userData?.id,
    page_no: 1,
    per_page: 100,
  });
  const remainingCharacters =
    MAX_DESCRIPTION_LENGTH - formData.description.length;

  const getTicketDetails = async () => {
    try {
      const res = await detailsForSupport({
        body: {
          customer_id: selectedId?.customer,
          partner_id: userData?.id,
        },
      });
      if (res?.data?.success) {
        console.log(res?.data);

        setOptionsList((prev) => ({
          ...prev,
          providerDdList: Array.isArray(res?.data?.data?.providers)
            ? res.data.data.providers
            : [],
          serviceDdList: [],
          domainDdList: [],
        }));
      } else {
        console.log(res?.error?.message);
      }
    } catch (error) {
      console.log(error, "getTicketDetails ");
    }
  };

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

      const existingAttachments = Array.isArray(formData?.attachments)
        ? formData.attachments
        : [];
      const nextAttachments = [...existingAttachments, ...selectedFiles];
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

    if (!formData.customer_id) {
      newErrors.customer_id = "Customer is required";
    }

    if (!formData.provider_id) {
      newErrors.provider_id = "Provider is required";
    }

    if (!formData.domain) {
      newErrors.domain = "Domain is required";
    }

    if (!formData.service) {
      newErrors.service = "Service is required";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.priority) {
      newErrors.priority = "Priority is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    const pendingCcEmail = ccEmailInput.trim();
    if (!formData.cc_emails.length) {
      newErrors.cc_emails = pendingCcEmail
        ? "Click Add to include this email"
        : "At least one CC email is required";
    } else if (pendingCcEmail) {
      const isValidCcEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pendingCcEmail);

      if (!isValidCcEmail) {
        newErrors.cc_emails = "Enter a valid email address or click Add";
      } else if (formData.cc_emails.includes(pendingCcEmail)) {
        newErrors.cc_emails = "This email has already been added";
      } else {
        newErrors.cc_emails = "Click Add to include this email";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleServiceChange = (option) => {
    console.log(option);

    setFormData((prev) => ({
      ...prev,
      service: option?.label || "",
      domain: "",
    }));
    setOptionsList((prev) => ({
      ...prev,
      domainDdList: toDomainOptions(option?.domains),
    }));
    setErrors((prev) => ({
      ...prev,
      service: "",
    }));
    setPlanId(option?.value || "");
    setOrderId("");
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

  const handleAddCcEmail = () => {
    const email = ccEmailInput.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValidEmail) {
      setErrors((prev) => ({
        ...prev,
        cc_emails: "Enter a valid email address",
      }));
      return;
    }

    if (formData.cc_emails.includes(email)) {
      setErrors((prev) => ({
        ...prev,
        cc_emails: "This email has already been added",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      cc_emails: [...prev.cc_emails, email],
    }));
    setCcEmailInput("");
    setErrors((prev) => ({
      ...prev,
      cc_emails: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    try {
      const { attachments, ...fields } = formData;
      const body = new FormData();

      Object.entries(fields).forEach(([key, value]) => {
        if (key === "cc_emails" && Array.isArray(value)) {
          value.forEach((email) => body.append("cc_emails[]", email));
        } else if (key === "partner_id") {
          body.set(key, String(userData?.id ?? ""));
        } else if (key === "provider_id") {
          body.set(key, String(selectedId?.provider));
        } else {
          body.append(key, value ?? "");
        }
      });
      body.set("plan_id", String(planId ?? ""));
      body.set("order_id", String(orderId ?? ""));
      (Array.isArray(attachments) ? attachments : []).forEach((file) => {
        body.append("attachments[]", file);
      });

      const res = await addTicket({ body });
      if (res?.data?.success) {
        showToast(res?.data?.message, "success");
        setFormData(initialFormData);
        setCcEmailInput("");
        router?.push("/support");
        return;
      } else {
        console.log(res?.error);
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
      console.log(error);
    }
  };

  const handleSearchOrders = async () => {
    try {
      const res = await getOrdersByPartner({
        body: { partner_id: userData.id, order_no: formData.orderId },
      });

      if (res?.data?.success) {
        const planOptions = toServiceOptions(res?.data?.data?.plan_list);
        setOptionsList((prev) => ({
          ...prev,
          serviceDdList: planOptions,
        }));
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
    if (selectedId?.customer) {
      getTicketDetails();
    }
  }, [selectedId?.customer]);

  return (
    <div className={styles.wrapper}>
      <div className={`sectionCard ${styles.formCard}`}>
        <form onSubmit={handleSubmit} noValidate>
          <h2 className={`${styles.sectionTitle} sectionCardHead`}>
            Customer Details
          </h2>

          {/* <div className={styles.grid}>
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
          </div> */}
          <div className={styles.grid}>
            <div className={styles.formGroup}>
              <div className={styles.selectWrap}>
                <CustomDropdown
                  label="Select Customer"
                  options={allCustomers?.data?.customers?.map((customer) => ({
                    label: customer?.name,
                    value: customer?.id,
                  }))}
                  onChange={(option) => {
                    setFormData((prev) => ({
                      ...prev,
                      customer_id: option?.value || null,
                    }));

                    setSelectedId({
                      customer: option?.value || null,
                      provider: null,
                    });
                    setOptionsList({
                      serviceDdList: [],
                      domainDdList: [],
                      providerDdList: [],
                    });
                    setCcEmailInput("");
                    setPlanId("");
                    setOrderId("");
                    setErrors((prev) => ({
                      ...prev,
                      customer_id: "",
                      provider_id: "",
                      service: "",
                      domain: "",
                    }));
                  }}
                  value={formData.customer_id}
                  placeholder="Select Customer"
                  isSearchable={true}
                  customHeight="39px"
                />
                {errors.customer_id && (
                  <p className={styles.error}>{errors.customer_id}</p>
                )}
              </div>
            </div>
            <div className={styles.formGroup}>
              <div className={styles.selectWrap}>
                <CustomDropdown
                  label="Select Provider"
                  options={(Array.isArray(optionsList?.providerDdList)
                    ? optionsList.providerDdList
                    : []
                  ).map((customer) => ({
                    label: customer?.provider_name,
                    value: customer?.provider_id,
                    plans: customer?.plans,
                  }))}
                  onChange={(option) => {
                    setFormData((prev) => ({
                      ...prev,
                      provider_id: option?.value || "",
                      service: "",
                      domain: "",
                    }));

                    setSelectedId((prev) => ({
                      ...prev,
                      provider: option?.value || null,
                    }));
                    setOptionsList((prev) => ({
                      ...prev,
                      serviceDdList: toPlanOptions(option?.plans),
                      domainDdList: [],
                    }));
                    setPlanId("");
                    setOrderId("");
                    setErrors((prev) => ({
                      ...prev,
                      provider_id: "",
                      service: "",
                      domain: "",
                    }));
                  }}
                  value={formData.provider_id}
                  placeholder="Select Provider"
                  isSearchable={true}
                  customHeight="39px"
                />
                {errors.provider_id && (
                  <p className={styles.error}>{errors.provider_id}</p>
                )}
              </div>
            </div>
          </div>

          <div className={styles.grid}>
            <div className={styles.formGroup}>
              <div className={styles.selectWrap}>
                <CustomDropdown
                  label="Service"
                  options={optionsList?.serviceDdList}
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
            <div className={styles.formGroup}>
              <div className={styles.selectWrap}>
                <CustomDropdown
                  label="Domain"
                  options={optionsList?.domainDdList}
                  onChange={(option) => {
                    setFormData((prev) => ({
                      ...prev,
                      domain: option?.label || "",
                    }));
                    setOrderId(option?.order_id || "");
                    setErrors((prev) => ({
                      ...prev,
                      domain: "",
                    }));
                  }}
                  value={formData.domain}
                  placeholder="Select Domain"
                  isSearchable={true}
                  customHeight="39px"
                />
              </div>
              {errors?.domain && (
                <p className={styles.error}>{errors?.domain}</p>
              )}
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

          <div className={styles.grid}>
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

            <div className={`${styles.formGroup}`}>
              <label className={styles.label} htmlFor="ticket-cc-email">
                Add CC<span className={styles.required}>*</span>
              </label>
              <div className="d-flex gap-2">
                <input
                  id="ticket-cc-email"
                  type="email"
                  value={ccEmailInput}
                  onChange={(event) => {
                    setCcEmailInput(event.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      cc_emails: "",
                    }));
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleAddCcEmail();
                    }
                  }}
                  className="form-control"
                  placeholder="Enter email address"
                />
                <button
                  type="button"
                  className={styles.attachmentsBtn}
                  onClick={handleAddCcEmail}
                >
                  Add
                </button>
              </div>
              {errors?.cc_emails && (
                <p className={styles.error}>{errors?.cc_emails}</p>
              )}
              {formData?.cc_emails.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {formData?.cc_emails?.map((email) => (
                    <span key={email} className="badge text-bg-light fs-6">
                      {email}
                      <button
                        type="button"
                        className="border-0 bg-transparent ms-1"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            cc_emails: prev.cc_emails?.filter(
                              (item) => item !== email,
                            ),
                          }))
                        }
                        aria-label={`Remove ${email}`}
                      >
                        <BiX />
                      </button>
                    </span>
                  ))}
                </div>
              )}
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
