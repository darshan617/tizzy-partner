import styles from "./PricingPlanCard.module.css";

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
}) {
  const showDiscount =
    typeof discountPercent === "number" && discountPercent > 0;

  return (
    <article className={styles.card}>
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

        <button type="button" className={styles.cta} onClick={onCtaClick}>
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
    </article>
  );
}
