import useUserStore from "@/store/user/userStore";
import styles from "./MainNav.module.scss";
import { usePathname, useRouter, Link } from "@/i18n/navigation";
import { TfiStatsDown, TfiStatsUp } from "react-icons/tfi";
import { PiChartLineLight } from "react-icons/pi";
import { SiAirtable } from "react-icons/si";
import { TbReport } from "react-icons/tb";
import { MdManageAccounts } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import Image from "next/image";
import Avatar from "./Avatar";
import useLogoutStore from "@/store/auth/logoutStore";
import { useLocale, useTranslations } from "next-intl";

interface MainNavProps {
  jCoins: {
    value: string;
    raw: number;
  } | null;
  rating: {
    value: number;
    trend: "up" | "down" | "stable";
  } | null;
  onOpenGetMoreModal: () => void;
}

const MainNav: React.FC<MainNavProps> = ({
  jCoins,
  rating,
  onOpenGetMoreModal,
}) => {
  const t = useTranslations("Header");
  const l = useTranslations("Links");
  const locale = useLocale();

  const { user } = useUserStore();
  const { logout } = useLogoutStore();
  const router = useRouter();

  const pathname = usePathname();

  const handleLogout = async () => {
    const ok = await logout();

    if (ok) {
      router.push("/?auth=signin");
    }
  };

  return (
    <header className={styles.main_nav} data-locale={locale}>
      <nav>
        {user && user._id ? (
          <ul>
            <div
              className={
                pathname === "/rooms" ? styles.link_active : styles.link
              }
            >
              <SiAirtable className={styles.icon} />
              <Link href="/rooms">{l("lobby")}</Link>
            </div>
            {user.isGuest && (
              <div className={styles.auth_links_guest}>
                <span className={styles.auth_link} onClick={handleLogout}>
                  {t("signIn")}
                </span>
                <div className={styles.auth_divider}></div>
                <span className={styles.auth_link} onClick={handleLogout}>
                  {t("signUp")}
                </span>
              </div>
            )}
            {!user.isGuest && (
              <>
                <div
                  className={
                    pathname === "/account" ? styles.link_active : styles.link
                  }
                >
                  <MdManageAccounts className={styles.icon} />
                  <Link href="/account">{l("account")}</Link>
                </div>
                <div
                  className={
                    pathname === "/feedback" ? styles.link_active : styles.link
                  }
                >
                  <TbReport className={styles.icon} />
                  <Link href="/feedback">{l("feedback")}</Link>
                </div>
              </>
            )}
            <div className={styles.divider}></div>
            <div className={styles.logout} onClick={handleLogout}>
              <IoLogOut className={styles.icon} />
              <span>{l("logout")}</span>
            </div>
          </ul>
        ) : null}
        {!user && (
          <ul>
            <div
              className={
                pathname === "/rooms" ? styles.link_active : styles.link
              }
            >
              <SiAirtable className={styles.icon} />
              <Link href="/rooms">{l("lobby")}</Link>
            </div>
          </ul>
        )}
      </nav>
      {user && user?._id ? (
        <div className={styles.user}>
          <div className={styles.user_info}>
            {!user.isGuest && (
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
                <div
                  className={`${styles.coins} ${jCoins?.raw !== undefined && jCoins.raw < 100 ? styles.clickable_coins : ""}`}
                  onClick={
                    jCoins?.raw && jCoins.raw < 100
                      ? onOpenGetMoreModal
                      : undefined
                  }
                >
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
            <p>
              {user?.originalUsername ? user.originalUsername : user?.username}
            </p>
          </div>
          <Avatar />
        </div>
      ) : (
        <div className={styles.auth_links}>
          <Link href="/?auth=signin">{t("signIn")}</Link>
          <div className={styles.divider}>|</div>
          <Link href="/?auth=signup">{t("signUp")}</Link>
        </div>
      )}
    </header>
  );
};

export default MainNav;
