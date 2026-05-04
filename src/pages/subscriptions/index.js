import CustomerList from "@/components/customers/all-customers/AllCustomers";
import TransactionSection from "@/components/dashboard/transaction/Transaction";
import Layout from "@/components/layout/Layout";
import AllSubcriptions from "@/components/subscription/all-subscriptions/AllSubscriptions";
import SubscriptionSummary from "@/components/subscription/subscription-summary/SubscriptionSummary";
import { useGetAllSubscriptionsMutation } from "@/redux/apis/subscriptions";
import { selectUserData } from "@/redux/slices/userSlice";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Subscriptions = () => {
  const [
    getAllSubscriptions,
    { refetch, isLoading: isAllSubscriptionDataLoading },
  ] = useGetAllSubscriptionsMutation();
  const [allSubscriptionsData, setAllSubscriptionsData] = useState();
  const userData = Cookies.get("userData")
    ? JSON.parse(decodeURIComponent(Cookies.get("userData")))
    : {};

  useEffect(() => {
    const fetchAllSubscriptions = async () => {
      try {
        const res = await getAllSubscriptions({
          body: {
            partner_id: userData?.id,
          },
        });
        if (res?.data?.success) {          
          setAllSubscriptionsData(res?.data);
        }
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchAllSubscriptions();
  }, []);
  return (
    <Layout>
      <SubscriptionSummary
        summaryData={allSubscriptionsData}
        isSummaryFetching={isAllSubscriptionDataLoading}
      />
      <AllSubcriptions
        allSubscriptionsData={allSubscriptionsData?.data}
        isAllSubscriptionDataLoading={isAllSubscriptionDataLoading}
      />
    </Layout>
  );
};

export default Subscriptions;
