import { RoomUser, ScoreBoard } from "@/utils/interfaces";
import styles from "./FinishedMode.module.scss";
import { motion } from "framer-motion";
import { GiExitDoor } from "react-icons/gi";
import { useEffect, useState } from "react";
import useSocket from "@/hooks/useSocket";
import { useRouter } from "next/navigation";

interface FinishedModeProps {
  users: RoomUser[];
  roomId?: string;
  scoreBoard?: ScoreBoard[];
  user?: { _id: string };
}

const FinishedMode: React.FC<FinishedModeProps> = ({
  users,
  roomId,
  scoreBoard,
  user,
}) => {
  const [countDown, setCountdown] = useState(59);

  const socket = useSocket();
  const router = useRouter();

  useEffect(() => {
    if (countDown === 0) {
      router.push("/games");
    }
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countDown, router]);

  const exitRoom = () => {
    if (!socket) return;
    socket.emit("updateUserStatus", roomId, user?._id, "left");
    router.push("/games");
  };

  const getPlayerScore = (playerId: string) => {
    const playerScore = scoreBoard?.find(
      (score) => score.playerId === playerId,
    );
    return playerScore ? playerScore.totalSum : 0;
  };

  const usersByScore = [...users].sort((a, b) => {
    const scoreA = getPlayerScore(a.id);
    const scoreB = getPlayerScore(b.id);
    return scoreA - scoreB;
  });

  const getAwardedPointsByRank = (rank: number) => {
    switch (rank) {
      case 1:
        return -300;
      case 2:
        return -150;
      case 3:
        return 150;
      case 4:
        return 300;
      default:
        return 0;
    }
  };

  const getIndicatorHeight = (score: number) => {
    switch (score) {
      case -300:
        return "150px";
      case -150:
        return "250px";
      case 150:
        return "350px";
      case 300:
        return "450px";
      default:
        return "0px";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={styles.container}
    >
      <div className={styles.exit_button} onClick={exitRoom}>
        <span>Exit The Room</span>
        <GiExitDoor className={styles.exit_icon} />
      </div>
      <h1>Game Finished</h1>
      <div className={styles.notice}>
        <p>
          The room will automatically close in <b>{countDown}</b> seconds.
        </p>
      </div>
      <div className={styles.user_list}>
        {usersByScore.map((user) => (
          <div key={user.id} className={styles.user_card}>
            <div className={styles.user_info}>
              <div className={styles.avatar}>
                {user.avatar ? (
                  <img
                    src={
                      (user.status !== "active"
                        ? user.botAvatar
                        : user.avatar) ?? undefined
                    }
                    alt={user.username}
                  />
                ) : (
                  <div className={styles.placeholder_avatar}>
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <b className={styles.username}>{user.username}</b>
              <b className={styles.score}>
                Score: <small>{getPlayerScore(user.id)}</small>
              </b>
              <b className={styles.points}>
                {getAwardedPointsByRank(usersByScore.indexOf(user) + 1) > 0
                  ? `+${getAwardedPointsByRank(usersByScore.indexOf(user) + 1)}`
                  : getAwardedPointsByRank(usersByScore.indexOf(user) + 1)}
              </b>
            </div>
            <motion.div
              initial={{ height: "0px" }}
              animate={{
                height: getIndicatorHeight(
                  getAwardedPointsByRank(usersByScore.indexOf(user) + 1),
                ),
              }}
              transition={{ duration: 4, delay: 1.5, type: "tween" }}
              className={styles.indicator}
            ></motion.div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default FinishedMode;
