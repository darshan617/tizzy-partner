import { useSelector } from "react-redux";
import Loader from "../Loader";
import styles from "./ServicePlans.module.css";
import {
  selectCategories,
  selectSubCategories,
} from "@/redux/slices/servicesSlice";

export default function PlanCategoryPills({
  activeId,
  activeSubId,
  onSelectCategory,
  onSelectSubCategory,
  isLoading,
}) {
  const categories = useSelector(selectCategories);
  const subCategories = useSelector(selectSubCategories);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div
            className={styles.pillsRow}
            role="tablist"
            aria-label="Plan categories"
          >
            {categories.map((cat) => {
              const active = cat.id === activeId;
              return (
                <button
                  key={cat?.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`${styles.pill} ${active ? styles.pillActive : ""}`}
                  onClick={() => onSelectCategory(cat)}
                >
                  {cat?.name}
                </button>
              );
            })}
          </div>
          {subCategories.length > 0 && (
            <div
              className={styles.pillsRow}
              role="tablist"
              aria-label="Plan subcategories"
            >
              {subCategories.map((subCat) => {
                const active = subCat.id === activeSubId;
                return (
                  <button
                    key={subCat?.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    className={`${styles.pill} ${active ? styles.pillActive : ""}`}
                    onClick={() => onSelectSubCategory(subCat)}
                  >
                    {subCat?.name}
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}
    </>
  );
}
