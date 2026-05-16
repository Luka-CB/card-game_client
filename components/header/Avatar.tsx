import useUserOptionStore from "@/store/user/userOptionStore";
import styles from "./Avatar.module.scss";
import useUserStore from "@/store/user/userStore";
import Image from "next/image";
// import { FaCaretDown } from "react-icons/fa6";
import useWindowSize from "@/hooks/useWindowSize";
import useUserStatsStore from "@/store/user/stats/userStatsStore";
import { useEffect } from "react";
import LevelBadge from "@/components/common/LevelBadge";

const Avatar = () => {
  const { setIsOpen, isOpen } = useUserOptionStore();
  const { user } = useUserStore();
  const windowSize = useWindowSize();
  const { stats, fetchStats } = useUserStatsStore();

  useEffect(() => {
    if (user && !user.isGuest && !stats) {
      fetchStats();
    }
  }, [user, stats, fetchStats]);

  return (
    <>
      <div
        className={windowSize.width <= 800 ? styles.avatar_sm : styles.avatar}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Image
          src={user?.avatar || "/default-avatar.jpeg"}
          alt="avatar"
          width={50}
          height={50}
          className={styles.avatar_img}
        />
        {!user?.isGuest && (
          <LevelBadge
            level={stats?.level || "novice"}
            compact
            className={styles.level_badge}
          />
        )}
        {/* <div className={styles.caret}>
          <FaCaretDown className={styles.caret_icon} />
        </div> */}
      </div>
    </>
  );
};

export default Avatar;
