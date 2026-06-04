import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ServicePageLayout,
  ServiceBreadcrumbs,
  ServicePageTitle,
  ServiceTabsBar,
  PlanCategoryPills,
  ServiceIntroBlock,
  PricingPlanCard,
} from "@/common-components/service-plans";
import {
  getServiceCatalogConfig,
  isValidServiceSlug,
  SERVICE_NAV_ITEMS,
} from "@/constants/servicePlansBySlug";
import styles from "@/common-components/service-plans/ServicePlans.module.css";
import {
  useGetPlansMutation,
  useProviderVariantsMutation,
} from "@/redux/apis/servicesApi";
import { useToast } from "@/custom-hooks/toast/ToastProvider";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllPlans,
  setAllPlans,
  setCategories,
  setSubCategories,
} from "@/redux/slices/servicesSlice";
import { useRouter } from "next/router";
import { useLazyUpgradeDowngradePlanQuery } from "@/redux/apis/customerApi";
import { selectCustomerData } from "@/redux/slices/customerSlice";
import Cookies from "js-cookie";
import {
  useAddToCartMutation,
  useGetCartDetailsMutation,
  useUpgradeAddToCartMutation,
} from "@/redux/apis/addToCartApi";
import { setCartData } from "@/redux/slices/cartSlice";

