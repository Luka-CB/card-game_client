import Image from "next/image";
import styles from "../Cards.module.scss";
import { RoomUser } from "@/utils/interfaces";
import { useEffect } from "react";
import useUserLevelStore from "@/store/user/stats/userLevelStore";
import LevelBadge from "@/components/common/LevelBadge";

interface UserProps {
  user: RoomUser | null;
}

const User: React.FC<UserProps> = ({ user }) => {
  const { levels, fetchUserLevel } = useUserLevelStore();

  useEffect(() => {
    if (!user?.id || user.isBot || user.id.startsWith("guest_")) return;

    void fetchUserLevel(user.id);
  }, [user?.id, user?.isBot, fetchUserLevel]);

  const userLevel = user?.id ? levels[user.id] : undefined;

  return (
    <div className={styles.user} title={user?.username}>
      {user ? (
        <>
          <Image
            src={
              user.status === "left"
                ? user.botAvatar || "/bots/bot-1.jpeg"
                : user.avatar || "/default-avatar.jpeg"
            }
            alt={user.username || "User"}
            width={200}
            height={200}
            loading="eager"
          />
          {user.status !== "left" && !user.isBot && (
            <LevelBadge
              level={userLevel || "novice"}
              compact
              className={styles.level_badge}
            />
          )}
        </>
      ) : (
        <div className={styles.user_placeholder}></div>
      )}
    </div>
  );
};

export default User;
