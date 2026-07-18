import SummaryCounts from "@/common-components/summary-counts/SummaryCounts";
import Layout from "@/components/layout/Layout";
import SupportList from "@/components/support-details/support-list/SupportList";
import { useGetTicketsMutation } from "@/redux/apis/supportTicketsApi";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { LuTicket } from "react-icons/lu";

const SupportPage = () => {
  const router = useRouter();
  const [ticketsData, setTicketsData] = useState(null);
  const [getTickets, { isLoading: isGettingTickets }] = useGetTicketsMutation();
  const userData = Cookies.get("userData")
    ? JSON.parse(Cookies.get("userData"))
    : {};
  useEffect(() => {
    if (router?.isReady) {
      const fetchTickets = async () => {
        try {
          const response = await getTickets({
            body: { partner_id: userData?.id },
          });
          setTicketsData(response?.data?.data);
        } catch (error) {
          console.log(error);
          setTicketsData({ tickets: [], stats: [] });
        }
      };

      fetchTickets();
    }
  }, [userData?.id, router?.isReady]);

  const isLoading = isGettingTickets || ticketsData === null;

  return (
    <Layout>
      <SummaryCounts
        title="Ticket Summary"
        countData={ticketsData?.stats || []}
        additionalBtns={[
          {
            href: "/support/create-new-ticket",
            label: "Ticket Management",
            desc: "Create and manage support requests with ease and efficiency.",
            icon: <LuTicket size={22} />,
          },
        ]}
      />
      <SupportList
        ticketsData={ticketsData?.tickets}
        isLoading={isLoading}
      />
    </Layout>
  );
};

export default SupportPage;
