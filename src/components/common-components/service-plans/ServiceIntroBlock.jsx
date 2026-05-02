import styles from "./ServicePlans.module.css";

export default function ServiceIntroBlock({ headline, subline }) {
  const lines = Array.isArray(headline)
    ? headline
    : headline != null && headline !== ""
      ? [headline]
      : [];

  return (
    <div className={styles.intro}>
      {lines.length > 0 ? (
        <p className={styles.introHeadline}>
          {lines?.map((line, i) => (
            <span key={i}>
              {i > 0 ? <br /> : null}
              {line}
            </span>
          ))}
        </p>
      ) : null}
      {subline ? <p className={styles.introSub}>{subline}</p> : null}
    </div>
  );
}
