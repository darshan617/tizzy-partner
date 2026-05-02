import styles from "./ServicePageLayout.module.css";

export default function ServicePageLayout({ header, children }) {
  return (
    <div className={styles.root}>
      <div className={styles.header}>{header}</div>
      <div className={styles.scroll}>{children}</div>
    </div>
  );
}
