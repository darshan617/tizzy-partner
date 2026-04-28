import styles from "@/components/auth/authLayout/AuthLayout.module.css";
import Image from "next/image";
import signupImage from "@/assets/signup/signupImg.png";
import signupLogo from "@/assets/signup/signupLogo.png";
import { useRouter } from "next/router";
import MascotBodyImg from "@/assets/login/mascotBodyImg.png";
import MascothandImg from "@/assets/login/mascothandImg.png";

export default function AuthLayout({ children }) {
  const router = useRouter();
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

          {router.pathname === "/auth/login" && (
            <>
              <Image
                src={MascotBodyImg}
                alt="Mascot Body"
                className={styles.mascotBody}
                draggable={false}
              />
              <Image
                src={MascothandImg}
                alt="Mascot Hand"
                className={styles.mascotHand}
                draggable={false}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
