import CustomerForm from "@/components/customers/customer-form/CustomerForm";
import Layout from "@/components/layout/Layout";
import { useGetSpecificCustomerDetailsQuery } from "@/redux/apis/customerApi";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React from "react";
import styles from "@/components/customers/customer-form/CustomerForm.module.css";
import { BsArrowLeft } from "react-icons/bs";
import Link from "next/link";

const EditCustomer = () => {
  const router = useRouter();
  const userData = Cookies.get("userData")
    ? JSON.parse(decodeURIComponent(Cookies.get("userData")))
    : {};
  const { data: customerDetailsData } = useGetSpecificCustomerDetailsQuery(
    {
      customer_id: router?.query?.customerId,
      partner_id: userData?.id,
    },
    {
      skip: !router?.isReady || !router?.query?.customerId || !userData?.id,
    },
  );
  return (
    <Layout>
      <div className={styles.headerRow}>
        <nav className="breadcrumb mb-0">
          <Link href="/dashboard" className="breadcrumb-item">
            Dashboard
          </Link>
          <Link href="/customers" className="breadcrumb-item">
            Customers
          </Link>
          <h1 className="breadcrumb-item active" aria-current="page">
            Edit Customer
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
      <CustomerForm
        type="edit"
        customerDetails={customerDetailsData?.data?.customer}
      />
    </Layout>
  );
};

export default EditCustomer;
