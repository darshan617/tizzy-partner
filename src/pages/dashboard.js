import AccountSummary from "@/components/dashboard/account-summary/AccountSummary";
import SalesReport from "@/components/dashboard/sales-report/SalesReport";
import Support from "@/components/dashboard/support/Support";
import TransactionSection from "@/components/dashboard/transaction/Transaction";
import Layout from "@/components/layout/Layout";
import React from "react";

const dashboard = () => {
  return (
    <Layout>
      <AccountSummary />
      <TransactionSection />
      <SalesReport />
      <Support />
    </Layout>
  );
};

export default dashboard;