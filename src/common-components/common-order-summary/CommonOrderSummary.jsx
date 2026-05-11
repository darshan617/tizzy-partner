import CustomerDetail from "@/components/customers/customers-details/CustomersDetails";
import OrderSummaryCard from "@/components/customers/renew-plans/order-summary/OrderSummaryCard";
import RenewCart from "@/components/customers/renew-plans/renew-cart/RenewCart";
import {
  useAddToCartMutation,
  useGetCartDetailsMutation,
} from "@/redux/apis/addToCartApi";
import { useGetAllCustomersQuery } from "@/redux/apis/customerApi";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const CommonOrderSummary = () => {
  const router = useRouter();
  const customerData = Cookies.get("customerData")
    ? JSON.parse(Cookies.get("customerData"))
    : {};

  const userData = Cookies.get("userData")
    ? JSON.parse(Cookies.get("userData"))
    : {};
  const [cartDetails, setCartDetails] = useState({});
  const [pricePerUser, setPricePerUser] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState("");
  console.log(selectedCompany, "selectedCompany");
  const [lisceneCounter, setLisceneCounter] = useState(1);
  const total = pricePerUser * lisceneCounter;

  const [addToCart, { isLoading: isGettingCartDetails }] =
    useAddToCartMutation();

  const { data: getAllCustomers } = useGetAllCustomersQuery(
    {
      partner_id: userData?.id,
    },
    {
      skip: router?.query?.variant !== "new-plan" || !userData?.id,
    },
  );

  const handleAddToCart = async () => {
    try {
      const res = await addToCart({
        body: {
          partner_id: userData?.id,
          plan_id: router?.query?.plan_id,
          // licenses: 1,
        },
      });
      // if (!router?.query?.variant && router?.query?.plan_id) {
      //   res = await addToCart({
      //     body: {
      //       partner_id: customerData?.partner_id,
      //       plan_id: router?.query?.plan_id,
      //       // licenses: 1,
      //     },
      //   });
      // } else if (router?.query?.type && router?.query?.plan_id) {
      //   res = await addToCart({
      //     body: {
      //       // partner_id: customerData?.partner_id,
      //       // customer_id: customerData?.customer_id,
      //       plan_id: router?.query?.plan_id,
      //       // domain_name: customerData?.domain_name,
      //       // licenses: 1,
      //     },
      //   });
      // }

      if (res?.data?.success) {
        setCartDetails(res?.data?.data);
        setPricePerUser(res?.data?.data?.unit_price || 0);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    handleAddToCart();
  }, [router?.query?.plan_id, router?.query?.variant]);

  return (
    <div className="d-flex align-items-start gap-3 justify-content-center">
      <RenewCart
        lisceneCounter={lisceneCounter}
        setLisceneCounter={setLisceneCounter}
        pricePerUser={pricePerUser}
        total={total}
        cartDetails={cartDetails}
        getAllCustomers={getAllCustomers}
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
      />
      <OrderSummaryCard
        lisceneCounter={lisceneCounter}
        setLisceneCounter={setLisceneCounter}
        pricePerUser={pricePerUser}
        total={total}
      />
    </div>
  );
};

export default CommonOrderSummary;
