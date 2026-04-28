import Summary from "@/components/customers/summary/Summary";
import AccountSummary from "@/components/dashboard/account-summary/AccountSummary";
import Layout from "@/components/layout/Layout";
import React from "react";

const Home = () => {
  return <Layout>
    <AccountSummary/>
    <Summary />
  </Layout>;
};

export default Home;
