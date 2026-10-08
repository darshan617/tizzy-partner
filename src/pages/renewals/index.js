import Layout from "@/components/layout/Layout";
import AllRenewals from "@/components/renewals/AllRenewals";
import { useGetAllRenewalsListMutation } from "@/redux/apis/renewalsApi";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";

const Renewals = () => {
  const userData = Cookies.get("userData")
    ? JSON.parse(decodeURIComponent(Cookies.get("userData")))
    : {};
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [renewalsList, setRenewalsList] = useState([]);
  const [paginationData, setPaginationData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debounceSearchQuery, setDebounceSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState("all");

  const [getAllRenewalsList, { isLoading: isAllRenewalsListLoading }] =
    useGetAllRenewalsListMutation();

  useEffect(() => {
    const fetchAllRenewalsList = async () => {
      try {
        const res = await getAllRenewalsList({
          body: {
            partner_id: userData?.id,
            page_no: currentPage,
            per_page: itemPerPage,
            search: debounceSearchQuery,
            status: selectedStatuses,
          },
        });
        if (res?.data?.success) {
          setRenewalsList(res.data.data || []);
          setPaginationData(res.data.pagination || null);
        }
      } catch (error) {
        console.log("Error", error);
      }
    };

    fetchAllRenewalsList();
  }, [
    currentPage,
    getAllRenewalsList,
    itemPerPage,
    userData?.id,
    debounceSearchQuery,
    selectedStatuses,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <Layout>
      <AllRenewals
        currentPage={currentPage}
        itemPerPage={itemPerPage}
        setCurrentPage={setCurrentPage}
        renewalsList={renewalsList}
        paginationData={paginationData}
        isAllRenewalsListLoading={isAllRenewalsListLoading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setSelectedStatuses={setSelectedStatuses}
        selectedStatuses={selectedStatuses}
      />
    </Layout>
  );
};

export default Renewals;
