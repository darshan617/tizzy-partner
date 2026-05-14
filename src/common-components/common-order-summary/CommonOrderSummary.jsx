import OrderSummaryCard from "@/components/customers/renew-plans/order-summary/OrderSummaryCard";
import RenewCart from "@/components/customers/renew-plans/renew-cart/RenewCart";
import layoutStyles from "@/common-components/common-order-summary/CommonOrderSummary.module.css";
import {
  useAddToCartMutation,
  useGetCartDetailsMutation,
  useGetUpdateCartDetailsQuery,
  useRenewCustomerDetailsMutation,
  useUpdateCartMutation,
} from "@/redux/apis/addToCartApi";
import { useGetAllCustomersQuery } from "@/redux/apis/customerApi";
import { selectCartData, setCartData } from "@/redux/slices/cartSlice";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const normalizeCompanyName = (name) => {
  const t = String(name ?? "").trim();
  return t && t !== "-" ? t : "";
};

const getCartLineUnitPrice = (item) =>
  Number(item?.price_per_unit ?? item?.unit_price ?? 0) || 0;

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
  const [promoCode, setPromoCode] = useState(10);
  const [domainName, setDomainName] = useState("");

  const isListCart = Array.isArray(cartDetails);
  const total = isListCart
    ? cartDetails.reduce((sum, item) => {
        const u = getCartLineUnitPrice(item);
        const l = Math.max(1, Number(item?.licenses) || 1);
        return sum + u * l;
      }, 0)
    : (Number(pricePerUser) || 0) * (Number(lisceneCounter) || 0);

  const [addToCart, { isLoading: isGettingCartDetails }] =
    useAddToCartMutation();
  const [updateCart, { isLoading: isUpdatingCart }] = useUpdateCartMutation();
  const [renewCustomerDetails, { isLoading: isRenewingCustomerDetails }] =
    useRenewCustomerDetailsMutation();

  //cart api
  const [getCartDetailsApi, { isLoading: isGettingCartDetailsApi }] =
    useGetCartDetailsMutation();

  const { data: getAllCustomers } = useGetAllCustomersQuery(
    {
      partner_id: userData?.id,
    },
    {
      skip:
        !userData?.id ||
        (!router?.pathname === "/my-cart" &&
          !router?.query?.variant === "new-plan"),
    },
  );

  const { data: getUpdateCartDetails } = useGetUpdateCartDetailsQuery(
    {
      partner_id: userData?.id,
      plan_id: router?.query?.plan_id,
    },
    {
      skip: !userData?.id || !router?.query?.plan_id,
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
        const data = res?.data?.data;
        setCartDetails({
          ...data,
          customerLimit: data?.customerLimit || data?.customer_limit,
        });
        setPricePerUser(Number(data?.unit_price) || 0);
        dispatch(setCartData(data));
        setLisceneCounter(data?.licenses);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleUpdateCart = async () => {
    try {
      const res = await updateCart({
        body: {
          cart_id: cartData?.cart_id || cartDetails?.cart_id,
          licenses: lisceneCounter,
          domain_name: domainName,
          company_name: normalizeCompanyName(selectedCompany),
          customer_id: customerData?.customer_id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleRenewCustomerDetails = async () => {
    try {
      const res = await renewCustomerDetails({
        body: {
          order_id: router?.query?.order_id,
        },
      });
      if (res?.data?.success) {
        const resCartDetails = {
          ...res?.data?.data,
          plan_name: res?.data?.data?.plan_info?.plan_name,
          domain_name: res?.data?.data?.company_info?.domain,
          subscription_start_date:
            res?.data?.data?.plan_info?.billing_cycle?.start_date,
          subscription_end_date:
            res?.data?.data?.plan_info?.billing_cycle?.end_date,
          customerLimit: res?.data?.data?.plan_info?.customer_limit,
        };

        setCartDetails(resCartDetails);
        setPricePerUser(
          Number(
            res?.data?.data?.renewal_summary?.price_per_license_per_year,
          ) || 0,
        );
        setLisceneCounter(res?.data?.data?.plan_info?.licenses);
        dispatch(setCartData(res?.data?.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  //cart api
  const handleGetCartDetails = async () => {
    const res = await getCartDetailsApi({
      body: {
        partner_id: userData?.id,
      },
    });
    if (res?.data?.success) {
      const data = res?.data?.data;
      const allData = data.map((item) => ({
        ...item,
        plan_name: item?.plan?.name,
        domain_name: item?.domain_name,
        subscription_start_date: item?.created_at,
        subscription_end_date: item?.end_date,
        customerLimit: item?.customer_limit,
      }));
      setCartDetails(allData);
    } else {
      console.log(res?.data?.message, "res?.data?.message");
    }
  };

  useEffect(() => {
    if (router?.query?.plan_id && router?.query?.variant) {
      handleAddToCart();
    }
  }, []);

  useEffect(() => {
    if (Array.isArray(cartDetails)) return undefined;
    if (!cartData?.cart_id && !cartDetails?.cart_id) return undefined;

    const timer = setTimeout(() => {
      handleUpdateCart();
    }, 1500);

    return () => clearTimeout(timer);
  }, [
    cartData?.cart_id,
    lisceneCounter,
    domainName,
    selectedCompany,
    cartDetails?.cart_id,
    cartDetails,
  ]);

  useEffect(() => {
    if (!Array.isArray(cartDetails) || cartDetails.length === 0)
      return undefined;

    const timer = setTimeout(() => {
      cartDetails.forEach((item) => {
        const cart_id = item?.cart_id;
        if (!cart_id) return;
        updateCart({
          body: {
            cart_id,
            licenses: Number(item?.licenses) || 1,
            domain_name: item?.domain_name ?? domainName,
            company_name: normalizeCompanyName(
              item?.company_name ?? selectedCompany,
            ),
            customer_id: item?.customer_id ?? customerData?.customer_id,
          },
        });
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [cartDetails, domainName, selectedCompany, customerData?.customer_id]);

  useEffect(() => {
    if (router?.query?.type === "renew-plan") {
      handleRenewCustomerDetails();
    }
  }, [router?.query?.type === "renew-plan"]);

  useEffect(() => {
    if (getUpdateCartDetails?.success) {
      const data = getUpdateCartDetails?.data;

      if (!data) return;
      setCartDetails({
        ...data,
        plan_name: data?.plan_name,
        domain_name: data?.domain_name,
        subscription_start_date: data?.created_at,
        subscription_end_date: data?.updated_at,
        customerLimit: data?.customerLimit,
      });
      setPricePerUser(Number(data?.unit_price) || 0);
      dispatch(setCartData(data));
      setLisceneCounter(data?.licenses || 1);
      setDomainName(data?.domain_name || "");
      setSelectedCompany(normalizeCompanyName(data?.company_name));
    }
  }, [getUpdateCartDetails, router?.query?.plan_id, dispatch]);

  //cart api — skip when plan_id is present; getUpdateCartDetails already loads that cart
  useEffect(() => {
    if (userData?.id) {
      handleGetCartDetails();
    }
  }, [userData?.id]);

  const updateLineLicenses = (lineKey, nextLicenses) => {
    setCartDetails((prev) => {
      if (!Array.isArray(prev)) return prev;
      return prev.map((item, idx) => {
        const key = item?.cart_id ?? item?.id ?? idx;
        if (String(key) !== String(lineKey)) return item;
        return { ...item, licenses: nextLicenses };
      });
    });
  };

  return (
    <div className={layoutStyles.shell}>
      {cartDetails.length > 0 ? (
        <div className={layoutStyles.split}>
          <div className={layoutStyles.leftScroll}>
            <RenewCart
              lisceneCounter={lisceneCounter}
              setLisceneCounter={setLisceneCounter}
              pricePerUser={pricePerUser}
              total={total}
              cartDetails={cartDetails}
              onLineLicensesChange={updateLineLicenses}
              getAllCustomers={getAllCustomers}
              selectedCompany={selectedCompany}
              setSelectedCompany={setSelectedCompany}
              domainName={domainName}
              setDomainName={setDomainName}
              isGettingCartDetails={isGettingCartDetailsApi}
              hideInlineSubtotal={true}
            />
          </div>
          <aside className={layoutStyles.rightSticky}>
            <OrderSummaryCard
              lisceneCounter={lisceneCounter}
              setLisceneCounter={setLisceneCounter}
              pricePerUser={pricePerUser}
              total={total}
              promoCode={promoCode}
              setPromoCode={setPromoCode}
              _creditBalance_={Number(
                (Array.isArray(cartDetails)
                  ? (cartDetails[0]?.wallet_info?.wallet_balance ??
                    cartDetails[0]?.pricing?.wallet_balance ??
                    cartDetails[0]?.wallet_balance)
                  : cartDetails?.wallet_info?.wallet_balance ||
                    cartDetails?.pricing?.wallet_balance ||
                    cartDetails?.wallet_balance) ?? 0,
              )}
            />
          </aside>
        </div>
      ) : (
        <div className={layoutStyles.emptyCart}>
          <p className="text-center mt-5">
            No cart records found for the given partner and provider.
          </p>
        </div>
      )}
    </div>
  );
};

export default CommonOrderSummary;
