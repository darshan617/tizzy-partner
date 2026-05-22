import OrderSummaryCard from "@/components/customers/renew-plans/order-summary/OrderSummaryCard";
import RenewCart from "@/components/customers/renew-plans/renew-cart/RenewCart";
import layoutStyles from "@/common-components/common-order-summary/CommonOrderSummary.module.css";
import {
  useAadharNumberMutation,
  useAddToCartMutation,
  useGetCartDetailsMutation,
  useGetUpdateCartDetailsQuery,
  useGetUpgradeAddToCartDetailsMutation,
  useGetUpgradeAddToCartDetailsQuery,
  useRenewCustomerDetailsMutation,
  useUpdateCartMutation,
  useVerifyAadharNumberOtpMutation,
} from "@/redux/apis/addToCartApi";
import { useGetAllCustomersQuery } from "@/redux/apis/customerApi";
import { selectCartData, setCartData } from "@/redux/slices/cartSlice";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../loader/Loader";
import { useToast } from "@/custom-hooks/toast/ToastProvider";

const normalizeCompanyName = (name) => {
  const t = String(name ?? "").trim();
  return t && t !== "-" ? t : "";
};

const getCartLineUnitPrice = (item) =>
  Number(item?.price_per_unit ?? item?.unit_price ?? 0) || 0;

const resolveMainCartId = (cartDetails, cartData) => {
  if (cartData?.main_cart_id) return cartData.main_cart_id;
  if (Array.isArray(cartDetails)) {
    return cartDetails[0]?.main_cart_id;
  }
  return cartDetails?.main_cart_id;
};

const buildDomainsFromInput = (domainRows, providerId, suffix) =>
  (domainRows || [])
    .map((domain) => {
      const prefix = String(domain?.prefix ?? "").trim();
      if (!prefix) return null;
      return providerId === 2 ? `${prefix}${suffix}` : prefix;
    })
    .filter(Boolean);

const hasDomainPrefixInput = (domainRows) =>
  buildDomainsFromInput(domainRows, 1, "").length > 0;

const toDomainArray = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
};

const resolveCartDomains = (item, tempDomains = []) => {
  const fromItem = toDomainArray(item?.domain_name);
  const fromTemp = toDomainArray(tempDomains);
  return [...new Set([...fromTemp, ...fromItem])];
};

const buildAutoUpdateCartBody = ({
  item,
  itemIndex,
  selectedCompany,
  tempDomains,
  customerId,
}) => {
  const domain_name = resolveCartDomains(
    item,
    itemIndex === 0 ? tempDomains : [],
  );

  const body = {
    cart_id: item?.cart_id,
    main_cart_id: item?.main_cart_id,
    licenses: Number(item?.licenses) || 1,
    company_name: normalizeCompanyName(selectedCompany || item?.company_name),
    customer_id: customerId ?? item?.customer_id,
    transfer_domain: item?.transfer_domain ?? "no",
  };

  if (domain_name.length > 0) {
    body.domain_name = domain_name;
  }

  return body;
};

