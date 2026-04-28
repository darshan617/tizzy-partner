import styles from "@/components/auth/authLayout/AuthLayout.module.css";
import Image from "next/image";
import signupImage from "@/assets/signup/signupImg.png";
import signupLogo from "@/assets/signup/signupLogo.png";

export default function AuthLayout({ children }) {
  return (
    <div className={styles.authWrapper}>
      <div className={styles.authContainer}>
        <div className={styles.formSection}>
          <div className={styles.logoWrapper}>
            <div className={styles.logoContainer}>
              <Image src={signupLogo} alt="Logo" className={styles.logo} />
            </div>
          </div>

          <div className={styles.formContent}>{children}</div>

          <div className={styles.copyright}>
            <p>&copy; 2026 Tizzy Group. All rights reserved.</p>
          </div>
        </div>

        <div className={styles.imageSection}>
          <Image
            src={signupImage}
            alt="Auth Background"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
    </div>
  );
}
