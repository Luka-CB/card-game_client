import useUserStore from "@/store/user/userStore";
import styles from "./MainNav.module.scss";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { TfiStatsDown, TfiStatsUp } from "react-icons/tfi";
import { PiChartLineLight } from "react-icons/pi";
import { SiAirtable } from "react-icons/si";
import { TbReport } from "react-icons/tb";
import Image from "next/image";
import Avatar from "./Avatar";

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
  const { user } = useUserStore();

  const pathname = usePathname();

  return (
    <header className={styles.main_nav}>
      <nav>
        {user && user._id ? (
          <ul>
            <div
              className={
                pathname === "/rooms" ? styles.link_active : styles.link
              }
            >
              <SiAirtable className={styles.icon} />
              <Link href="/rooms">Rooms</Link>
            </div>
            <div
              className={
                pathname === "/report" ? styles.link_active : styles.link
              }
            >
              <TbReport className={styles.icon} />
              <Link href="/report">Report</Link>
            </div>
          </ul>
        ) : null}
      </nav>
      {user && user?._id ? (
        <div className={styles.user}>
          <div className={styles.user_info}>
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
            <p>
              {user?.originalUsername ? user.originalUsername : user?.username}
            </p>
          </div>
          <Avatar />
        </div>
      ) : (
        <div className={styles.auth_links}>
          <Link href="/?auth=signin">Sign In</Link>
          <div className={styles.divider}>|</div>
          <Link href="/?auth=signup">Sign Up</Link>
        </div>
      )}
    </header>
  );
};

export default MainNav;
