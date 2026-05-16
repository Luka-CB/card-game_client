"use client";

import styles from "./Header.module.scss";
import { TiThMenu } from "react-icons/ti";
import useWindowSize from "@/hooks/useWindowSize";
import MainNav from "./MainNav";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Avatar from "./Avatar";
import useNavStore from "@/store/navStore";
import useRatingStore from "@/store/user/stats/ratingStore";
import useJCoinsStore from "@/store/user/stats/jCoinsStore";
import { useEffect } from "react";
import useUserStore from "@/store/user/userStore";
import SideNav from "./SideNav";
import Image from "next/image";
import LanguageSwitcher from "../LanguageSwitcher";

const Header = () => {
  const t = useTranslations("Header");

  const { toggleNav } = useNavStore();
  const windowSize = useWindowSize();
  const { user } = useUserStore();
  const { jCoins, toggleGetMoreModal } = useJCoinsStore();
  const { fetchRating, rating, clearRating } = useRatingStore();

  useEffect(() => {
    if (!user || user.isGuest) {
      clearRating();
      return;
    }

    if (!rating) {
      fetchRating();
    }
  }, [user, rating, fetchRating, clearRating]);

  const handleOpenGetMoreModal = () => {
    toggleGetMoreModal();
    toggleNav(false);
  };

  return (
    <>
      <div className={styles.header_container}>
        <div className={styles.logo}>
          <Link href="/">
            <Image
              src="/logos/title-logo.png"
              alt="Joker Clash Logo"
              width={120}
              height={70}
              loading="eager"
              className={styles.logo_image}
            />
          </Link>

          <div className={styles.language_switcher}>
            <LanguageSwitcher />
          </div>
        </div>

        {windowSize.width <= 800 ? (
          <nav>
            {user && user._id ? (
              <>
                <Avatar />
                <button className={styles.menu_btn} onClick={() => toggleNav()}>
                  <TiThMenu className={styles.menu_icon} />
                </button>
              </>
            ) : (
              <div className={styles.auth_links}>
                <Link href="/?auth=signin">{t("signIn")}</Link>
                <div className={styles.divider}>|</div>
                <Link href="/?auth=signup">{t("signUp")}</Link>
              </div>
            )}
          </nav>
        ) : (
          <MainNav
            jCoins={jCoins as { value: string; raw: number } | null}
            rating={
              rating as {
                value: number;
                trend: "up" | "down" | "stable";
              } | null
            }
            onOpenGetMoreModal={handleOpenGetMoreModal}
          />
        )}
      </div>
      <SideNav
        jCoins={jCoins as { value: string; raw: number } | null}
        rating={
          rating as {
            value: number;
            trend: "up" | "down" | "stable";
          } | null
        }
        onOpenGetMoreModal={handleOpenGetMoreModal}
      />
    </>
  );
};

export default Header;
