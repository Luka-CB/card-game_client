"use client";

import Link from "next/link";
import styles from "./SideNav.module.scss";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const { toggleNav, isNavOpen } = useNavStore();
  const { status, logout } = useLogoutStore();

  const { user } = useUserStore();

  const windowSize = useWindowSize();

  const handleLogout = () => {
    logout();
    toggleNav();
  };

  return (
    <AnimatePresence>
      {isNavOpen && windowSize.width <= 700 && (
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
                <div className={styles.coins} onClick={onOpenGetMoreModal}>
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
            </div>
            <hr />
            <nav>
              <ul>
                <Link
                  href="/"
                  className={pathname === "/" ? styles.active : undefined}
                  onClick={() => toggleNav()}
                >
                  Home
                </Link>

                <Link
                  href="/games"
                  className={pathname === "/games" ? styles.active : undefined}
                  onClick={() => toggleNav()}
                >
                  Rooms
                </Link>

                <Link
                  href="/about-us"
                  className={
                    pathname === "/about-us" ? styles.active : undefined
                  }
                  onClick={() => toggleNav()}
                >
                  About Us
                </Link>
                <Link
                  href="/about-game"
                  className={
                    pathname === "/about-game" ? styles.active : undefined
                  }
                  onClick={() => toggleNav()}
                >
                  About Game
                </Link>
              </ul>
            </nav>
            <hr />
            <div className={styles.logout}>
              <button className={styles.logout_btn} onClick={handleLogout}>
                {status === "loading" ? (
                  <BtnLoader />
                ) : (
                  <>
                    <span>Logout</span>
                    <IoIosLogOut className={styles.logout_icon} />
                  </>
                )}
              </button>
            </div>
            <button className={styles.close_btn} onClick={() => toggleNav()}>
              <span>Close</span>
              <TfiClose className={styles.close_icon} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SideNav;
