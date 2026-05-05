import styles from "./ServicePlans.module.css";

export default function ServicePageTitle({ children }) {
  return <h1 className={styles.pageTitle}>{children?.replaceAll("-", " ")}</h1>;
}
