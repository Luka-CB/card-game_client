"use client";

import styles from "./Header.module.scss";
import { TiThMenu } from "react-icons/ti";
import useWindowSize from "@/hooks/useWindowSize";
import MainNav from "./MainNav";
import Link from "next/link";
import Avatar from "./Avatar";
import useNavStore from "@/store/navStore";
import useRatingStore from "@/store/user/stats/ratingStore";
import useJCoinsStore from "@/store/user/stats/jCoinsStore";
import { useEffect } from "react";
import useUserStore from "@/store/user/userStore";

const Header = () => {
  const { toggleNav } = useNavStore();
  const windowSize = useWindowSize();
  const { user } = useUserStore();
  const { fetchJCoins, jCoins, toggleGetMoreModal } = useJCoinsStore();
  const { fetchRating, rating } = useRatingStore();

  useEffect(() => {
    if (user && !jCoins) {
      fetchJCoins();
    }
  }, [user, jCoins, fetchJCoins]);

  useEffect(() => {
    if (user && !rating) {
      fetchRating();
    }
  }, [user, rating, fetchRating]);

  return (
    <div className={styles.header_container}>
      <div className={styles.logo}>
        <Link href="/">
          <h1>LOGO</h1>
        </Link>
      </div>

      {windowSize.width <= 700 ? (
        <nav>
          <Avatar />
          <button className={styles.menu_btn} onClick={() => toggleNav()}>
            <TiThMenu className={styles.menu_icon} />
          </button>
        </nav>
      ) : (
        <MainNav
          jCoins={jCoins as { value: string; raw: number } | null}
          rating={
            rating as { value: number; trend: "up" | "down" | "stable" } | null
          }
          toggleGetMoreModal={toggleGetMoreModal}
        />
      )}
    </div>
  );
};

export default Header;
