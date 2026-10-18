"use client";

import { useEffect, useState } from "react";
import styles from "./CookieConsent.module.scss";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";

const STORAGE_KEY = "hasAcceptedCookies";

const CookieConsent = () => {
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    const storedConsent = localStorage.getItem(STORAGE_KEY);
    if (storedConsent) setConsent(JSON.parse(storedConsent));
  }, []);

  const saveConsent = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(true));
    setConsent(true);
  };

  if (consent) return null;

  return (
    <motion.div
      className={styles.banner}
      role="dialog"
      aria-live="polite"
      initial={{
        opacity: 0,
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
      }}
      animate={{
        opacity: 1,
        bottom: 10,
        left: "50%",
        transform: "translateX(-50%)",
      }}
      transition={{
        duration: 0.5,
        type: "spring",
        delay: 1,
      }}
      exit={{
        opacity: 0,
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      <p>
        We use essential cookies for site functionality and optional cookies for
        analytics. By continuing to use our site, you consent to our use of
        cookies. You can manage your preferences at any time. For more details,
        please see our{" "}
        <Link href="/privacy" target="_blank" rel="noopener noreferrer">
          Privacy Policy
        </Link>
        .
      </p>
      <button className={styles.btn} onClick={saveConsent}>
        Accept-all
      </button>
    </motion.div>
  );
};

export default CookieConsent;
