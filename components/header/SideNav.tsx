"use client";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import styles from "./SideNav.module.scss";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import useNavStore from "@/store/navStore";
import useWindowSize from "@/hooks/useWindowSize";
import { TfiStatsDown, TfiStatsUp, TfiClose } from "react-icons/tfi";
import { PiChartLineLight } from "react-icons/pi";
import { IoIosLogOut } from "react-icons/io";
import useUserStore from "@/store/user/userStore";
import useLogoutStore from "@/store/auth/logoutStore";
import BtnLoader from "../loaders/BtnLoader";
import { useTranslations } from "next-intl";

interface SideNavProps {
  jCoins: { value: string; raw: number } | null;
  rating: {
    value: number;
    trend: "up" | "down" | "stable";
  } | null;
  onOpenGetMoreModal: () => void;
}

const SideNav: React.FC<SideNavProps> = ({
  jCoins,
  rating,
  onOpenGetMoreModal,
}) => {
  const t = useTranslations("Header");
  const l = useTranslations("Links");

  const pathname = usePathname();
  const router = useRouter();
  const { toggleNav, isNavOpen } = useNavStore();
  const { status, logout } = useLogoutStore();

  const { user } = useUserStore();

  const windowSize = useWindowSize();

  const handleLogout = async (mode: "signin" | "signup") => {
    const ok = await logout();

    if (ok) {
      toggleNav();
      router.push(`/?auth=${mode}`);
    }
  };

  return (
    <AnimatePresence>
      {isNavOpen && windowSize.width <= 800 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={styles.bg}
          onClick={() => toggleNav()}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              duration: 0.2,
            }}
            className={styles.side_nav}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.user}>
              <div className={styles.avatar}>
                <div className={styles.image}>
                  <Image
                    src={user?.avatar || "/images/avatar.png"}
                    alt="avatar"
                    width={40}
                    height={40}
                    className={styles.avatar_img}
                  />
                </div>
                <span>{user?.username || "Username"}</span>
              </div>
              <div className={styles.auth_links}>
                <span
                  className={styles.auth_link}
                  onClick={() => handleLogout("signin")}
                >
                  Sign in
                </span>
                <div className={styles.auth_divider}></div>
                <span
                  className={styles.auth_link}
                  onClick={() => handleLogout("signup")}
                >
                  Sign up
                </span>
              </div>
              {!user?.isGuest && (
                <div className={styles.stats}>
                  <div className={styles.rating}>
                    {rating?.trend === "up" && (
                      <TfiStatsUp className={styles.up_rating_icon} />
                    )}
                    {rating?.trend === "down" && (
                      <TfiStatsDown className={styles.down_rating_icon} />
                    )}
                    {rating?.trend === "stable" && (
                      <PiChartLineLight className={styles.stable_rating_icon} />
                    )}
                    <span
                      className={
                        rating && rating.trend === "up"
                          ? styles.up_rating_value
                          : rating && rating.trend === "down"
                            ? styles.down_rating_value
                            : styles.stable_rating_value
                      }
                    >
                      {rating !== null ? rating.value : "0"}
                    </span>
                  </div>
                  <div className={styles.coins} onClick={onOpenGetMoreModal}>
                    <Image
                      src="/coin1.png"
                      alt="coin"
                      width={40}
                      height={40}
                      className={styles.coin_img}
                    />
                    <span
                      className={
                        jCoins && jCoins.raw < 0
                          ? styles.negative_coins
                          : jCoins && jCoins.raw >= 0 && jCoins.raw < 100
                            ? styles.warning_value
                            : styles.coins_value
                      }
                    >
                      {jCoins !== null ? jCoins.value : "0"}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <hr />
            <nav>
              <ul>
                <Link
                  href="/"
                  className={pathname === "/" ? styles.active : undefined}
                  onClick={() => toggleNav()}
                >
                  {l("home")}
                </Link>

                <Link
                  href="/rooms"
                  className={pathname === "/rooms" ? styles.active : undefined}
                  onClick={() => toggleNav()}
                >
                  {l("lobby")}
                </Link>

                {!user?.isGuest && (
                  <Link
                    href="/account"
                    className={
                      pathname === "/account" ? styles.active : undefined
                    }
                    onClick={() => toggleNav()}
                  >
                    {l("account")}
                  </Link>
                )}
                <Link
                  href="/rules"
                  className={pathname === "/rules" ? styles.active : undefined}
                  onClick={() => toggleNav()}
                >
                  {l("rules")}
                </Link>
                <Link
                  href="/about"
                  className={pathname === "/about" ? styles.active : undefined}
                  onClick={() => toggleNav()}
                >
                  {l("about")}
                </Link>
                <Link
                  href="/terms"
                  className={pathname === "/terms" ? styles.active : undefined}
                  onClick={() => toggleNav()}
                >
                  {l("terms")}
                </Link>
                <Link
                  href="/privacy"
                  className={
                    pathname === "/privacy" ? styles.active : undefined
                  }
                  onClick={() => toggleNav()}
                >
                  {l("privacy")}
                </Link>
                <Link
                  href="/data-deletion"
                  className={
                    pathname === "/data-deletion" ? styles.active : undefined
                  }
                  onClick={() => toggleNav()}
                >
                  {l("dataDeletion")}
                </Link>
                {!user?.isGuest && (
                  <Link
                    href="/feedback"
                    className={
                      pathname === "/feedback" ? styles.active : undefined
                    }
                    onClick={() => toggleNav()}
                  >
                    {l("feedback")}
                  </Link>
                )}
              </ul>
            </nav>
            <hr />
            <div className={styles.logout}>
              <button
                className={styles.logout_btn}
                onClick={() => handleLogout("signin")}
              >
                {status === "loading" ? (
                  <BtnLoader />
                ) : (
                  <>
                    <span>{l("logout")}</span>
                    <IoIosLogOut className={styles.logout_icon} />
                  </>
                )}
              </button>
            </div>
            <button className={styles.close_btn} onClick={() => toggleNav()}>
              <span>{t("close")}</span>
              <TfiClose className={styles.close_icon} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SideNav;
