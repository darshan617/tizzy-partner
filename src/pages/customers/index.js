
import Layout from "@/components/layout/Layout";
import React, { useEffect } from "react";
import CustomerSummary from "@/components/customers/customer-summary/CustomerSummary";
import AllCustomers from "@/components/customers/all-customers/AllCustomers";
import Cookies from "js-cookie";
import { useGetAllCustomersQuery } from "@/redux/apis/customerApi";

const Customers = () => {
  const userData = Cookies.get("userData")
  ? JSON.parse(decodeURIComponent(Cookies.get("userData")))
  : {};

  const {data: allCustomers, isFetching: isFetchingAllCustomers, refetch} = useGetAllCustomersQuery({
    partner_id: userData?.id,
  })

  useEffect(() => {
    refetch();
  }, []);

  return <Layout>
    <CustomerSummary 
    allCustomers={allCustomers}
    isFetchingAllCustomers={isFetchingAllCustomers}
    />
    <AllCustomers 
    allCustomers={allCustomers}
    isFetchingAllCustomers={isFetchingAllCustomers}
    refetch={refetch}
    />
  </Layout>;
};

export default Customers;
