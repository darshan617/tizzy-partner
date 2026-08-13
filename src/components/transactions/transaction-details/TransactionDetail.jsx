"use client";

import { useEffect, useState } from "react";
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
import { useGetTransactionDetailsMutation } from "@/redux/apis/transactionsApi";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Loader from "@/common-components/loader/Loader";
import { BiChevronRight } from "react-icons/bi";

export default function TransactionDetails() {
  const [activeTab, setActiveTab] = useState("po");
  const router = useRouter();
  const [getTransactionDetails, { isLoading: isLoadingTransactionDetails }] =
    useGetTransactionDetailsMutation();
  const userData = Cookies.get("userData")
    ? JSON.parse(Cookies.get("userData"))
    : null;
  const [transactionData, setTransactionData] = useState(null);
  console.log(transactionData, "transactionData");
  console.log(userData, "userData");
  console.log(router?.query?.order_id, "order_id");
  const transactionDetails = async () => {
    try {
      const response = await getTransactionDetails({
        body: {
          partner_id: userData?.id,
          order_id: router?.query?.order_id,
        },
      });

      if (response?.data) {
        setTransactionData(response?.data?.data);
      } else {
        console.log(response?.error, "error in transaction details");
      }
    } catch (error) {
      console.log(error, "error in transaction details");
    }
  };
  useEffect(() => {
    if (router?.query?.order_id) {
      transactionDetails();
    }
  }, [router?.query?.order_id]);

  return (
    <div className={styles.page}>
      <div className="container px-0">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className={styles.pageTitle}>Transaction Details</h5>
          <Link href="/transactions" className={styles.backBtn} type="button">
            <IoMdArrowBack /> Back
          </Link>
        </div>
        {isLoadingTransactionDetails ? (
          <Loader />
        ) : (
          <div className="row">
            {/* LEFT COLUMN */}
            <div className="col-12 col-lg-8">
              {/* Customer Info Card */}

              <div className={`${styles.card} mb-3`}>
                <div className="d-flex flex-wrap justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div className={styles.avatar}>
                      {transactionData?.customer_information?.company_name?.charAt(
                        0,
                      )}
                    </div>
                    <div className="ms-3">
                      <div className={styles.companyName}>
                        {transactionData?.customer_information?.company_name}
                      </div>
                      <div className="d-flex align-items-center gap-2 mt-1">
                        <span className={styles.customerIdBadge}>
                          Customer Id :{" "}
                          {transactionData?.customer_information?.customer_id}
                        </span>
                        <span className={styles.contactPerson}>
                          <CiUser />{" "}
                          {transactionData?.customer_information?.contact_name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.infoBlock}>
                    <div className={styles.infoLabel}>Email</div>
                    <div className={styles.infoValue}>
                      {transactionData?.customer_information?.email || "-"}{" "}
                    </div>
                  </div>

                  <div className={styles.infoBlock}>
                    <div className={styles.infoLabel}>Contact No.</div>
                    <div className={styles.infoValue}>
                      {transactionData?.customer_information?.contact_no ||
                        "-"}{" "}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${styles.card} mb-3`}>
                <div className={styles.cardHeaderRow}>
                  <span className={styles.cardHeaderTitle}>
                    Payment &amp; Billing
                  </span>
                  <a
                    href={
                      transactionData?.payment_and_billing?.download_invoice_url
                    }
                    target="_blank"
                    className={styles.invoiceLink}
                  >
                    <BsDownload /> Invoice
                  </a>
                </div>

                <div className={styles.divider} />

                <div className="row gy-3">
                  <DetailRow
                    label="Invoice Number:"
                    value={
                      transactionData?.payment_and_billing?.invoice_number ||
                      "-"
                    }
                  />
                  <DetailRow
                    label="Invoice Date:"
                    value={
                      transactionData?.payment_and_billing?.invoice_date || "-"
                    }
                  />
                  <DetailRow
                    label="Transaction Date"
                    value={
                      transactionData?.payment_and_billing?.transaction_date ||
                      "-"
                    }
                  />
                  <DetailRow
                    label="Transaction ID:"
                    value={
                      transactionData?.payment_and_billing?.transaction_id ||
                      "-"
                    }
                  />
                  <DetailRow
                    label="UTR:"
                    value={transactionData?.payment_and_billing?.utr || "-"}
                  />
                  <DetailRow
                    label="Payment Status"
                    value={
                      transactionData?.payment_and_billing?.payment_status ||
                      "-"
                    }
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
                      <RiGlobalLine className={styles.domainIcon} />{" "}
                      <span className={styles.domainNameText}>
                        {transactionData?.subscription_details?.domain_name}
                      </span>
                    </div>
                    {/* <div className={styles.domainId}>
                      <span className={styles.domainIdLabel}>Order ID:</span>
                      <span className={styles.domainIdValue}>
                        {transactionData?.subscription_details?.order_id}
                      </span>
                    </div> */}
                  </div>
                </div>

                {transactionData?.subscription_details?.subscriptions?.map(
                  (sub) => (
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
                            <div className={styles.subName}>
                              {sub?.plan_name}
                            </div>
                            <div className={styles.subPrice}>
                              {sub.price_label}{" "}
                              <span className={styles.subUnit}>
                                {sub?.unit}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span
                          className={`${styles.activeBadge} ${styles[sub?.status?.toLowerCase()]}`}
                        >
                          {sub?.status}
                        </span>
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <div className={styles.subMetaRow}>
                          <span className={styles.subMetaItem}>
                            <LuLayers
                              size={20}
                              className={styles.subMetaIcon}
                            />{" "}
                            {sub?.subscription_no}
                          </span>
                          {/* <span className={styles.subMetaItem}>
                <RiGlobalLine size={20} className={styles.subMetaIcon} />{" "}
                {sub?.domain}
              </span> */}
                          <span className={styles.subMetaItem}>
                            <FiUsers size={20} className={styles.subMetaIcon} />{" "}
                            {sub?.users}
                          </span>
                          <span className={styles.subMetaItem}>
                            <GrPowerCycle
                              size={20}
                              className={styles.subMetaIcon}
                            />{" "}
                            {sub?.renewal_date}
                          </span>
                        </div>
                        <div>
                          <Link
                            href={{
                              pathname: `/plan-details`,
                              query: {
                                orderId: router?.query?.order_id,
                                planId: sub?.plan_id,
                              },
                            }}
                            className={styles.subActionBtnViewMore}
                          >
                            <BiChevronRight size={16} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ),
                )}
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

                <SummaryRow
                  label="Order ID"
                  value={transactionData?.order_summary?.order_id || "-"}
                />
                <SummaryRow
                  label="Enrollment Type"
                  value={transactionData?.order_summary?.enrollment_type || "-"}
                />
                <SummaryRow
                  label="Amount Paid"
                  value={`₹ ${Number(transactionData?.order_summary?.amount_paid || 0).toFixed(2) || "-"}`}
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

                <SummaryRow
                  label="Service Amount"
                  value={`₹ ${Number(transactionData?.payment_breakdown?.service_amount || 0).toFixed(2) || "-"}`}
                />
                <SummaryRow
                  label="CGST (9%)"
                  value={`₹ ${Number(transactionData?.payment_breakdown?.cgst || 0).toFixed(2) || "-"}`}
                />
                <SummaryRow
                  label="SGST (9%)"
                  value={`₹ ${Number(transactionData?.payment_breakdown?.sgst || 0).toFixed(2) || "-"}`}
                />
                <SummaryRow
                  label="Discount:"
                  value={`₹ ${Number(transactionData?.payment_breakdown?.discount || 0).toFixed(2) || "-"}`}
                />
                <div className={styles.divider} />
                <SummaryRow
                  label="Total Amount"
                  value={`₹ ${Number(transactionData?.payment_breakdown?.total_amount || 0).toFixed(2) || "-"}`}
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
                  <a
                    href={
                      transactionData?.invoice_and_einvoice
                        ?.download_invoice_url
                    }
                    target="_blank"
                    className={styles.invoiceLink}
                  >
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
                    {transactionData?.invoice_and_einvoice?.active_tab}
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
                    <SummaryRow
                      label="PO Number:"
                      value={
                        transactionData?.invoice_and_einvoice?.po?.po_number ||
                        "-"
                      }
                    />
                    <SummaryRow
                      label="PO Date:"
                      value={
                        transactionData?.invoice_and_einvoice?.po?.po_date ||
                        "-"
                      }
                    />
                    <SummaryRow
                      label="PO Amount:"
                      value={`₹ ${Number(transactionData?.invoice_and_einvoice?.po?.po_amount || 0).toFixed(2) || "-"}`}
                    />
                    <SummaryRow
                      label="Approval Date:"
                      value={
                        transactionData?.invoice_and_einvoice?.po
                          ?.approval_date || "-"
                      }
                    />
                  </div>
                ) : (
                  <div className="mt-3">
                    <div className="mt-3">
                      <SummaryRow
                        label="E-Invoice Status:"
                        value={
                          transactionData?.invoice_and_einvoice?.e_invoice
                            ?.status || "-"
                        }
                      />
                      <SummaryRow
                        label="IRN:"
                        value={
                          transactionData?.invoice_and_einvoice?.e_invoice
                            ?.irn || "-"
                        }
                      />
                      <SummaryRow
                        label="Acknowledgement No.:"
                        value={
                          transactionData?.invoice_and_einvoice?.e_invoice
                            ?.ack_no || "-"
                        }
                      />
                      <SummaryRow
                        label="Acknowledgement Date:"
                        value={
                          transactionData?.invoice_and_einvoice?.e_invoice
                            ?.invoice_date || "-"
                        }
                      />
                      {/* <SummaryRow
                        label="QR Code:"
                        value="View / Download"
                        valueClass={styles.qrCodeLink || "-"}
                      /> */}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
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
