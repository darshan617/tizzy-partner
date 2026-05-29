import { useState } from "react";
import CustomPopup from "../custom-popup/CustomPopup";
import styles from "./PricingPlanCard.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsPopupVisible,
  setIsPopupVisible,
} from "@/redux/slices/popupSlice";

function CheckIcon() {
  return (
    <svg className={styles.check} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
      />
    </svg>
  );
}

export default function PricingPlanCard({
  plan_id,
  title,
  headerBg = "#333c4e",
  priceLabel,
  originalPriceLabel,
  discountPercent,
  periodNote,
  gstNote,
  features,
  ctaLabel = "Buy Plan",
  onCtaClick,
  isProviderInCart,
  plan_is_in_cart,
  provider_id,
  enquiry,
}) {
  const router = useRouter();
  const isPopupVisible = useSelector(selectIsPopupVisible);
  const dispatch = useDispatch();
  const showDiscount =
    typeof discountPercent === "number" && discountPercent > 0;

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  console.log(isProviderInCart, "isProviderInCart");
  console.log(isPopupOpen, "isPopupOpen");

  return (
    <article className={styles.card} key={plan_id}>
      <div className={styles.header} style={{ background: headerBg }}>
        <span className={styles.headerTitle}>{title}</span>
      </div>

      <div className={styles.pricingSection}>
        {showDiscount ? (
          <div className={styles.discountRow}>
            <span className={styles.discountBadge}>{discountPercent}% off</span>
          </div>
        ) : null}
        <div className={styles.priceBlock}>
          <div className={styles.priceRow}>
            {originalPriceLabel ? (
              <span className={styles.wasPrice}>{originalPriceLabel}</span>
            ) : null}
            <span className={styles.price}>{priceLabel}</span>
          </div>
          {periodNote ? (
            <div className={styles.periodNote}>{periodNote}</div>
          ) : null}
          {gstNote ? <div className={styles.gstNote}>{gstNote}</div> : null}
        </div>

        <button
          type="button"
          className={styles.cta}
          // onClick={() => {
          //   if (plan_is_in_cart) {
          //     router.push("/order-summary");
          //   } else if (
          //     isProviderInCart === false ||
          //     router?.query?.type === "upgrade"
          //   ) {
          //     onCtaClick();
          //   } else {
          //     setIsPopupOpen(true);
          //   }
          // }}
          onClick={() => {
            if (plan_is_in_cart) {
              router.push("/order-summary");
              return;
            }
            if (enquiry) {
              dispatch(setIsPopupVisible("enquiry"));
              return;
            }

            if (
              isProviderInCart === false ||
              router?.query?.type === "upgrade"
            ) {
              onCtaClick();
              return;
            }

            setIsPopupOpen(true);
          }}
        >
          {ctaLabel}
        </button>
      </div>

      <div className={styles.divider} role="presentation" />

      <ul className={styles.features}>
        {features?.map((line, idx) => (
          <li key={`${idx}-${line}`} className={styles.feature}>
            <CheckIcon />
            <span>{line}</span>
          </li>
        ))}
      </ul>

      {isPopupVisible === "enquiry" && (
        <CustomPopup onClose={() => dispatch(setIsPopupVisible(""))}>
          Enquiry Form will be here
        </CustomPopup>
      )}

      {isPopupOpen && isProviderInCart === true && (
        <CustomPopup onClose={() => setIsPopupOpen(false)} maxWidth="400px">
          <h3 className="fs-5 fw-600 mb-3 border-bottom pb-3">
            {provider_id === 3 && isProviderInCart === true
              ? "You can add only one Google Plan"
              : "Some plans are already in your cart"}
          </h3>
          <p>
            {provider_id === 3 && isProviderInCart === true
              ? "You can only add one Google Workspace plan to your cart at a time. Please remove the existing Google plan before adding a different one."
              : " Please remove the plans from the cart to add a new one"}
          </p>
        </CustomPopup>
      )}
    </article>
  );
}
