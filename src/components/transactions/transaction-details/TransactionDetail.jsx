"use client";

import { useState } from "react";
import styles from "@/components/transactions/transaction-details/TransactionDetail.module.css";
import { CiUser } from "react-icons/ci";
import { IoMdArrowBack } from "react-icons/io";
import { BsDownload } from "react-icons/bs";
import { LuLayers } from "react-icons/lu";
import { BsBox } from "react-icons/bs";
import { RiGlobalLine } from "react-icons/ri";
import { FiUsers } from "react-icons/fi";
import { GrPowerCycle } from "react-icons/gr";
import { CiReceipt } from "react-icons/ci";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import Link from "next/link";



const subscriptions = [
  {
    id: 1,
    name: "Tizzy® Mail Enterprise 100 GB",
    price: "₹2850",
    unit: "Per User / Per Year",
    status: "Active",
    orderId: "ORD-00097",
    domain: "kingstonmarketing.net",
    users: "38 Users",
    date: "20 Oct 2025",
  },
  {
    id: 2,
    name: "Tizzy® Mail Enterprise 100 GB",
    price: "₹2850",
    unit: "Per User / Per Year",
    status: "Active",
    orderId: "ORD-00097",
    domain: "kingstonmarketing.net",
    users: "38 Users",
    date: "20 Oct 2025",
  },
  {
    id: 3,
    name: "Tizzy® Mail Enterprise 100 GB",
    price: "₹2850",
    unit: "Per User / Per Year",
    status: "Active",
    orderId: "ORD-00097",
    domain: "kingstonmarketing.net",
    users: "38 Users",
    date: "20 Oct 2025",
  },
];

