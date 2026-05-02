import Link from "next/link";
import styles from "./ServicePlans.module.css";
import { BiSearch } from "react-icons/bi";

export default function ServiceTabsBar({
  activeSlug,
  searchPlaceholder = "Search plan",
  searchValue,
  onSearchChange,
  providers,
}) {
  return (
    <div className={styles.navCard}>
      <div className={styles.tabs} role="tablist" aria-label="Services">
        {providers?.data?.map((tab) => {
          const active = tab?.slug === activeSlug;
          const href = `/services/${tab?.slug}`;
          return (
            <Link
              key={tab?.slug ?? tab?.id}
              href={href}
              className={`${styles.tab} ${active ? styles.tabActive : ""}`}
              role="tab"
              aria-selected={active}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>
      <div className={styles.searchWrap}>
        <input
          type="search"
          className={styles.searchInput}
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label={searchPlaceholder}
        />
        <button
          type="button"
          className={styles.searchBtn}
          aria-hidden
          tabIndex={-1}
        >
          <BiSearch />
        </button>
      </div>
    </div>
  );
}
