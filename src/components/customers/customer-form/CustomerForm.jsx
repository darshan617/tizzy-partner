import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "@/components/customers/customer-form/CustomerForm.module.css";
import { BsArrowLeft } from "react-icons/bs";
import { useSearchGstinMutation } from "@/redux/apis/signupApi";
import { useCreateCustomerMutation } from "@/redux/apis/customerApi";
import Cookies from "js-cookie";
import { useToast } from "@/custom-hooks/toast/ToastProvider";

const initialFormData = {
  name: "",
  email: "",
  mobile: "",
  gstin: "",
  company_name: "",
  company_address: "",
  country: "",
  state: "",
  city: "",
  pincode: "",
  pan_no: "",
  constitution: "",
  gst_status: "",
  last_updated: "",
  legal_name: "",
  nature_of_business: [],
  registration_date: "",
  trade_name: "",
};

const CustomerForm = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [searchGstin, { isLoading: isSearchingGstin }] = useSearchGstinMutation();
  const [createCustomer, { isLoading: isCreatingCustomer }] = useCreateCustomerMutation();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isGstinVerified, setIsGstinVerified] = useState(false);
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData?.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData?.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData?.mobile?.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData?.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }

    if (!formData?.gstin?.trim()) {
      newErrors.gstin = "GSTIN is required";
    } else if (
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
        formData?.gstin?.toUpperCase(),
      )
    ) {
      newErrors.gstin = "Invalid GSTIN format";
    }

    // if (!formData?.company_name?.trim()) {
    //   newErrors.company_name = "Company name is required";
    // }

    // if (!formData?.company_address?.trim()) {
    //   newErrors.company_address = "Company address is required";
    // }

    // if (!formData?.country?.trim()) {
    //   newErrors.country = "Country is required";
    // }

    // if (!formData?.state?.trim()) {
    //   newErrors.state = "State is required";
    // }

    // if (!formData?.city?.trim()) {
    //   newErrors.city = "City is required";
    // }

    // if (!formData?.pincode?.trim()) {
    //   newErrors.pincode = "Pin code is required";
    // } else if (!/^\d{6}$/.test(formData?.pincode)) {
    //   newErrors.pincode = "Pin code must be 6 digits";
    // }

    // if (!formData?.pan_no?.trim()) {
    //   newErrors.pan_no = "Company PAN is required";
    // } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData?.pan_no?.toUpperCase())) {
    //   newErrors.pan_no = "Invalid PAN format";
    // }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "gstin") {
      setIsGstinVerified(false);
    }

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleGstinBlur = async () => {
    const gstin = formData?.gstin?.toUpperCase().trim();

    if (!gstin) {
      setIsGstinVerified(false);
      setErrors((prev) => ({
        ...prev,
        gstin: "GSTIN is required",
      }));
      return;
    }

    if (!gstinRegex.test(gstin)) {
      setIsGstinVerified(false);
      setErrors((prev) => ({
        ...prev,
        gstin: "Invalid GSTIN format",
      }));
      return;
    }

    setErrors((prev) => ({
      ...prev,
      gstin: "",
    }));

    try {
      const res = await searchGstin({ body: { gstin } });

      if (res?.data?.success) {
        const data = res?.data?.data || {};
        setIsGstinVerified(true);
        setFormData((prev) => ({
          ...prev,
          gstin,
          company_name: data?.company_name || "",
          company_address: data?.company_address || "",
          country: data?.country || "",
          state: data?.state || "",
          city: data?.city || "",
          pincode: data?.pincode || "",
          pan_no: data?.pan_no || "",
          constitution: data?.constitution || "",
          gst_status: data?.gst_status || "",
          last_updated: data?.last_updated || "",
          legal_name: data?.legal_name || "",
          nature_of_business: data?.nature_of_business || "",
          registration_date: data?.registration_date || "",
          trade_name: data?.trade_name || "",
        }));
      } else {
        setIsGstinVerified(false);
        setErrors((prev) => ({
          ...prev,
          gstin: "GSTIN not found",
        }));
      }
    } catch (error) {
      setIsGstinVerified(false);
      setErrors((prev) => ({
        ...prev,
        gstin: "Error validating GSTIN",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    try {
      const userCookie = Cookies.get("userData");
      const userData = userCookie ? JSON.parse(userCookie) : {};

      const payload = {
        city: formData?.city,
        company_address: formData?.company_address,
        company_name: formData?.company_name,
        constitution: formData?.constitution,
        country: formData?.country,
        email: formData?.email,
        gst_status: formData?.gst_status,
        gstin: formData?.gstin?.toUpperCase(),
        last_updated: formData?.last_updated,
        legal_name: formData?.legal_name,
        mobile: formData?.mobile,
        name: formData?.name,
        nature_of_business: formData?.nature_of_business,
        pan_no: formData?.pan_no?.toUpperCase(),
        partner_id: String(userData?.id || ""),
        registration_date: formData?.registration_date,
        state: formData?.state,
        trade_name: formData?.trade_name,
        zip_code: formData?.pincode,
      };

      const res = await createCustomer({
        body: payload,
      });

      if (res?.data?.success) {
        setIsGstinVerified(false);
        setFormData(initialFormData);
        showToast(res?.data?.message  || "Customer created successfully", "success");
        router.push("/customers");
      }
    } catch (error) {
      console.log("error", error);
    }
  };


  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <nav className="breadcrumb mb-0">
          <Link href="/dashboard" className="breadcrumb-item">
            Dashboard
          </Link>
          <Link href="/customers" className="breadcrumb-item">
            Customers
          </Link>
          <h1 className="breadcrumb-item active" aria-current="page">
            Add New Customer
          </h1>
        </nav>
        <button className={styles.backBtn} onClick={() => router.back()} type="button">
          <BsArrowLeft/> Back
        </button>
      </div>

      <div className={`sectionCard ${styles.formCard}`}>
        <form onSubmit={handleSubmit} noValidate>
          <h2 className={`${styles.sectionTitle} sectionCardHead`}>Company Details</h2>

          <div className={styles.grid}>
            <div className={`${styles.formGroup} ${styles.fullWidthLeft}`}>
              <label className={styles.label}>
                GSTIN<span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="gstin"
                value={formData.gstin}
                onChange={handleChange}
                onBlur={handleGstinBlur}
                className={`form-control`}
              />
              {isSearchingGstin && (
                <span className={styles.infoMessage}>Searching GSTIN...</span>
              )}
              {errors.gstin && <span className={styles.errorMessage}>{errors.gstin}</span>}
            </div>
          </div>
          {isGstinVerified && (
            <>
              <div className={styles.grid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Company Name<span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    className="form-control"
                    readOnly
                    style={{ backgroundColor: "#f5f5f5" }}
                  />
                  {errors.company_name && (
                    <span className={styles.errorMessage}>{errors.company_name}</span>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Company Address<span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="company_address"
                    value={formData.company_address}
                    onChange={handleChange}
                    className="form-control"
                    readOnly
                    style={{ backgroundColor: "#f5f5f5" }}
                  />
                  {errors.company_address && (
                    <span className={styles.errorMessage}>{errors.company_address}</span>
                  )}
                </div>
              </div>

              <div className={styles.grid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Country<span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="form-control"
                    readOnly
                    style={{ backgroundColor: "#f5f5f5" }}
                  />
                  {errors.country && (
                    <span className={styles.errorMessage}>{errors.country}</span>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    State<span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="form-control"
                    readOnly
                    style={{ backgroundColor: "#f5f5f5" }}
                  />
                  {errors.state && <span className={styles.errorMessage}>{errors.state}</span>}
                </div>
              </div>

              <div className={styles.grid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    City<span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="form-control"   
                    readOnly
                    style={{ backgroundColor: "#f5f5f5" }}
                  />
                  {errors.city && <span className={styles.errorMessage}>{errors.city}</span>}
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Pin Code<span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={handleChange}
                    className="form-control"
                    readOnly
                    style={{ backgroundColor: "#f5f5f5" }}
                  />    
                  {errors.pincode && (
                    <span className={styles.errorMessage}>{errors.pincode}</span>
                  )}
                </div>
              </div>

              <div className={styles.grid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Company PAN No.<span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="pan_no"
                    value={formData.pan_no}
                    onChange={handleChange}
                    className="form-control"
                    readOnly
                    style={{ backgroundColor: "#f5f5f5" }}
                  />
                  {errors.pan_no && <span className={styles.errorMessage}>{errors.pan_no}</span>}
                </div>
              </div>
            </>
          )}

          <h2 className={`${styles.sectionTitle} sectionCardHead`}>Contact Details</h2>

          <div className={styles.grid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Name<span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
              />
              {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Email<span className={styles.required}>*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
              />
              {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
            </div>
          </div>

          <div className={styles.grid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Mobile No.<span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="mobile"
                maxLength={10}
                value={formData.mobile}
                onChange={handleChange}
                className="form-control"
              />
              {errors.mobile && <span className={styles.errorMessage}>{errors.mobile}</span>}
            </div>
          </div>

          <div className={styles.submitWrap}>
            <button type="submit" className={styles.submitBtn}>
              {isCreatingCustomer ? "Creating..." : "Create Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;