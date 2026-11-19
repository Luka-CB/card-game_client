"use client";

import { useEffect, useState } from "react";
import { FaGooglePlay, FaTimes } from "react-icons/fa";
import { useTranslations } from "next-intl";
import styles from "./AppAvailability.module.scss";

const STORAGE_KEY = "joker-clash-app-notice-dismissed";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.luka_cb.joker_native";

export default function AppAvailability() {
  const t = useTranslations("AppAvailability");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(localStorage.getItem(STORAGE_KEY) !== "true");
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside className={styles.notice} aria-label={t("title")}>
      <div className={styles.message}>
        <span className={styles.icon} aria-hidden="true">
          <FaGooglePlay />
        </span>
        <div>
          <p className={styles.title}>{t("title")}</p>
          <p className={styles.description}>{t("description")}</p>
        </div>
      </div>
      <a
        className={styles.link}
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t("cta")}
      </a>
      <button
        className={styles.close}
        type="button"
        onClick={dismiss}
        aria-label={t("dismiss")}
        title={t("dismiss")}
      >
        <FaTimes aria-hidden="true" />
      </button>
    </aside>
  );
}
