"use client";

import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimesCircle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import styles from "./GuestModal.module.scss";
import useGuestModalStore from "@/store/gamePage/guestModalStore";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";

const googleUrl =
  process.env.NEXT_PUBLIC_GOOGLE_URL ||
  "http://localhost:5000/api/oauth/login/google";

const GuestModal = () => {
  const t = useTranslations("GamePage.guestModal");
  const locale = useLocale();

  const richStrong = (chunks: React.ReactNode) => <strong>{chunks}</strong>;

  const { isOpen, closeGuestModal } = useGuestModalStore();
  const pathname = usePathname();
  const router = useRouter();

  const handleSignin = () => {
    closeGuestModal();
    router.push(`${pathname}?auth=signin`);
  };

  const handleSignup = () => {
    closeGuestModal();
    router.push(`${pathname}?auth=signup`);
  };

  const handleGoogle = () => {
    closeGuestModal();
    window.open(googleUrl, "_self");
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.08 }}
          onClick={closeGuestModal}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            onClick={(e) => e.stopPropagation()}
            data-locale={locale}
          >
            <FaTimesCircle
              className={styles.close_icon}
              onClick={closeGuestModal}
            />

            <h2 className={styles.title}>{t("title")}</h2>

            <p className={styles.description}>
              {t.rich("description", { strong: richStrong })}
            </p>

            <div className={styles.restrictions}>
              <strong>{t("restrictions.label")}</strong>
              <ul>
                <li>{t("restrictions.liOne")}</li>
                <li>{t("restrictions.liTwo")}</li>
                <li>{t("restrictions.liThree")}</li>
              </ul>
            </div>

            <p className={styles.benefits}>
              {t.rich("benefits", { strong: richStrong })}
            </p>

            <div className={styles.divider}>
              <div className={styles.line} />
              <span>{t("or")}</span>
              <div className={styles.line} />
            </div>

            <div className={styles.actions}>
              <button className={styles.signin_btn} onClick={handleSignin}>
                {t("signin")}
              </button>
              <button className={styles.signup_btn} onClick={handleSignup}>
                {t("signup")}
              </button>
              <button className={styles.google_btn} onClick={handleGoogle}>
                <FcGoogle className={styles.google_icon} />
                <span>{t("google")}</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default GuestModal;
