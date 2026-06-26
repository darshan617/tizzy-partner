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
  let partner_name = null;

  try {
    const userData = req?.cookies?.userData;

    if (userData) {
      const parsedUser = JSON.parse(userData);
      partner_id = parsedUser?.id || null;
      partner_name = parsedUser?.name || null;
    }
  } catch (error) {
    console.log("Cookie parse error:", error);
  }

  return {
    props: {
      partner_id,
      partner_name,
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

const dashboard = ({ partner_id, partner_name }) => {
  console.log("Partner ID:", partner_id);

  const {
    data: dashboardData,
    error,
    isLoading: isDashboardLoading,
  } = useGetDashboardDataQuery({ partner_id });

  return (
    <Layout>
      <div className="row">
        <div className="mainContainer">
          <p className=" m-0">Welcome,</p>
          <p className="fw-bold fs-3 m-0 text-capitalize">{partner_name}</p>
        </div>
      </div>
      <DynamicSummaryCounts
        title="Account Summary"
        countData={dashboardData?.data?.kpis}
        isFetchingCountData={isDashboardLoading}
      />
      <TransactionSection
        data={dashboardData?.data}
        isDataLoading={isDashboardLoading}
      />
      <SalesReport
        data={dashboardData?.data}
        isDataLoading={isDashboardLoading}
      />
      <Support />
    </Layout>
  );
};

export default dashboard;
