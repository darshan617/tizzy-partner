import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { BsArrowLeft } from "react-icons/bs";
import Layout from "@/components/layout/Layout";
import CreateNewTicketForm from "@/components/support-details/create-new-ticket/CreateNewTicketForm";
import styles from "@/components/support-details/create-new-ticket/CreateNewTicketForm.module.css";

const CreateNewTicket = () => {
  const router = useRouter();

  return (
    <Layout>
      <div className={styles.headerRow}>
        <nav className="breadcrumb mb-0">
          <Link href="/dashboard" className="breadcrumb-item">
            Dashboard
          </Link>
          <Link href="/support" className="breadcrumb-item">
            Support
          </Link>
          <h1 className="breadcrumb-item active" aria-current="page">
            Create New Ticket
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
      <CreateNewTicketForm />
    </Layout>
  );
};

export default CreateNewTicket;
