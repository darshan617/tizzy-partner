import Layout from "@/components/layout/Layout";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useGetAllCustomersQuery } from "@/redux/apis/customerApi";
import CustomerList from "@/components/customers/all-customers/AllCustomers";
import SummaryCounts from "@/common-components/summary-counts/SummaryCounts";
import { Plus, UserRoundPlus } from "lucide-react";
import SubscriptionHistory from "@/components/customers/subscription-history/SubscriptionHistory";
import CustomerDetail from "@/components/customers/customers-details/CustomersDetails";
import Pagination from "@/common-components/pagination/Pagination";

const Customers = () => {
  const userData = Cookies.get("userData")
    ? JSON.parse(decodeURIComponent(Cookies.get("userData")))
    : {};
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [selectedStatuses, setSelectedStatuses] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debounceSearchQuery, setDebounceSearchQuery] = useState("");
  const {
    data: allCustomers,
    isFetching: isFetchingAllCustomers,
    refetch,
  } = useGetAllCustomersQuery({
    partner_id: userData?.id,
    page_no: currentPage,
    per_page: itemPerPage,
    status: selectedStatuses,
    search: debounceSearchQuery,
  });

  useEffect(() => {
    refetch();
  }, [currentPage, itemPerPage, selectedStatuses, debounceSearchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <Layout>
      <SummaryCounts
        countData={allCustomers?.data?.count}
        additionalBtns={[
          {
            href: "/customers/create-customer",
            label: "Add New Customer",
            desc: "Add and manage customer accounts to grow your business effortlessly",
            icon: <UserRoundPlus size={22} />,
          },
        ]}
        isFetchingCountData={isFetchingAllCustomers}
        permissionName="customers"
      />
      <CustomerList
        allCustomers={allCustomers}
        isFetchingAllCustomers={isFetchingAllCustomers}
        refetch={refetch}
        currentPage={currentPage}
        itemPerPage={itemPerPage}
        setCurrentPage={setCurrentPage}
        setItemPerPage={setItemPerPage}
        paginationData={allCustomers?.data?.pagination}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </Layout>
  );
};

export default Customers;
