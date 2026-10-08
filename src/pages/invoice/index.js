import SummaryCounts from "@/common-components/summary-counts/SummaryCounts";
import Layout from "@/components/layout/Layout";
import AllInvoice from "@/components/invoice/AllInvoice";
import { useGetInvoiceDetailsMutation } from "@/redux/apis/invoiceApi";
import Cookies from "js-cookie";
import React, { useCallback, useEffect, useState } from "react";

const Invoice = () => {
  const userData = Cookies?.get("userData")
    ? JSON.parse(decodeURIComponent(Cookies?.get("userData")))
    : {};

  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(10);
  const [invoiceDetailsData, setInvoiceDetailsData] = useState(null);
  const [paginationData, setPaginationData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debounceSearchQuery, setDebounceSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState("all");

  const [getInvoiceDetails, { isLoading: isInvoiceDataLoading }] =
    useGetInvoiceDetailsMutation();

  const fetchInvoiceData = useCallback(async () => {
    try {
      const res = await getInvoiceDetails({
        body: {
          partner_id: userData?.id,
          page_no: currentPage,
          per_page: itemPerPage,
          status: selectedStatuses,
          search: debounceSearchQuery,
        },
      });

      if (res?.data?.success) {
        setInvoiceDetailsData(res?.data?.data);
        setPaginationData(
          res?.data?.pagination || res?.data?.data?.pagination || null,
        );
      }
    } catch (error) {
      console.log("error", error);
    }
  }, [
    currentPage,
    debounceSearchQuery,
    getInvoiceDetails,
    itemPerPage,
    selectedStatuses,
    userData?.id,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInvoiceData();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchInvoiceData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const totalInvoices =
    paginationData?.total ??
    invoiceDetailsData?.total_count ??
    invoiceDetailsData?.invoice_data?.length ??
    0;

  return (
    <Layout>
      <SummaryCounts
        infoBtn={{
          title: "Credit Balance",
          amount: ` ${invoiceDetailsData?.credit_balance}`,
          info: "Available credit balance can be used to pay your invoices",
        }}
        countData={invoiceDetailsData?.summary}
        isFetchingCountData={isInvoiceDataLoading}
      />

      <AllInvoice
        invoiceData={invoiceDetailsData?.invoice_data}
        isInvoiceDataLoading={isInvoiceDataLoading}
        totalCount={totalInvoices}
        fetchInvoiceData={fetchInvoiceData}
        paymentAttempts={invoiceDetailsData?.payment_attempts}
        currentPage={currentPage}
        itemPerPage={itemPerPage}
        setCurrentPage={setCurrentPage}
        paginationData={paginationData}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
      />
    </Layout>
  );
};

export default Invoice;
