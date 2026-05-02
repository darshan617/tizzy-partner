import CustomerDetail from "@/components/customers/customers-details/CustomersDetails";
import OrderSummary from "@/components/customers/renew-plans/order-summary/OrderSummary";
import RenewCart from "@/components/customers/renew-plans/renew-cart/RenewCart";
import AccountSummary from "@/components/dashboard/account-summary/AccountSummary";
import SalesReport from "@/components/dashboard/sales-report/SalesReport";
import Support from "@/components/dashboard/support/Support";
import TransactionSection from "@/components/dashboard/transaction/Transaction";
import Layout from "@/components/layout/Layout";
import Navbar from "@/components/layout/navbar/Navbar";
import Sidebar from "@/components/layout/sidebar/Sidebar";
import React from "react";

const dashboard = () => {
  return <Layout>
    <AccountSummary />
    {/* <TransactionSection /> */}
    <SalesReport />
    {/* <Support /> */}

  </Layout>;
};

export default dashboard;
