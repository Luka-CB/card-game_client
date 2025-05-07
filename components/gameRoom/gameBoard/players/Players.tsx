import { PlayingCard, RoomUser, ScoreBoard } from "@/utils/interfaces";
import GameRounds from "../../gameControls/gameRounds/GameRounds";
import styles from "./Players.module.scss";
import CountDownClock from "../timer/CountDownClock";
import Image from "next/image";
import { FaCrown } from "react-icons/fa6";
import useWindowSize from "@/hooks/useWindowSize";
import { substringText } from "@/utils/misc";
import { useEffect } from "react";
import useSocket from "@/hooks/useSocket";
import { calculateBotBid } from "@/utils/gameRoom";

interface PlayersProps {
  rotatedPlayers: RoomUser[];
  user: { _id: string };
  gameInfo: {
    status: string;
    activePlayerId: string;
    activePlayerIndex: number;
    dealerId: string;
    scoreBoard: ScoreBoard[] | null;
    players: string[];
    currentHand: number | null;
    hands: { hand: PlayingCard[]; playerId: string }[] | null;
    trumpCard: PlayingCard | null;
  } | null;
  room: { id: string; users: { id: string; status: string }[] } | null;
  hand: PlayingCard[];
  getBids: (playerId: string) => number | undefined;
}

const Players: React.FC<PlayersProps> = ({
  rotatedPlayers,
  user,
  gameInfo,
  room,
  hand,
  getBids,
}) => {
  const windowSize = useWindowSize();
  const socket = useSocket();

  const currentUserStatus = room?.users?.find(
    (u) => u.id === gameInfo?.activePlayerId
  )?.status;

  useEffect(() => {
    if (!socket || !gameInfo || !room) return;

    if (gameInfo.status !== "bid") return;

    let timeout1: NodeJS.Timeout;
    let timeout2: NodeJS.Timeout;

    if (currentUserStatus !== "active") {
      const previousBids =
        gameInfo?.scoreBoard
          ?.filter(
            (score) =>
              gameInfo.players?.indexOf(score.playerId) <
              gameInfo.activePlayerIndex
          )
          .map((score) => {
            const currentHandScore = score.scores?.find(
              (s) => s.gameHand === gameInfo?.currentHand
            );
            return currentHandScore?.bid || 0;
          }) || [];

      const botBid = calculateBotBid({
        hand:
          gameInfo?.hands?.find((h) => h.playerId === gameInfo.activePlayerId)
            ?.hand || [],
        trumpSuit: gameInfo.trumpCard?.suit || "",
        currentHand: gameInfo.currentHand || 0,
        isDealer: gameInfo.dealerId === gameInfo.activePlayerId,
        previousBids,
      });

      timeout1 = setTimeout(() => {
        if (
          typeof gameInfo.activePlayerIndex !== "number" ||
          !gameInfo.players
        ) {
          console.error(
            "Cannot determine next player: Invalid activePlayerIndex or players array.",
            gameInfo
          );
          return;
        }

        socket.emit("updateGameScore", room.id, gameInfo.activePlayerId, {
          gameHand: gameInfo.currentHand,
          bid: botBid,
        });

        const nextPlayerIndex =
          gameInfo.activePlayerIndex === 3 ? 0 : gameInfo.activePlayerIndex + 1;
        const nextPlayerId = gameInfo.players[nextPlayerIndex];

        if (!nextPlayerId) {
          console.error(
            "Calculated nextPlayerIndex resulted in undefined nextPlayerId:",
            nextPlayerIndex,
            gameInfo.players
          );
          return;
        }

        timeout2 = setTimeout(() => {
          socket.emit("updateGameInfo", room.id, {
            activePlayerId: nextPlayerId,
            activePlayerIndex: nextPlayerIndex,
            status:
              gameInfo.dealerId === gameInfo.activePlayerId ? "playing" : "bid",
          });
        }, 500);
      }, 3000);
    }

    return () => {
      if (timeout1) clearTimeout(timeout1);
      if (timeout2) clearTimeout(timeout2);
      socket.off("updateGameInfo");
      socket.off("updateGameScore");
    };
  }, [socket, gameInfo, room, currentUserStatus]);

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

  return (
    <div className={styles.players}>
      {rotatedPlayers.map((player, index) => (
        <div
          key={player.id}
          className={`${styles.player} ${getPlayerPosition(index)}`}
        >
          {player.id === user?._id &&
            (gameInfo?.status === "playing" || gameInfo?.status === "bid") && (
              <GameRounds hand={hand} />
            )}

          {gameInfo?.status === "bid" &&
            gameInfo.activePlayerId === player.id &&
            index !== 0 && (
              <div
                className={`${styles.count_down} ${getPlayerPosition(
                  index
                )}_clock`}
              >
                <CountDownClock textColor="aliceblue" fontSize={1.5} />
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
            {gameInfo?.status === "playing" || gameInfo?.status === "bid" ? (
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
                  <b>{getBids(player.id)}</b>/<span>-</span>
                </div>
              </>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Players;
