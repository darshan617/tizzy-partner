import Layout from "@/components/layout/Layout";
import React, { useEffect } from "react";
import CustomerSummary from "@/components/customers/customer-summary/CustomerSummary";
import AllCustomers from "@/components/customers/all-customers/AllCustomers";
import Cookies from "js-cookie";
import { useGetAllCustomersQuery } from "@/redux/apis/customerApi";
import CustomerList from "@/components/customers/all-customers/AllCustomers";
import OrderComplete from "@/components/customers/order-complete/OrderComplete";
import CustomerDetailForm from "@/components/customers/renew-plans/customer-detail-form/CustomerDetailForm";
import SubscriptionHistory from "@/components/customers/subscription-history/SubscriptionHistory";
import CustomerDetail from "@/components/customers/customers-details/CustomersDetails";

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

  return (
    <Layout>
      {/* <CustomerSummary
        allCustomers={allCustomers}
        isFetchingAllCustomers={isFetchingAllCustomers}
      /> */}
      {/* <CustomerList
        allCustomers={allCustomers}
        isFetchingAllCustomers={isFetchingAllCustomers}
        refetch={refetch}
      /> */}
      {/* <OrderComplete /> */}
      {/* <CustomerDetailForm /> */}
      <SubscriptionHistory />
    </Layout>
  );
};

export default Customers;
