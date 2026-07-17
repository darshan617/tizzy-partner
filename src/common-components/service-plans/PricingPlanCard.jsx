import { useState } from "react";
import CustomPopup from "../custom-popup/CustomPopup";
import styles from "./PricingPlanCard.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsPopupVisible,
  setIsPopupVisible,
} from "@/redux/slices/popupSlice";
import { FaRegQuestionCircle } from "react-icons/fa";
import { useGetEnqueryNowMutation } from "@/redux/apis/servicesApi";
import { useToast } from "@/custom-hooks/toast/ToastProvider";
import Cookies from "js-cookie";

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
  hasgoogleplans,
}) {
  const router = useRouter();
  const isPopupVisible = useSelector(selectIsPopupVisible);
  const dispatch = useDispatch();
  const showDiscount =
    typeof discountPercent === "number" && discountPercent > 0;

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const isPlanChangeFlow =
    router?.query?.type === "upgrade" || router?.query?.type === "downgrade";
  const hasGooglePlanConflict =
    Number(provider_id) === 3 && Boolean(hasgoogleplans) && !plan_is_in_cart;

  const { showToast } = useToast();
  const [getEnqueryNow, { isLoading: isEnqueryNowLoading }] =
    useGetEnqueryNowMutation();
  const userData = Cookies.get("userData")
    ? JSON.parse(Cookies.get("userData"))
    : null;

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const message = formData.get("message");
    const response = await getEnqueryNow({
      body: {
        partner_id: userData?.id,
        message,
      },
    });
    if (response.data) {
      showToast("Enquiry submitted successfully", "success");
      dispatch(setIsPopupVisible(""));
    } else {
      showToast("Enquiry submission failed", "error");
      dispatch(setIsPopupVisible(""));
    }
  };

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
            <span className={styles.price}>
              {priceLabel === "₹0.00"
                ? "Contact Sales For Pricing"
                : priceLabel}
            </span>
          </div>
          {periodNote && priceLabel !== "₹0.00" ? (
            <div className={styles.periodNote}>{periodNote}</div>
          ) : (
            <br />
          )}
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
            if (hasGooglePlanConflict && !isPlanChangeFlow) {
              setIsPopupOpen(true);
              return;
            }
            if (isProviderInCart === false || isPlanChangeFlow) {
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
          <div className="d-flex">
            <h3 className="fs-5 fw-600 mb-3 pb-3">
              We're here to help. Send us your enquiry.
            </h3>
            <FaRegQuestionCircle size={22} style={{ marginLeft: "10px" }} />
          </div>
          <form onSubmit={handleEnquirySubmit}>
            <div className="form-group">
              <textarea
                className={styles.enquiryTextarea}
                id="message"
                name="message"
                placeholder="Enter your enquiry"
                required
                rows="5"
              />
              <div className="d-flex justify-content-end gap-2 pt-3">
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isEnqueryNowLoading}
                >
                  {isEnqueryNowLoading ? "Submitting..." : "Submit"}
                </button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => dispatch(setIsPopupVisible(""))}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </CustomPopup>
      )}

      {isPopupOpen && (isProviderInCart === true || hasGooglePlanConflict) && (
        <CustomPopup onClose={() => setIsPopupOpen(false)} maxWidth="450px">
          <h3 className="fs-5 fw-600 mb-3 border-bottom pb-3">
            {provider_id === 3 && hasgoogleplans
              ? "You can add only one Google Cloud Partner Plan"
              : "Some plans are already in your cart"}
          </h3>
          <p>
            {provider_id === 3 && hasgoogleplans
              ? "You can only add one Google Cloud Partner plan to your cart at a time. Please remove the existing Google Cloud Partner plan before adding a different one."
              : " Please remove the plans from the cart to add a new one"}
          </p>
        </CustomPopup>
      )}
    </article>
  );
}