function formatInr(amount) {
  if (typeof amount !== "number" || Number.isNaN(amount)) return "";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ServiceSlugPage({
  slug,
  providers,
  isLoadingProviders,
  isFetchingProviders,
}) {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const router = useRouter();
  console.log(router?.pathname, "router?.pathname");

  const config = slug ? getServiceCatalogConfig(slug) : null;
  const valid = slug && isValidServiceSlug(slug);
  const [searchQuery, setSearchQuery] = useState("");
  const [planDetails, setPlanDetails] = useState(null);
  const [activeCategoryId, setActiveCategoryId] = useState(
    () => config?.defaultCategoryId ?? "",
  );
  const [activeSubCategoryId, setActiveSubCategoryId] = useState(null);

  const userData = Cookies.get("userData")
    ? JSON.parse(Cookies.get("userData"))
    : {};

  const currentProvider = useMemo(() => {
    const list = providers?.data;
    if (!Array.isArray(list) || !slug) return null;
    return list?.find((p) => p?.slug === slug) ?? null;
  }, [providers?.data, slug]);

  const showCategoryPills = currentProvider?.has_variant === "yes";
  const [fetchProviderVariants, { isLoading: isFetchingProviderVariants }] =
    useProviderVariantsMutation();

  const [fetchPlans, { isLoading: isPlansLoading }] = useGetPlansMutation();
  const [
    triggerUpgradeDowngradePlan,
    { isFetching: isUpgradeDowngradeFetching },
  ] = useLazyUpgradeDowngradePlanQuery();

  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

  const [upgradeAddToCart, { isLoading: isUpgradingToCart }] =
    useUpgradeAddToCartMutation();

  const applyCategoryFromVariant = useCallback(
    (cat) => {
      if (!cat) return;
      setActiveCategoryId(cat.id);
      const children = Array.isArray(cat.children) ? cat.children : [];
      dispatch(setSubCategories(children));
      setActiveSubCategoryId(children[0]?.id ?? null);
    },
    [dispatch],
  );

  useEffect(() => {
    if (!config) return;
    setSearchQuery("");
    if (showCategoryPills) {
      setActiveCategoryId("");
      setActiveSubCategoryId(null);
      dispatch(setCategories([]));
      dispatch(setSubCategories([]));
    } else {
      setActiveCategoryId(config.defaultCategoryId);
      setActiveSubCategoryId(null);
      dispatch(setSubCategories([]));
    }
  }, [slug, config, showCategoryPills, dispatch]);

  useEffect(() => {
    if (!showCategoryPills || !currentProvider?.id) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetchProviderVariants({
          body: { provider_id: currentProvider.id },
        });
        if (cancelled) return;
        if (res?.data?.success) {
          const variants = Array.isArray(res?.data?.data?.variants)
            ? res.data.data.variants
            : [];
          dispatch(setCategories(variants));
          if (variants.length > 0) {
            applyCategoryFromVariant(variants[0]);
          } else {
            setActiveCategoryId("");
            dispatch(setSubCategories([]));
            setActiveSubCategoryId(null);
          }
        }
      } catch (error) {
        if (!cancelled) {
          showToast("Error fetching provider variants", "error");
          console.log(error, "error fetching provider variants");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    showCategoryPills,
    currentProvider?.id,
    fetchProviderVariants,
    showToast,
    dispatch,
    applyCategoryFromVariant,
  ]);

  const handleSelectSubCategory = useCallback((sub) => {
    setActiveSubCategoryId(sub?.id ?? null);
  }, []);

  const allPlans = useSelector(selectAllPlans);

  const plansVariantId = useMemo(() => {
    if (!showCategoryPills) return 0;
    if (activeSubCategoryId != null && activeSubCategoryId !== "") {
      return activeSubCategoryId;
    }
    return activeCategoryId || 0;
  }, [showCategoryPills, activeSubCategoryId, activeCategoryId]);

  useEffect(() => {
    dispatch(setAllPlans([]));
  }, [slug, dispatch]);

  useEffect(() => {
    if (!router?.isReady) return;
    if (!currentProvider?.id) return;
    if (
      showCategoryPills &&
      (activeCategoryId === "" || activeCategoryId == null) &&
      activeSubCategoryId == null
    ) {
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        let res;
        const isPlanChangeRequest =
          router?.query?.type === "upgrade" ||
          router?.query?.type === "downgrade";
        const hasOrderId = Boolean(router?.query?.order_id);

        if (isPlanChangeRequest && hasOrderId) {
          res = await triggerUpgradeDowngradePlan({
            type: router?.query?.type,
            plan_id: router?.query?.plan_id,
          });
          if (res?.data?.success) {
            setPlanDetails(res?.data?.data?.current_plan || null);
            dispatch(
              setAllPlans(
                res?.data?.data?.upgrade_plans ||
                  res?.data?.data?.downgrade_plans ||
                  [],
              ),
            );
          } else {
            console.log(res?.error);
          }
        } else {
          res = await fetchPlans({
            body: {
              provider_id: currentProvider.id,
              variant_id: plansVariantId,
              partner_id: userData?.id,
            },
          });
          if (cancelled) return;
          if (res?.data?.success) {
            dispatch(setAllPlans(res?.data?.data?.plans ?? []));
          }
        }
      } catch (error) {
        if (!cancelled) {
          console.log(error, "error fetching plans");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    slug,
    currentProvider?.id,
    plansVariantId,
    showCategoryPills,
    activeCategoryId,
    activeSubCategoryId,
    router?.isReady,
    fetchPlans,
    triggerUpgradeDowngradePlan,
    dispatch,
    router?.query?.type,
    router?.query?.order_id,
  ]);

  const awaitingProviderList =
    Boolean(slug && valid && config) &&
    router?.isReady &&
    !currentProvider?.id &&
    (isLoadingProviders || isFetchingProviders);

  const isPlansSectionLoading =
    awaitingProviderList ||
    (showCategoryPills && isFetchingProviderVariants) ||
    isPlansLoading ||
    isUpgradeDowngradeFetching ||
    isAddingToCart ||
    isUpgradingToCart;

  const filteredPlans = useMemo(() => {
    if (!config?.plans) return [];
    const q = searchQuery.trim().toLowerCase();
    let plans = config.plans;
    if (showCategoryPills) {
      plans = plans.filter((plan) => plan.categoryId === activeCategoryId);
    }
    return plans.filter((plan) => {
      if (!q) return true;
      if (plan.title.toLowerCase().includes(q)) return true;
      return plan.features.some((f) => f.toLowerCase().includes(q));
    });
  }, [config, activeCategoryId, searchQuery, showCategoryPills]);

  const handleAddToCart = useCallback(
    async (planId) => {
      console.log(planId, "planId");
      try {
        const res = await addToCart({
          body: {
            partner_id: userData?.id,
            plan_id: planId,
          },
        });
        if (res?.data?.success) {
          if (router?.query?.type === "upgrade") {
            router.push({
              pathname: "/order-summary",
              query: {
                type: "upgrade",
                plan_id: planId,
              },
            });
          } else {
            router.push("/order-summary");
            showToast("Plan added to cart", "success");
          }
        } else {
          showToast("Error adding plan to cart", "error");
        }
      } catch (error) {
        console.log(error, "error adding to cart");
      }
    },
    [addToCart, router?.query?.slug, router.asPath],
  );

  const handleUpgradeAddToCart = async (planId) => {
    try {
      const res = await upgradeAddToCart({
        body: {
          partner_id: userData?.id,
          plan_id: planId,
          customer_id: router?.query?.customer_id,
          order_id: router?.query?.order_id,
          order_sub_id: router?.query?.order_sub_id,
        },
      });
      if (res?.data?.success) {
        const payload = res?.data?.data;
        dispatch(
          setCartData({
            ...payload,
            wallet_balance: res?.data?.wallet_balance,
          }),
        );
        router.push({
          pathname: "/order-summary",
          query: {
            type: "upgrade",
            customer_id: router?.query?.customer_id,
            order_id: router?.query?.order_id,
            order_sub_id: router?.query?.order_sub_id,
          },
        });
      } else {
        showToast("Error adding plan to cart", "error");
      }
    } catch (error) {
      console.log(error, "error upgrading to cart");
    }
  };

  if (!slug) {
    return <p className={styles.empty}>Loading…</p>;
  }

  if (!valid || !config) {
    return (
      <div className={styles.empty}>
        <p style={{ marginBottom: "0.75rem" }}>
          This service is not available.
        </p>
        <p>
          Go back to{" "}
          <Link href="/dashboard" className="primaryColor">
            Dashboard
          </Link>{" "}
          or choose{" "}
          {SERVICE_NAV_ITEMS.map((item, i) => (
            <span key={item.slug}>
              {i > 0 ? ", " : ""}
              <Link href={item.href} className="primaryColor">
                {item.label}
              </Link>
            </span>
          ))}
          .
        </p>
      </div>
    );
  }

  const header = (
    <>
      <ServiceBreadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Services" },
        ]}
      />
      <ServicePageTitle>{router?.query?.slug}</ServicePageTitle>
      {isLoadingProviders ? (
        "Loading Tabs"
      ) : (
        <ServiceTabsBar
          activeSlug={slug}
          searchPlaceholder={config.searchPlaceholder}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          providers={providers}
          planDetails={planDetails}
        />
      )}

      <ServiceIntroBlock
        headline={config.intro.headline}
        subline={config.intro.subline}
      />
      {showCategoryPills ? (
        <PlanCategoryPills
          activeId={activeCategoryId}
          activeSubId={activeSubCategoryId}
          onSelectCategory={applyCategoryFromVariant}
          onSelectSubCategory={handleSelectSubCategory}
          isLoading={isFetchingProviderVariants}
        />
      ) : null}
    </>
  );

  return (
    <ServicePageLayout header={header}>
      {isPlansSectionLoading ? (
        <p className={styles.loading}>Loading plans…</p>
      ) : allPlans?.length === 0 ? (
        <p className={styles.empty}>No plans match your search or category.</p>
      ) : (
        <div className={styles.grid}>
          {allPlans?.map((plan) => (
            <PricingPlanCard
              key={plan?.plan_id ?? plan?.id}
              plan_id={plan?.plan_id || plan?.id}
              title={plan?.name}
              priceLabel={`₹${plan?.price ?? "0"}`}
              originalPriceLabel={plan?.actual_price ?? ""}
              discountPercent={plan?.discountPercent}
              periodNote={"user/month, paid yearly"}
              gstNote={"GST 18% Additional"}
              features={plan?.features}
              isProviderInCart={plan?.provider_in_cart}
              plan_is_in_cart={plan?.plan_is_in_cart}
              provider_id={plan?.provider_id}
              enquiry={plan?.enquiry}
              hasgoogleplans={plan?.hasgoogleplans}
              onCtaClick={() => {
                if (router?.query?.type === "upgrade") {
                  handleUpgradeAddToCart(plan?.plan_id || plan?.id);
                } else {
                  handleAddToCart(plan?.plan_id || plan?.id);
                  // router.push({
                  //   pathname: `/order-summary`,
                  //   query: {
                  //     plan_id: plan?.plan_id || plan?.id,
                  //     ...(!router?.query?.type && { variant: "new-plan" }),
                  //     ...(router?.query?.type === "upgrade" && {
                  //       variant: "upgrade",
                  //     }),
                  //     ...(router?.query?.type === "downgrade" && {
                  //       variant: "downgrade",
                  //     }),
                  //   },
                  // });
                }
              }}
              ctaLabel={
                router?.query?.type === "upgrade"
                  ? "Upgrade Plan"
                  : router?.query?.slug === "tizzy" ||
                      router?.query?.slug === "microsoft-solution-partner"
                    ? plan?.plan_is_in_cart
                      ? "View Cart"
                      : "Add to Cart"
                    : plan?.plan_is_in_cart
                      ? "View Cart"
                      : plan?.enquiry
                        ? "Enquire Now"
                        : "Buy Plan"
              }
            />
          ))}
        </div>
      )}
    </ServicePageLayout>
  );
}
