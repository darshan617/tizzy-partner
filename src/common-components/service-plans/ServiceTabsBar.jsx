import Link from "next/link";
import styles from "./ServicePlans.module.css";
import { BiSearch } from "react-icons/bi";
import { useRouter } from "next/router";
import { IoIosInformationCircleOutline } from "react-icons/io";

export default function ServiceTabsBar({
  activeSlug,
  searchPlaceholder = "Search plan",
  searchValue,
  onSearchChange,
  providers,
}) {
  const router = useRouter();
  return (
    <div className={styles.navCard}>
      {router?.query?.type ? (
        <div>
          <p className="text-muted m-0">Current Active Plan</p>
          <div className="d-flex gap-4">
            <p className="fw-bold m-0">Tizzy® Mail Enterprise 100 GB</p>
            <p
              className="m-0 px-1 d-flex align-items-center rounded-1"
              style={{ background: "#E6F6FB" }}
            >
              Remaining : <b>128 days</b> | <b>₹4524.25</b>
              <span className="ps-2">
                <IoIosInformationCircleOutline />{" "}
              </span>
            </p>
          </div>
        </div>
      ) : (
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
      )}

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
