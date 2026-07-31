import React, { useEffect, useState } from "react";
import AllCreditNoteList from "../../components/all-credit-note-list/AllCreditNoteList";
import Layout from "@/components/layout/Layout";
import { useCreditNotesMutation } from "@/redux/apis/creditNote.Api";
import Cookies from "js-cookie";
import SummaryCounts from "@/common-components/summary-counts/SummaryCounts";

const CreditNotes = () => {
  const [creditNotesList, setCreditNotesList] = useState();
  console.log(creditNotesList, "creditNotesList");

  const userData = Cookies.get("userData")
    ? JSON.parse(decodeURIComponent(Cookies.get("userData")))
    : null;
  const [creditNotes, { isLoading }] = useCreditNotesMutation();
  const fetchCreditNotes = async () => {
    try {
      const res = await creditNotes({
        body: {
          partner_id: userData?.id,
        },
      });
      if (res?.data?.success) {
        const list = res?.data?.data;
        setCreditNotesList(list);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCreditNotes();
  }, []);
  return (
    <Layout>
      <SummaryCounts countData={creditNotesList?.count} />
      <AllCreditNoteList
        creditNotesList={creditNotesList?.credit_notes}
        isLoading={isLoading}
      />
    </Layout>
  );
};

export default CreditNotes;