const CommonOrderSummary = () => {
  const { showToast } = useToast();
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
  const [promoCode, setPromoCode] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState("");
  const [domainNames, setDomainNames] = useState([]);
  const [tempDomainNames, setTempDomainNames] = useState([]);
  const tempDomainNamesRef = useRef([]);
  const selectedCompanyRef = useRef("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [transferCode, setTransferCode] = useState("");

  console.log(transferCode, "transferCode");

  const DOMAIN_SUFFIX = ".onmicrosoft.com";
  useEffect(() => {
    tempDomainNamesRef.current = tempDomainNames;
  }, [tempDomainNames]);

  useEffect(() => {
    selectedCompanyRef.current = selectedCompany;
  }, [selectedCompany]);

  useEffect(() => {
    const firstItem = Array.isArray(cartDetails)
      ? cartDetails[0]
      : cartDetails &&
          typeof cartDetails === "object" &&
          Object.keys(cartDetails).length > 0
        ? cartDetails
        : null;
    const fromCart = normalizeCompanyName(firstItem?.company_name);
    if (!fromCart) return;

    setSelectedCompany((prev) => {
      if (prev) return prev;
      selectedCompanyRef.current = fromCart;
      return fromCart;
    });
  }, [cartDetails]);

  const handleCompanyChange = (companyName, companyId) => {
    const normalized = normalizeCompanyName(companyName);
    setSelectedCompany(normalized);
    selectedCompanyRef.current = normalized;
    setCartDetails((prev) => {
      if (!Array.isArray(prev)) return prev;
      return prev.map((item, idx) =>
        idx === 0
          ? { ...item, company_name: normalized, customer_id: companyId }
          : item,
      );
    });
  };

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

  //get upgrade cart details api
  const [
    getUpgradeCartDetailsApi,
    { isLoading: isGettingUpgradeCartDetailsApi },
  ] = useGetUpgradeAddToCartDetailsMutation();

  const { data: getAllCustomers } = useGetAllCustomersQuery(
    {
      partner_id: userData?.id,
    },
    {
      skip:
        !userData?.id ||
        (!router?.pathname === "/order-summary" &&
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
  console.log(cartDetails?.[0], "cartDetails");

  //aadhar number api
  const [aadharNumberApi, { isLoading: isAadharNumberLoading }] =
    useAadharNumberMutation();

  const [verifyAadharNumberOtp, { isLoading: isVerifyAadharNumberOtpLoading }] =
    useVerifyAadharNumberOtpMutation();

  const handleAddToCart = async () => {
    try {
      const res = await addToCart({
        body: {
          partner_id: userData?.id,
          plan_id: router?.query?.plan_id,
          // licenses: 1,
        },
      });

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

  // const handleUpdateCart = async () => {
  //   try {
  //     const finalDomains =
  //       cartDetails?.[0]?.plan?.provider_id === 2
  //         ? domainNames.map((domain) => `${domain?.prefix}${DOMAIN_SUFFIX}`)
  //         : domainNames.map((domain) => domain?.prefix);
  //     const main_cart_id = resolveMainCartId(cartDetails, cartData);
  //     if (!main_cart_id) return;

  //     const res = await updateCart({
  //       body: {
  //         main_cart_id,
  //         licenses: lisceneCounter,
  //         domain_name: finalDomains,
  //         company_name: normalizeCompanyName(selectedCompany),
  //         customer_id: customerData?.customer_id,
  //       },
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // const handleUpdateCart = async (cart_id) => {
  //   try {
  //     const finalDomains =
  //       cartDetails?.[0]?.plan?.provider_id === 2
  //         ? domainNames.map((domain) => `${domain?.prefix}${DOMAIN_SUFFIX}`)
  //         : domainNames.map((domain) => domain?.prefix);

  //     const main_cart_id = resolveMainCartId(cartDetails, cartData);

  //     if (!main_cart_id) return;

  //     const res = await updateCart({
  //       body: {
  //         cart_id, // 👈 added
  //         main_cart_id,
  //         licenses: lisceneCounter,
  //         domain_name: finalDomains,
  //         company_name: normalizeCompanyName(selectedCompany),
  //         customer_id: customerData?.customer_id,
  //       },
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // const handleUpdateCart = async (cart_id) => {
  //   try {
  //     const currentItem = cartDetails?.find(
  //       (item) => item?.cart_id === cart_id,
  //     );

  //     const finalDomains =
  //       currentItem?.plan?.provider_id === 2
  //         ? domainNames.map((domain) => `${domain?.prefix}${DOMAIN_SUFFIX}`)
  //         : tempDomainNames?.length > 0
  //           ? tempDomainNames
  //           : domainNames.map((domain) => domain?.prefix);

  //     const main_cart_id = resolveMainCartId(cartDetails, cartData);

  //     if (!main_cart_id) return;

  //     await updateCart({
  //       body: {
  //         cart_id,
  //         main_cart_id,
  //         licenses: currentItem?.licenses || lisceneCounter,
  //         domain_name: finalDomains,
  //         company_name: normalizeCompanyName(selectedCompany),
  //         customer_id: customerData?.customer_id,
  //       },
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const handleUpdateCart = async (
    cart_id,
    domainOverride,
    isTransferDomain = false,
  ) => {
    try {
      const currentItem = Array.isArray(cartDetails)
        ? (cartDetails.find((item) => item?.cart_id === cart_id) ??
          cartDetails[0])
        : cartDetails;
      const resolvedCartId = cart_id ?? currentItem?.cart_id;
      if (!resolvedCartId) return;

      const overrideDomains = toDomainArray(domainOverride);
      const newDomains = overrideDomains.length
        ? overrideDomains
        : buildDomainsFromInput(
            domainNames,
            currentItem?.plan?.provider_id,
            DOMAIN_SUFFIX,
          );

      if (!overrideDomains.length && !hasDomainPrefixInput(domainNames)) return;

      const existingDomains = tempDomainNames || [];
      const finalDomains = [...new Set([...existingDomains, ...newDomains])];

      const main_cart_id = resolveMainCartId(cartDetails, cartData);
      if (!main_cart_id) return;

      await updateCart({
        body: {
          cart_id: resolvedCartId,
          main_cart_id,
          licenses: currentItem?.licenses || lisceneCounter,
          domain_name: finalDomains,
          company_name: normalizeCompanyName(
            currentItem?.company_name ?? selectedCompany,
          ),
          customer_id: currentItem?.customer_id ?? customerData?.customer_id,
          transfer_domain: isTransferDomain ? "yes" : "no",
        },
      });

      setTempDomainNames(finalDomains);
      tempDomainNamesRef.current = finalDomains;
      setDomainNames([]);
      setCartDetails((prev) => {
        if (!Array.isArray(prev)) {
          return prev?.cart_id ? { ...prev, domain_name: finalDomains } : prev;
        }
        return prev.map((item) => ({ ...item, domain_name: finalDomains }));
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveDomainFromCart = async (updatedDomains) => {
    try {
      const currentItem = Array.isArray(cartDetails)
        ? cartDetails[0]
        : cartDetails;

      const resolvedCartId = currentItem?.cart_id;
      const main_cart_id = resolveMainCartId(cartDetails, cartData);
      if (!resolvedCartId || !main_cart_id) return;

      setTempDomainNames(updatedDomains);
      tempDomainNamesRef.current = updatedDomains;

      setCartDetails((prev) => {
        if (!Array.isArray(prev)) return prev;
        return prev.map((item, idx) =>
          idx === 0 ? { ...item, domain_name: updatedDomains } : item,
        );
      });

      await updateCart({
        body: {
          cart_id: resolvedCartId,
          main_cart_id,
          licenses: currentItem?.licenses || lisceneCounter,
          domain_name: updatedDomains,
          company_name: normalizeCompanyName(
            currentItem?.company_name ?? selectedCompany,
          ),
          customer_id: currentItem?.customer_id ?? customerData?.customer_id,
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
      const initialDomains = [
        ...new Set(allData.flatMap((item) => toDomainArray(item?.domain_name))),
      ];
      setTempDomainNames(initialDomains);
      tempDomainNamesRef.current = initialDomains;
      const loadedCompany = normalizeCompanyName(allData[0]?.company_name);
      if (loadedCompany) {
        setSelectedCompany(loadedCompany);
        selectedCompanyRef.current = loadedCompany;
      }
    } else {
      console.log(res?.data?.message, "res?.data?.message");
    }
  };

  //get upgrade cart details api
  const handleGetUpgradeCartDetails = async () => {
    try {
      const res = await getUpgradeCartDetailsApi({
        body: {
          partner_id: userData?.id,
          customer_id: router?.query?.customer_id,
        },
      });
      if (res?.data?.success) {
        const data = res?.data?.data;
        setCartDetails(data);
      } else {
        console.log(res?.data?.message, "res?.data?.message");
      }
    } catch (error) {}
  };

  //handle aadhar number
  const handleAadharNumber = async () => {
    try {
      const main_cart_id = resolveMainCartId(cartDetails, cartData);

      const res = await aadharNumberApi({
        body: {
          main_cart_id: main_cart_id,
          aadhaar_number: aadharNumber,
          customer_id: cartDetails?.[0]?.customer_id,
        },
      });
      if (res?.data?.success) {
        router.push({
          pathname: "/verify-otp",
          query: {
            type: "order",
            main_cart_id: main_cart_id,
          },
        });
      } else {
        showToast(res?.error?.data?.message, "error");
      }
    } catch (error) {
      console.log(error, "error");
      showToast("Failed to verify aadhar number", "error");
    }
  };

  const isDataLoading =
    isGettingCartDetailsApi ||
    isGettingUpgradeCartDetailsApi ||
    isRenewingCustomerDetails ||
    isGettingCartDetails;
  useEffect(() => {
    if (router?.query?.plan_id && router?.query?.variant) {
      handleAddToCart();
    }
  }, []);

  // useEffect(() => {
  //   if (Array.isArray(cartDetails)) return undefined;
  //   if (!resolveMainCartId(cartDetails, cartData)) return undefined;

  //   const timer = setTimeout(() => {
  //     handleUpdateCart();
  //   }, 1500);

  //   return () => clearTimeout(timer);
  // }, [
  //   cartData?.main_cart_id,
  //   lisceneCounter,
  //   domainNames,
  //   selectedCompany,
  //   cartDetails?.main_cart_id,
  //   cartDetails,
  // ]);

  const cartLicenseKey = Array.isArray(cartDetails)
    ? cartDetails
        .map((item) => `${item?.cart_id ?? ""}:${item?.licenses ?? ""}`)
        .join("|")
    : "";

  useEffect(() => {
    if (!Array.isArray(cartDetails) || cartDetails.length === 0)
      return undefined;

    const timer = setTimeout(() => {
      cartDetails.forEach((item, idx) => {
        if (!item?.main_cart_id) return;

        const body = buildAutoUpdateCartBody({
          item,
          itemIndex: idx,
          selectedCompany: selectedCompanyRef.current,
          tempDomains: tempDomainNamesRef.current,
          customerId: customerData?.customer_id,
        });

        updateCart({ body });
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [cartLicenseKey, selectedCompany, customerData?.customer_id]);

  useEffect(() => {
    if (router?.query?.type === "renew-plan" && router?.query?.order_id) {
      handleRenewCustomerDetails();
    }
  }, [router?.query?.type, router?.query?.order_id]);

  useEffect(() => {
    if (getUpdateCartDetails?.success) {
      const data = getUpdateCartDetails?.data;

      if (!data) return;
      setCartDetails({
        ...data,
        plan_name: data?.plan_name,
        domain_name: data?.domain_name,
        subscription_start_date: data?.created_at,
        subscription_end_date: data?.end_date,
        customerLimit: data?.customerLimit,
      });
      setPricePerUser(Number(data?.unit_price) || 0);
      dispatch(setCartData(data));
      setLisceneCounter(data?.licenses || 1);
      setDomainNames([]);
      const loadedDomains = toDomainArray(data?.domain_name);
      setTempDomainNames(loadedDomains);
      tempDomainNamesRef.current = loadedDomains;
      const loadedCompany = normalizeCompanyName(data?.company_name);
      setSelectedCompany(loadedCompany);
      selectedCompanyRef.current = loadedCompany;
    }
  }, [getUpdateCartDetails, router?.query?.plan_id, dispatch]);

  //cart api — skip when plan_id is present; getUpdateCartDetails already loads that cart
  useEffect(() => {
    if (!userData?.id || !router?.isReady) return;
    if (router?.query?.type === "renew-plan") return;
    if (router?.query?.type === "upgrade") return;
    handleGetCartDetails();
  }, [userData?.id, router?.isReady, router?.query?.type]);

  //get upgrade cart details api
  useEffect(() => {
    if (router?.query?.type === "upgrade" && router?.query?.customer_id) {
      handleGetUpgradeCartDetails();
    }
  }, [router?.query?.type, router?.query?.customer_id]);

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
      {isDataLoading ? (
        <Loader />
      ) : (
          Array.isArray(cartDetails)
            ? cartDetails.length
            : Object.keys(cartDetails || {}).length
        ) ? (
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
              onCompanyChange={handleCompanyChange}
              domainNames={domainNames}
              setDomainNames={setDomainNames}
              isGettingCartDetails={
                isGettingCartDetailsApi ||
                isGettingUpgradeCartDetailsApi ||
                isRenewingCustomerDetails ||
                isGettingCartDetails
              }
              // hideInlineSubtotal={
              //   router?.query?.type === "upgrade" ? false : true
              // }
              isPopupOpen={isPopupOpen}
              setIsPopupOpen={setIsPopupOpen}
              tempDomainNames={tempDomainNames}
              setTempDomainNames={setTempDomainNames}
              onRemoveDomain={handleRemoveDomainFromCart}
            />
          </div>
          <aside className={layoutStyles.rightSticky}>
            <OrderSummaryCard
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
              cartDetails={cartDetails}
              handleUpdateCart={handleUpdateCart}
              setDomainNames={setDomainNames}
              domainNames={domainNames}
              domainSuffix={DOMAIN_SUFFIX}
              isPopupOpen={isPopupOpen}
              setIsPopupOpen={setIsPopupOpen}
              tempDomainNames={tempDomainNames}
              aadharNumber={aadharNumber}
              setAadharNumber={setAadharNumber}
              selectedCompany={selectedCompany}
              transferCode={transferCode}
              setTransferCode={setTransferCode}
              handleAadharNumber={handleAadharNumber}
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
