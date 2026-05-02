// import Summary from "@/components/customers/summary/Summary";
import CustomerSummary from "@/components/customers/customer-summary/CustomerSummary";
import AccountSummary from "@/components/dashboard/account-summary/AccountSummary";
import TransactionSection from "@/components/dashboard/transaction/Transaction";
import Layout from "@/components/layout/Layout";
import React from "react";

const Home = () => {
  return <Layout>
    {/* <AccountSummary/> */}
    <CustomerSummary />
    {/* <TransactionSection /> */}
  </Layout>;
};

export default Home;
