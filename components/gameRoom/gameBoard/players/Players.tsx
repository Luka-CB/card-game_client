import React, { useEffect } from "react";
import { HandBid, GameInfo, PlayingCard, RoomUser } from "@/utils/interfaces";
import GameRounds from "../../gameControls/gameRounds/GameRounds";
import styles from "./Players.module.scss";
import Image from "next/image";
import { FaCrown } from "react-icons/fa6";
import useWindowSize from "@/hooks/useWindowSize";
import { substringText } from "@/utils/misc";
import Timer from "../timer/TimerCircle";
import useTimerStore from "@/store/gamePage/timerStore";

interface PlayersProps {
  rotatedPlayers: RoomUser[];
  user: { _id: string };
  gameInfo: {
    status: string;
    currentPlayerId: string;
    dealerId: string;
    handBids: HandBid[] | null;
    players: string[];
    currentHand: number | null;
    hands: { hand: PlayingCard[]; playerId: string }[] | null;
    trumpCard: PlayingCard | null;
  } | null;
  room: { id: string; users: RoomUser[] | null };
  hand: PlayingCard[];
  getBids: (playerId: string) => number | undefined;
  getWins: (playerId: string) => number | undefined;
}

const getPlayerPosition = (index: number) => {
  switch (index) {
    case 0:
      return styles.bottom;
    case 1:
      return styles.left;
    case 2:
      return styles.top;
    case 3:
      return styles.right;
    default:
      return "";
  }
};

const Players: React.FC<PlayersProps> = ({
  rotatedPlayers,
  user,
  gameInfo,
  room,
  hand,
  getBids,
  getWins,
}) => {
  const { duration, setDuration } = useTimerStore();

  const windowSize = useWindowSize();

  useEffect(() => {
    if (
      gameInfo?.status === "playing" ||
      gameInfo?.status === "bid" ||
      gameInfo?.status === "choosingTrump"
    ) {
      setDuration(20);
    }
  }, [gameInfo?.status]);

  return (
    <div className={styles.players}>
      {rotatedPlayers.map((player, index) => (
        <div
          key={player.id}
          className={`${styles.player} ${getPlayerPosition(index)}`}
        >
          {gameInfo?.status !== "playing" &&
            gameInfo?.status === "choosingTrump" &&
            player.id === user?._id &&
            gameInfo?.currentPlayerId === user?._id && (
              <GameRounds
                rotatedPlayers={rotatedPlayers}
                hand={hand.slice(0, 3)}
                gameInfo={gameInfo as GameInfo}
                user={user as { _id: string }}
                roomUsers={room.users || []}
              />
            )}

          {player.id === user?._id &&
            (gameInfo?.status === "playing" || gameInfo?.status === "bid") && (
              <GameRounds
                rotatedPlayers={rotatedPlayers}
                hand={hand}
                gameInfo={gameInfo as GameInfo}
                user={user as { _id: string }}
                roomUsers={room.users || []}
              />
            )}

          {(gameInfo?.status === "bid" ||
            gameInfo?.status === "playing" ||
            gameInfo?.status === "choosingTrump") &&
            gameInfo?.currentPlayerId === player.id &&
            index !== 0 &&
            duration && (
              <div
                className={`${styles.count_down} ${getPlayerPosition(
                  index
                )}_clock`}
              >
                <Timer duration={duration as number} />
              </div>
            )}

          {(gameInfo?.status === "playing" ||
            gameInfo?.status === "bid" ||
            gameInfo?.status === "choosingTrump") &&
            gameInfo.currentPlayerId === player.id &&
            index === 0 &&
            duration && (
              <div className={`${styles.count_down_current_player}`}>
                <Timer duration={duration as number} />
              </div>
            )}
          <div
            className={styles.player_info}
            title={player.username.length > 10 ? player.username : undefined}
          >
            <div className={styles.avatar_container}>
              {room?.users?.find((u) => u.id === player.id)?.status ===
              "active" ? (
                <Image
                  src={player.avatar || "/avatars/avatar-1.jpeg"}
                  alt={player.username}
                  width={80}
                  height={80}
                  className={styles.avatar}
                />
              ) : (
                <Image
                  src={player.botAvatar || "/bots/bot-1.jpeg"}
                  alt={player.username}
                  width={80}
                  height={80}
                  className={styles.avatar}
                />
              )}
              {index === 0 && <FaCrown className={styles.crown} />}
            </div>
            {(gameInfo?.status === "dealing" ||
              gameInfo?.status === "choosingTrump") &&
            (windowSize.width <= 800 || windowSize.height <= 800) ? null : (
              <>
                <div className={styles.name}>
                  <span className={styles.username}>
                    {substringText(player.username, 8)}
                  </span>
                  {player.id === user?._id && (
                    <span className={styles.you}>You</span>
                  )}
                </div>
                <div className={styles.bid}>
                  <b>{getBids(player.id)}</b>/<span>{getWins(player.id)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(Players);
