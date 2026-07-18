import React from "react";
import Layout from "../../components/layout/Layout";
import TicketDetail from "@/components/ticket-detail/TicketDetail";
import styles from "@/components/ticket-detail/TicketDetail.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { BsArrowLeft } from "react-icons/bs";

const TicketDetailsPage = () => {
  const router = useRouter();

  return (
    <Layout>
      <div className={styles.headerRow}>
        <nav className="breadcrumb mb-0">
          <Link href="/dashboard" className="breadcrumb-item">
            Dashboard
          </Link>
          <Link href="/support" className="breadcrumb-item">
            Support Tickets
          </Link>
          <Link href="/ticket-detail" className="breadcrumb-item">
            #SUP-2523
          </Link>
          <h1 className="breadcrumb-item active mt-2" aria-current="page">
            Ticket Details
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
      <TicketDetail />
    </Layout>
  );
};

export default TicketDetailsPage;
