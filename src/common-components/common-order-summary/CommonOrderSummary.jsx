import CustomerDetail from "@/components/customers/customers-details/CustomersDetails";
import OrderSummaryCard from "@/components/customers/renew-plans/order-summary/OrderSummaryCard";
import RenewCart from "@/components/customers/renew-plans/renew-cart/RenewCart";
import {
  useAddToCartMutation,
  useUpdateCartMutation,
} from "@/redux/apis/addToCartApi";
import { useGetAllCustomersQuery } from "@/redux/apis/customerApi";
import { selectCartData, setCartData } from "@/redux/slices/cartSlice";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const CommonOrderSummary = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartData = useSelector(selectCartData);
  const customerData = Cookies.get("customerData")
    ? JSON.parse(Cookies.get("customerData"))
    : {};

  const userData = Cookies.get("userData")
    ? JSON.parse(Cookies.get("userData"))
    : {};
  const [cartDetails, setCartDetails] = useState({});
  const [pricePerUser, setPricePerUser] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [lisceneCounter, setLisceneCounter] = useState(1);
  const total = pricePerUser * lisceneCounter;

  const [addToCart, { isLoading: isGettingCartDetails }] =
    useAddToCartMutation();

  const [updateCart, { isLoading: isUpdatingCart }] = useUpdateCartMutation();

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
        dispatch(setCartData(res?.data?.data));
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleUpdateCart = async () => {
    try {
      const res = await updateCart({
        body: {
          cart_id: cartData?.cart_id,
          licenses: lisceneCounter,
        },
      });

      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleAddToCart();
  }, [router?.query?.plan_id, router?.query?.variant]);

  useEffect(() => {
    handleUpdateCart();
  }, [cartData?.cart_id, lisceneCounter]);

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
