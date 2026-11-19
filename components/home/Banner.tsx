"use client";

import Image from "next/image";
import styles from "./Banner.module.scss";
import useUserStore from "@/store/user/userStore";
import localFont from "next/font/local";
import { useTranslations } from "next-intl";
import { FaGooglePlay } from "react-icons/fa";

const bytesized = localFont({
  src: "../../public/fonts/Bytesized-Regular.ttf",
  variable: "--font-bytesized",
  display: "swap",
});
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.luka_cb.joker_native";

const Banner = () => {
  const t = useTranslations("HomePage.banner");
  const appT = useTranslations("AppAvailability");

  const { user, usersOnline } = useUserStore();

  return (
    <div className={styles.banner}>
      <Image
        src="/banner-img.jpg"
        alt="banner image"
        fill
        priority
        className={styles.image}
      />
      <div className={styles.border}></div>
      <a
        className={styles.app_link}
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaGooglePlay aria-hidden="true" />
        <span>{appT("launcher")}</span>
      </a>
      <div className={styles.user_count}>
        {usersOnline.length > 500 && user?.isAdmin && (
          <div className={styles.online}>
            <div className={styles.dot}></div>
            <small>{t("online")}</small>
            <span>{usersOnline?.length || 0}</span>
          </div>
        )}
        {user && user?.isAdmin && (
          <div className={styles.total}>
            <div className={styles.dot}></div>
            <small>{t("total")}</small>
            <span>15079</span>
          </div>
        )}
      </div>
      <div className={styles.glitch_wrapper}>
        <div className={styles.hero_text}>
          <div
            className={`${styles.glitch} ${bytesized.className}`}
            data-glitch="Joker Clash"
          >
            Joker Clash
          </div>
          <p className={styles.subtitle}>{t("subtitle")}</p>
        </div>
      </div>
    </div>
  );
};

export default Banner;
