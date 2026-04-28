// import Summary from "@/components/customers/summary/Summary";
import AccountSummary from "@/components/dashboard/account-summary/AccountSummary";
import TransactionSection from "@/components/dashboard/transaction/Transaction";
import Layout from "@/components/layout/Layout";
import React from "react";

const Home = () => {
  return <Layout>
    <AccountSummary/>
    {/* <Summary /> */}
    <TransactionSection />
  </Layout>;
};

export default Home;
