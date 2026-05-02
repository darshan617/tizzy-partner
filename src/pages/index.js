// import Summary from "@/components/customers/summary/Summary";
import AccountSummary from "@/components/dashboard/account-summary/AccountSummary";
import TransactionSection from "@/components/dashboard/transaction/Transaction";
import RenewCart from "@/components/customers/renew-plans/renew-cart/RenewCart";
import Layout from "@/components/layout/Layout";
import React from "react";

const Home = () => {
  return <Layout>
    {/* <AccountSummary/> */}
    {/* <CustomerSummary /> */}
    <RenewCart />
    {/* <TransactionSection /> */}
  </Layout>;
};

export default Home;
