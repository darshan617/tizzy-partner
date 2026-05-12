import SummaryCounts from "@/common-components/summary-counts/SummaryCounts";
import Layout from "@/components/layout/Layout";
import AllSubcriptions from "@/components/subscription/all-subscriptions/AllSubscriptions";
import { useGetAllSubscriptionsMutation } from "@/redux/apis/subscriptions";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { BsPlusCircleDotted } from "react-icons/bs";

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
      <SummaryCounts
      countData={allSubscriptionsData?.summary}
      isFetchingCountData={isAllSubscriptionDataLoading}
      additionalBtns={[
        {
          href: "/services/tizzy",
          label: "Buy New Subscription",
          icon: <BsPlusCircleDotted size={18} />,
        },
      ]}
      />
      <AllSubcriptions
        allSubscriptionsData={allSubscriptionsData?.data}
        isAllSubscriptionDataLoading={isAllSubscriptionDataLoading}
      />
    </Layout>
  );
};

export default Subscriptions;
