"use client";

import Image from "next/image";
import styles from "./Banner.module.scss";
import useUserStore from "@/store/user/userStore";
import localFont from "next/font/local";

const bytesized = localFont({
  src: "../../public/fonts/Bytesized-Regular.ttf",
  variable: "--font-bytesized",
  display: "swap",
});

const Banner = () => {
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
      <div className={styles.user_count}>
        <div className={styles.online}>
          <div className={styles.dot}></div>
          <small>online</small>
          <span>{usersOnline?.length || 0}</span>
        </div>
        {user && user?.isAdmin && (
          <div className={styles.total}>
            <div className={styles.dot}></div>
            <small>total</small>
            <span>15079</span>
          </div>
        )}
      </div>
      <div className={styles.glitch_wrapper}>
        <div
          className={`${styles.glitch} ${bytesized.className}`}
          data-glitch="Joker Clash"
        >
          Joker Clash
        </div>
      </div>
    </div>
  );
};

export default Banner;
