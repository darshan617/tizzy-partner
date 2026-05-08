import CustomerDetail from "@/components/customers/customers-details/CustomersDetails";
import OrderSummaryCard from "@/components/customers/renew-plans/order-summary/OrderSummaryCard";
import RenewCart from "@/components/customers/renew-plans/renew-cart/RenewCart";
import { useGetCartDetailsMutation } from "@/redux/apis/addToCartApi";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const CommonOrderSummary = () => {
  const router = useRouter();
  const customerData = Cookies.get("customerData")
    ? JSON.parse(Cookies.get("customerData"))
    : {};

  const [lisceneCounter, setLisceneCounter] = useState(1);
  const pricePerUser = 1000;
  const total = pricePerUser * lisceneCounter;

  const [getCartDetails, { isLoading: isGettingCartDetails }] =
    useGetCartDetailsMutation();

  const handleAddToCart = async () => {
    try {
      let res;
      if (!router?.query?.type && router?.query?.plan_id) {
        res = await getCartDetails({
          body: {
            partner_id: customerData?.partner_id,
            plan_id: router?.query?.plan_id,
            // licenses: 1,
          },
        });
      } else if (router?.query?.type && router?.query?.plan_id) {
        res = await getCartDetails({
          body: {
            partner_id: customerData?.partner_id,
            customer_id: customerData?.customer_id,
            plan_id: router?.query?.plan_id,
            // domain_name: customerData?.domain_name,
            // licenses: 1,
          },
        });
      }

      if (res?.data?.success) {
        showToast(" successfully", "success");
        router.push({
          pathname: `/order-summary`,
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    handleAddToCart();
  }, [router?.query?.plan_id]);

  return (
    <div className="d-flex align-items-start gap-3 justify-content-center">
      <RenewCart
        lisceneCounter={lisceneCounter}
        setLisceneCounter={setLisceneCounter}
        pricePerUser={pricePerUser}
        total={total}
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
