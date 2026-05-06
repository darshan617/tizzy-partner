
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


const DynamicSummaryCounts = dynamic(
  () => import("@/common-components/summary-counts/SummaryCounts"),
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
      <DynamicSummaryCounts
        title="Account Summary"
        countData={data?.data?.kpis}
      />
      <TransactionSection />
      <SalesReport />
      <Support />
    </Layout>
  );
};

export default dashboard;
