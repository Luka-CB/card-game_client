import { RoomUser, ScoreBoard } from "@/utils/interfaces";
import styles from "./FinishedMode.module.scss";
import { motion } from "framer-motion";
import { GiExitDoor } from "react-icons/gi";
import { useEffect, useState } from "react";
import useSocket from "@/hooks/useSocket";
import { useRouter } from "next/navigation";
import { soundManager } from "@/utils/sounds";
import Image from "next/image";

interface FinishedModeProps {
  users: RoomUser[];
  roomId?: string;
  bet?: string;
  scoreBoard?: ScoreBoard[];
  user?: { _id: string };
}

const FinishedMode: React.FC<FinishedModeProps> = ({
  users,
  roomId,
  bet,
  scoreBoard,
  user,
}) => {
  const [countDown, setCountdown] = useState(59);

  const socket = useSocket();
  const router = useRouter();

  useEffect(() => {
    soundManager.play("gameFinished");
  }, []);

  useEffect(() => {
    if (countDown === 0) {
      router.push("/rooms");
    }
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countDown, router]);

  const exitRoom = () => {
    if (!socket) return;
    socket.emit("updateUserStatus", roomId, user?._id, "left");
    router.push("/rooms");
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
    return scoreB - scoreA;
  });

  const getAwardedPointsByRank = (rank: number) => {
    switch (rank) {
      case 1:
        return 200;
      case 2:
        return 100;
      case 3:
        return -50;
      case 4:
        return -100;
      default:
        return 0;
    }
  };

  const getIndicatorHeight = (score: number) => {
    switch (score) {
      case 200:
        return "400px";
      case 100:
        return "300px";
      case -50:
        return "200px";
      case -100:
        return "100px";
      default:
        return "0px";
    }
  };

  const getAwardsPointsForBet = (rank: number) => {
    const betValue = parseInt(bet || "0");
    switch (rank) {
      case 1:
        return betValue * 4;
      case 2:
      case 3:
      case 4:
        return -betValue;
      default:
        return 0;
    }
  };

  const getIndicatorHeightForBet = (points: number) => {
    const betValue = parseInt(bet || "0");
    switch (points) {
      case betValue * 4:
        return "300px";
      case -betValue:
      case -betValue:
      case -betValue:
        return "100px";
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
              <div
                className={styles.avatar}
                style={{
                  borderColor: user.color ? user.color.value : "#000",
                  boxShadow: user.color
                    ? `0 0 10px ${user.color?.value}80`
                    : "0 0 10px #000",
                }}
              >
                {user.avatar ? (
                  <Image
                    src={
                      (user.status !== "active"
                        ? user.botAvatar
                        : user.avatar) ?? "/default-avatar.jpeg"
                    }
                    alt={user.username || "avatar"}
                    width={50}
                    height={50}
                    className={styles.avatar_image}
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
              {bet ? (
                <b className={styles.points}>
                  {getAwardsPointsForBet(usersByScore.indexOf(user) + 1) > 0
                    ? `+${getAwardsPointsForBet(usersByScore.indexOf(user) + 1)}`
                    : getAwardsPointsForBet(usersByScore.indexOf(user) + 1)}
                </b>
              ) : (
                <b className={styles.points}>
                  {getAwardedPointsByRank(usersByScore.indexOf(user) + 1) > 0
                    ? `+${getAwardedPointsByRank(usersByScore.indexOf(user) + 1)}`
                    : getAwardedPointsByRank(usersByScore.indexOf(user) + 1)}
                </b>
              )}
            </div>
            <motion.div
              initial={{ height: "0px" }}
              animate={{
                height: bet
                  ? getIndicatorHeightForBet(
                      getAwardsPointsForBet(usersByScore.indexOf(user) + 1),
                    )
                  : getIndicatorHeight(
                      getAwardedPointsByRank(usersByScore.indexOf(user) + 1),
                    ),
              }}
              transition={{ duration: 4, delay: 1.5, type: "tween" }}
              className={styles.indicator}
              style={{
                backgroundColor: user.color
                  ? user.color.value
                  : "rgb(51, 2, 175)",
                boxShadow: user.color
                  ? `0 0 3px ${user.color.value}`
                  : "0 0 3px rgb(51, 2, 175)",
              }}
            ></motion.div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default FinishedMode;
