import React from "react";
import { Plus } from "lucide-react";
import styles from "@/components/customers/renew-plans/customer-detail-form/CustomerDetailForm.module.css";

const CustomerDetailForm = () => {
    return (
        <section className={styles.card}>
            <div className={styles.cardHeader}>
                <h2 className={styles.title}>CUSTOMER DETAILS</h2>
                <a href="#" className="btn small btnDefault">
                        <Plus className="icon me-0" />
                        <span>New Customer</span>
                    </a>
            </div>

            <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                        Company Name <span className={styles.required}>*</span>
                    </label>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="Enter Company Name"
                    />
                </div>

                <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                        Domain <span className={styles.required}>*</span>
                    </label>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="Enter Domain Name"
                    />
                </div>
            </div>
        </section>
    );
};

export default CustomerDetailForm;
