import useUserStore from "@/store/user/userStore";
import styles from "./MainNav.module.scss";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { TfiStatsDown, TfiStatsUp } from "react-icons/tfi";
import { PiChartLineLight } from "react-icons/pi";
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
  toggleGetMoreModal: () => void;
}

const MainNav: React.FC<MainNavProps> = ({
  jCoins,
  rating,
  toggleGetMoreModal,
}) => {
  const { user } = useUserStore();

  const pathname = usePathname();

  return (
    <header className={styles.main_nav}>
      <nav>
        <ul>
          <Link
            href="/games"
            className={pathname === "/games" ? styles.active : undefined}
          >
            Rooms
          </Link>

          <Link
            href="/about-us"
            className={pathname === "/about-us" ? styles.active : undefined}
          >
            About Us
          </Link>
          <Link
            href="/about-game"
            className={pathname === "/about-game" ? styles.active : undefined}
          >
            About Game
          </Link>
        </ul>
      </nav>
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
              <span>{rating !== null ? rating.value : "0"}</span>
            </div>
            <div className={styles.coins} onClick={() => toggleGetMoreModal()}>
              <Image
                src="/coin1.png"
                alt="coin"
                width={40}
                height={40}
                className={styles.coin_img}
              />
              <span>{jCoins !== null ? jCoins.value : "0"}</span>
            </div>
          </div>
          <p>
            {user?.originalUsername ? user.originalUsername : user?.username}
          </p>
        </div>
        <Avatar />
      </div>
    </header>
  );
};

export default MainNav;
