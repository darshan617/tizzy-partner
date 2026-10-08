import React, { useCallback, useEffect, useState } from "react";
import AllCreditNoteList from "../../components/all-credit-note-list/AllCreditNoteList";
import Layout from "@/components/layout/Layout";
import { useCreditNotesMutation } from "@/redux/apis/creditNote.Api";
import Cookies from "js-cookie";
import SummaryCounts from "@/common-components/summary-counts/SummaryCounts";

const CreditNotes = () => {
  const userData = Cookies.get("userData")
    ? JSON.parse(decodeURIComponent(Cookies.get("userData")))
    : null;
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(10);
  const [creditNotesData, setCreditNotesData] = useState(null);
  const [paginationData, setPaginationData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debounceSearchQuery, setDebounceSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState("all");
  const [creditNotes, { isLoading }] = useCreditNotesMutation();

  const fetchCreditNotes = useCallback(async () => {
    try {
      const res = await creditNotes({
        body: {
          partner_id: userData?.id,
          page_no: currentPage,
          per_page: itemPerPage,
          status: selectedStatuses,
          search: debounceSearchQuery,
        },
      });
      if (res?.data?.success) {
        const data = res.data.data;
        setCreditNotesData(data);
        setPaginationData(
          res.data.pagination || data?.pagination || null,
        );
      }
    } catch (error) {
      console.log(error);
    }
  }, [
    creditNotes,
    currentPage,
    debounceSearchQuery,
    itemPerPage,
    selectedStatuses,
    userData?.id,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCreditNotes();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchCreditNotes]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <Layout>
      <SummaryCounts countData={creditNotesData?.count} />
      <AllCreditNoteList
        creditNotesList={creditNotesData?.credit_notes}
        isLoading={isLoading}
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

export default CreditNotes;