export default function TransactionDetails() {
  const [activeTab, setActiveTab] = useState("po");

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className={styles.pageTitle}>Transaction Details</h5>
          <Link href="/transactions" className={styles.backBtn} type="button">
            <IoMdArrowBack /> Back
          </Link>
        </div>

        <div className="row">
          {/* LEFT COLUMN */}
          <div className="col-12 col-lg-8">
            {/* Customer Info Card */}
            <div className={`${styles.card} mb-3`}>
              <div className="d-flex flex-wrap justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <div className={styles.avatar}>N</div>
                  <div className="ms-3">
                    <div className={styles.companyName}>
                      Nexora Technologies Pvt. Ltd.
                    </div>
                    <div className="d-flex align-items-center gap-2 mt-1">
                      <span className={styles.customerIdBadge}>
                        Customer Id : 00024
                      </span>
                      <span className={styles.contactPerson}>
                        <CiUser /> Wilson Thomas
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.infoBlock}>
                  <div className={styles.infoLabel}>Email</div>
                  <div className={styles.infoValue}>vikasgoyal@gmail.com</div>
                </div>

                <div className={styles.infoBlock}>
                  <div className={styles.infoLabel}>Contact No.</div>
                  <div className={styles.infoValue}>+91 981234 56780</div>
                </div>
              </div>
            </div>

            <div className={`${styles.card} mb-3`}>
              <div className={styles.cardHeaderRow}>
                <span className={styles.cardHeaderTitle}>
                  Payment &amp; Billing
                </span>
                <a href="#" className={styles.invoiceLink}>
                  <BsDownload /> Invoice
                </a>
              </div>

              <div className={styles.divider} />

              <div className="row gy-3">
                <DetailRow label="Invoice Number:" value="INV00097" />
                <DetailRow label="Invoice Date:" value="23 May 2026" />
                <DetailRow label="Transaction Date" value="21 Jul 2026" />
                <DetailRow label="Transaction ID:" value="TXN00097" />
                <DetailRow label="UTR:" value="TXNREF458921" />
                <DetailRow
                  label="Payment Status"
                  value="Paid"
                  valueClass={styles.paidStatus}
                />
              </div>
            </div>

            {/* Subscription Details */}
            <div className={styles.card}>
              <div className={styles.cardHeaderRow}>
                <span className={styles.cardHeaderTitle}>
                  <LuLayers /> Subscription Details
                </span>
              </div>

              <div className={styles.divider} />

              <div className={styles.domainContainer}>
                <div className={styles.domainCard}>
                    <div className={styles.domainName}>
                        <RiGlobalLine className={styles.domainIcon} /> <span className={styles.domainNameText}>fff.com.onmicrosoft.com</span>
                    </div>
                    <div className={styles.domainId}>
                        <span className={styles.domainIdLabel}>Order ID:</span>
                        <span className={styles.domainIdValue}>ORD00123</span>
                    </div>
                </div>
              </div>

              {subscriptions.map((sub) => (
                <div key={sub.id} className={styles.subCard}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="d-flex">
                      <div className={styles.subIcon}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="400"
                          height="400"
                          viewBox="0 0 400 400"
                          class="icon"
                        >
                          <path
                            fill="#34a853"
                            d="M49,59s86.637-1.833,172,99L282,21,350,9V20s-36.234-2.265-53,43L144,391l-14-39,80-172S164.162,106.238,49,69V59Z"
                          ></path>
                        </svg>
                      </div>
                      <div className="ms-2">
                        <div className={styles.subName}>{sub.name}</div>
                        <div className={styles.subPrice}>
                          {sub.price}{" "}
                          <span className={styles.subUnit}>{sub.unit}</span>
                        </div>
                      </div>
                    </div>
                    <span className={styles.activeBadge}>{sub.status}</span>
                  </div>

                  <div className={styles.subMetaRow}>
                    <span className={styles.subMetaItem}>
                      <BsBox size={20} className={styles.subMetaIcon} />{" "}
                      {sub.orderId}
                    </span>
                    <span className={styles.subMetaItem}>
                      <RiGlobalLine size={20} className={styles.subMetaIcon} />{" "}
                      {sub.domain}
                    </span>
                    <span className={styles.subMetaItem}>
                      <FiUsers size={20} className={styles.subMetaIcon} />{" "}
                      {sub.users}
                    </span>
                    <span className={styles.subMetaItem}>
                      <GrPowerCycle size={20} className={styles.subMetaIcon} />{" "}
                      {sub.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="col-12 col-lg-4">
            {/* Order Summary */}
            <div className={`${styles.card} mb-3`}>
              <div className={styles.cardHeaderRow}>
                <span className={styles.cardHeaderTitle}>
                  <BsBox /> Order Summary
                </span>
              </div>
              <div className={styles.divider} />

              <SummaryRow label="Order ID" value="ORD00039" />
              <SummaryRow label="Enrollment Type" value="New Service" />
              <SummaryRow
                label="Amount Paid"
                value="₹2649.10"
                valueClass={styles.amountHighlight}
              />
            </div>

            {/* Payment Breakdown */}
            <div className={`${styles.card} mb-3`}>
              <div className={styles.cardHeaderRow}>
                <span className={styles.cardHeaderTitle}>
                  <CiReceipt size={20} /> Payment Breakdown
                </span>
              </div>
              <div className={styles.divider} />

              <SummaryRow label="Service Amount" value="₹2,245.00" />
              <SummaryRow label="CGST (9%)" value="₹202.05" />
              <SummaryRow label="SGST (9%)" value="₹202.05" />
              <SummaryRow label="Discount:" value="₹0.00" />
              <div className={styles.divider} />
              <SummaryRow
                label="Total Amount"
                value="₹2649.10"
                bold
                valueClass={styles.amountHighlight}
              />
            </div>

            {/* Invoice & E-Invoice Details */}
            <div className={styles.card}>
              <div className={styles.cardHeaderRow}>
                <span className={styles.cardHeaderTitle}>
                  <LiaFileInvoiceSolid size={20} /> Invoice &amp; E-Invoice
                  Details
                </span>
                <a href="#" className={styles.invoiceLink}>
                  <BsDownload /> Invoice
                </a>
              </div>

              <div className={styles.divider} />

              {/* Tabs */}
              <div className={styles.tabGroup}>
                <button
                  type="button"
                  className={`${styles.tabBtn} ${
                    activeTab === "po" ? styles.tabBtnActive : ""
                  }`}
                  onClick={() => setActiveTab("po")}
                >
                  PO
                </button>
                <button
                  type="button"
                  className={`${styles.tabBtn} ${
                    activeTab === "einvoice" ? styles.tabBtnActive : ""
                  }`}
                  onClick={() => setActiveTab("einvoice")}
                >
                  E-Invoice
                </button>
              </div>

              {activeTab === "po" ? (
                <div className="mt-3">
                  <SummaryRow label="PO Number:" value="PO-2026-00458" />
                  <SummaryRow label="PO Date:" value="20 May 2026" />
                  <SummaryRow label="PO Amount:" value="₹2,649.10" />
                  <SummaryRow label="Approval Date:" value="21 May 2026" />
                </div>
              ) : (
                <div className="mt-3">
                  <div className="mt-3">
                  <SummaryRow label="E-Invoice Status:" value="Generated" />
                  <SummaryRow label="IRN:" value="7f3c9a2e8b1d4f6a..." />
                  <SummaryRow label="Acknowledgement No.:" value="122612345678901" />
                  <SummaryRow label="Acknowledgement Date:" value="23-May-2026" />
                  <SummaryRow label="QR Code:" value= "View / Download" valueClass={styles.qrCodeLink} />

                </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, valueClass = "" }) {
  return (
    <div className="col-6 col-md-4">
      <div className={styles.infoLabel}>{label}</div>
      <div className={`${styles.infoValue} ${valueClass}`}>{value}</div>
    </div>
  );
}

function SummaryRow({ label, value, valueClass = "", bold = false }) {
  return (
    <div className={styles.summaryRow}>
      <span
        className={`${styles.summaryLabel} ${bold ? styles.summaryBold : ""}`}
      >
        {label}
      </span>
      <span
        className={`${styles.summaryValue} ${
          bold ? styles.summaryBold : ""
        } ${valueClass}`}
      >
        {value}
      </span>
    </div>
  );
}
