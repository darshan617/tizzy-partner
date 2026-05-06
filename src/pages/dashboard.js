import CustomerDetail from "@/components/customers/customers-details/CustomersDetails";
import OrderSummary from "@/components/customers/renew-plans/order-summary/OrderSummaryCard";
import RenewCart from "@/components/customers/renew-plans/renew-cart/RenewCart";
import AccountSummary from "@/components/dashboard/account-summary/AccountSummary";
import SalesReport from "@/components/dashboard/sales-report/SalesReport";
import Support from "@/components/dashboard/support/Support";
import TransactionSection from "@/components/dashboard/transaction/Transaction";
import Layout from "@/components/layout/Layout";
import { useGetDashboardDataQuery } from "@/redux/apis/dashboardApi";
import dynamic from "next/dynamic";
import React from "react";

export const getServerSideProps = async (context) => {
  const { req } = context;

  let partner_id = null;

  try {
    const userData = req?.cookies?.userData;

    if (userData) {
      const parsedUser = JSON.parse(userData);
      partner_id = parsedUser?.id || null;
    }
  } catch (error) {
    console.log("Cookie parse error:", error);
  }

  return {
    props: {
      partner_id,
    },
  };
};

const DynamicAccountSummary = dynamic(
  () => import("@/components/dashboard/account-summary/AccountSummary"),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  },
);

const dashboard = ({ partner_id }) => {
  console.log("Partner ID:", partner_id);

  const { data, error, isLoading } = useGetDashboardDataQuery({ partner_id });
  console.log(data?.data?.kpis);

  return (
    <Layout>
      <DynamicAccountSummary />
      <TransactionSection />
      <SalesReport />
      <Support />
    </Layout>
  );
};

export default dashboard;
