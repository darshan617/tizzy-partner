import SummaryCounts from "@/common-components/summary-counts/SummaryCounts";
import Layout from "@/components/layout/Layout";
import AllSubcriptions from "@/components/subscription/all-subscriptions/AllSubscriptions";
import { useGetAllSubscriptionsMutation } from "@/redux/apis/subscriptions";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { BsPlusCircleDotted } from "react-icons/bs";

const Subscriptions = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [
    getAllSubscriptions,
    { refetch, isLoading: isAllSubscriptionDataLoading },
  ] = useGetAllSubscriptionsMutation();
  const [allSubscriptionsData, setAllSubscriptionsData] = useState();
  const userData = Cookies.get("userData")
    ? JSON.parse(decodeURIComponent(Cookies.get("userData")))
    : {};
  const fetchAllSubscriptions = async () => {
    try {
      const res = await getAllSubscriptions({
        body: {
          partner_id: userData?.id,
          page_no: currentPage,
          per_page: itemPerPage,
        },
      });
      if (res?.data?.success) {
        setAllSubscriptionsData(res?.data);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };
  useEffect(() => {
    fetchAllSubscriptions();
  }, [currentPage, itemPerPage]);
  return (
    <Layout>
      <SummaryCounts
        countData={allSubscriptionsData?.data?.summary}
        isFetchingCountData={isAllSubscriptionDataLoading}
        additionalBtns={[
          {
            href: "/services/google-workspace",
            label: "Add New Order",
            desc: "Create and manage new customer orders with ease and accuracy.",
            icon: <BsPlusCircleDotted size={18} />,
          },
        ]}
      />
      <AllSubcriptions
        allSubscriptionsData={allSubscriptionsData?.data?.order_details}
        isAllSubscriptionDataLoading={isAllSubscriptionDataLoading}
        paginationData={allSubscriptionsData?.data?.pagination}
        currentPage={currentPage}
        itemPerPage={itemPerPage}
        setCurrentPage={setCurrentPage}
        setItemPerPage={setItemPerPage}
      />
    </Layout>
  );
};

export default Subscriptions;
