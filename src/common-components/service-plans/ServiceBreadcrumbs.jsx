import Link from "next/link";
import styles from "./ServicePlans.module.css";

/**
 * @param {{ items: { label: string; href?: string }[] }} props
 */
export default function ServiceBreadcrumbs({ items }) {
  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
            {index > 0 && <span className={styles.separator}>/</span>}
            {item.href && !isLast ? (
              <Link href={item.href} className={styles.breadcrumbLink}>
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? styles.crumbCurrent : undefined}>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
