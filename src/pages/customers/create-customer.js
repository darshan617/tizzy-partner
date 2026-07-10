import CustomerForm from "@/components/customers/customer-form/CustomerForm";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import styles from "@/components/customers/customer-form/CustomerForm.module.css";
import { BsArrowLeft } from "react-icons/bs";

const CreateCustomer = () => {
  const router = useRouter();
  return (
    <Layout>
      <div className={styles.headerRow}>
        <nav className={`${styles.breadcrumbs} mb-0`}>
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
        <button
          className={styles.backBtn}
          onClick={() => router.back()}
          type="button"
        >
          <BsArrowLeft /> Back
        </button>
      </div>
      <CustomerForm type="create" />
    </Layout>
  );
};

export default CreateCustomer;
