import SummaryCounts from "@/common-components/summary-counts/SummaryCounts";
import Layout from "@/components/layout/Layout";
import AllInvoice from "@/components/invoice/AllInvoice";
import { useGetInvoiceDetailsMutation } from "@/redux/apis/invoiceApi";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";

const Invoice = () => {
  const userData = Cookies?.get("userData")
    ? JSON.parse(decodeURIComponent(Cookies?.get("userData")))
    : {};

  const [invoiceDetailsData, setInvoiceDetailsData] = useState(null);

  const [getInvoiceDetails, { isLoading: isInvoiceDataLoading }] =
    useGetInvoiceDetailsMutation();

  const fetchInvoiceData = async () => {
    try {
      const res = await getInvoiceDetails({
        body: {
          partner_id: userData?.id,
        },
      });

      if (res?.data?.success) {
        setInvoiceDetailsData(res?.data?.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchInvoiceData();
  }, []);

  const totalInvoices =
    invoiceDetailsData?.total_count ??
    invoiceDetailsData?.invoice_data?.length ??
    0;

  return (
    <Layout>
      <SummaryCounts
        infoBtn={{
          title: "Credit Balance",
          amount: ` ${invoiceDetailsData?.credit_balance}`,
          info: "Pay your unpaid invoices to restore your credit balance.",
        }}
        countData={invoiceDetailsData?.summary}
        isFetchingCountData={isInvoiceDataLoading}
      />

      <AllInvoice
        invoiceData={invoiceDetailsData?.invoice_data}
        isInvoiceDataLoading={isInvoiceDataLoading}
        totalCount={totalInvoices}
      />
    </Layout>
  );
};

export default Invoice;
