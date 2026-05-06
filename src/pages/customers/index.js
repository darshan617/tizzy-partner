import Layout from "@/components/layout/Layout";
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { useGetAllCustomersQuery } from "@/redux/apis/customerApi";
import CustomerList from "@/components/customers/all-customers/AllCustomers";
import SummaryCounts from "@/common-components/summary-counts/SummaryCounts";
import { Plus } from "lucide-react";

const Customers = () => {
  const userData = Cookies.get("userData")
    ? JSON.parse(decodeURIComponent(Cookies.get("userData")))
    : {};

  const {
    data: allCustomers,
    isFetching: isFetchingAllCustomers,
    refetch,
  } = useGetAllCustomersQuery({
    partner_id: userData?.id,
  });

  useEffect(() => {
    refetch();
  }, []);

  console.log(allCustomers, "allCustomers");
  
  return (
    <Layout>
      <SummaryCounts
      countData={allCustomers?.data?.count}
      additionalBtns={[
        {
          href: "/customers/create-customer",
          label: "Add New Customer",
          icon: <Plus size={18} />,
        }
      ]}
      isFetchingCountData={isFetchingAllCustomers}
      />
      <CustomerList
        allCustomers={allCustomers}
        isFetchingAllCustomers={isFetchingAllCustomers}
        refetch={refetch}
      />
      {/* <OrderComplete /> */}
      {/* <CustomerDetailForm /> */}
    </Layout>
  );
};

export default Customers;
