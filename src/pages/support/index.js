import SummaryCounts from "@/common-components/summary-counts/SummaryCounts";
import Layout from "@/components/layout/Layout";
import SupportList from "@/components/support-details/support-list/SupportList";
import { useGetTicketsMutation } from "@/redux/apis/supportTicketsApi";
import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { LuTicket } from "react-icons/lu";

const SupportPage = () => {
  const router = useRouter();
  const [ticketsData, setTicketsData] = useState(null);
  const [paginationData, setPaginationData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemPerPage = 12;
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debounceSearchQuery, setDebounceSearchQuery] = useState("");
  const [getTickets, { isLoading: isGettingTickets }] = useGetTicketsMutation();
  const userData = Cookies.get("userData")
    ? JSON.parse(Cookies.get("userData"))
    : {};

  const fetchTickets = useCallback(async () => {
    try {
      const response = await getTickets({
        body: {
          partner_id: userData?.id,
          page_no: currentPage,
          per_page: itemPerPage,
          status: selectedStatus,
          priority: selectedPriority,
          search: debounceSearchQuery,
        },
      }).unwrap();

      setTicketsData(response?.data);
      setPaginationData(
        response?.pagination || response?.data?.pagination || null,
      );
    } catch (error) {
      console.log(error);
      setTicketsData({ tickets: [], stats: [] });
      setPaginationData(null);
    }
  }, [
    currentPage,
    debounceSearchQuery,
    getTickets,
    itemPerPage,
    selectedPriority,
    selectedStatus,
    userData?.id,
  ]);

  useEffect(() => {
    if (!router?.isReady || !userData?.id) return;

    const timer = setTimeout(() => {
      fetchTickets();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchTickets, router?.isReady, userData?.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const isLoading = isGettingTickets || ticketsData === null;
  const totalTickets =
    paginationData?.total ??
    ticketsData?.total_count ??
    ticketsData?.tickets?.length ??
    0;

  return (
    <Layout>
      <SummaryCounts
        title="Ticket Summary"
        countData={ticketsData?.stats || []}
        additionalBtns={[
          {
            href: "/support/create-new-ticket",
            label: "Create New Ticket",
            desc: "Create and manage support requests with ease and efficiency.",
            icon: <LuTicket size={22} />,
          },
        ]}
        permissionName="support"
      />
      <SupportList
        ticketsData={ticketsData?.tickets}
        isLoading={isLoading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemPerPage={itemPerPage}
        paginationData={paginationData}
        totalCount={totalTickets}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedPriority={selectedPriority}
        setSelectedPriority={setSelectedPriority}
      />
    </Layout>
  );
};

export default SupportPage;
