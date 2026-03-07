"use client";

import { useEffect, useState } from "react";
import styles from "./CookieConsent.module.scss";
import { motion } from "framer-motion";

type Consent = "accepted" | "rejected" | null;

const STORAGE_KEY = "cookie_consent_v1";

const CookieConsent = () => {
  const [consent, setConsent] = useState<Consent>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Consent;
    if (saved === "accepted" || saved === "rejected") setConsent(saved);
  }, []);

  const saveConsent = (value: Exclude<Consent, null>) => {
    localStorage.setItem(STORAGE_KEY, value);
    setConsent(value);
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
        bottom: 50,
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
        analytics. You can accept or reject optional cookies.
      </p>
      <div className={styles.actions}>
        <button
          onClick={() => saveConsent("rejected")}
          className={styles.reject}
        >
          Reject Non-essential
        </button>
        <button
          onClick={() => saveConsent("accepted")}
          className={styles.accept}
        >
          Accept All
        </button>
      </div>
    </motion.div>
  );
};

export default CookieConsent;
