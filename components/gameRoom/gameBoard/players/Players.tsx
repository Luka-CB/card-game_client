import { HandBid, GameInfo, PlayingCard, RoomUser } from "@/utils/interfaces";
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
  isChoosingTrump: boolean;
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
  room: { id: string; users: { id: string; status: string }[] } | null;
  hand: PlayingCard[];
  getBids: (playerId: string) => number | undefined;
  getWins: (playerId: string) => number | undefined;
}

const Players: React.FC<PlayersProps> = ({
  rotatedPlayers,
  user,
  isChoosingTrump,
  gameInfo,
  room,
  hand,
  getBids,
  getWins,
}) => {
  const windowSize = useWindowSize();
  const socket = useSocket();

  const currentUserStatus = room?.users?.find(
    (u) => u.id === gameInfo?.currentPlayerId
  )?.status;

  useEffect(() => {
    if (!socket || !gameInfo || !room) return;

    if (gameInfo.status !== "bid" || currentUserStatus === "active") return;

    let timeout1: NodeJS.Timeout;
    let timeout2: NodeJS.Timeout;

    const previousBids =
      gameInfo.handBids
        ?.filter((bid) => bid.playerId !== gameInfo.currentPlayerId)
        ?.map((bid) => {
          const currentHandScore = bid.bids.find(
            (b) => b.gameHand === gameInfo.currentHand
          );

          return currentHandScore?.bid || 0;
        }) || [];

    const botBid = calculateBotBid({
      hand:
        gameInfo?.hands?.find((h) => h.playerId === gameInfo.currentPlayerId)
          ?.hand || [],
      trumpSuit: gameInfo.trumpCard?.suit || "",
      currentHand: gameInfo.currentHand || 0,
      isDealer: gameInfo.dealerId === gameInfo.currentPlayerId,
      previousBids,
    });

    timeout1 = setTimeout(() => {
      socket.emit("updateGameScore", room.id, gameInfo.currentPlayerId, {
        gameHand: gameInfo.currentHand,
        bid: botBid,
      });

      const playerIndex = rotatedPlayers.findIndex(
        (p) => p.id === gameInfo.currentPlayerId
      );
      const nextPlayerId =
        rotatedPlayers[(playerIndex + 1) % rotatedPlayers.length].id;

      if (!nextPlayerId) {
        console.error(
          "Calculated nextPlayerIndex resulted in undefined nextPlayerId:",
          nextPlayerId,
          gameInfo.players
        );
        return;
      }

      timeout2 = setTimeout(() => {
        socket.emit("updateGameInfo", room.id, {
          currentPlayerId: nextPlayerId,
          status:
            gameInfo.dealerId === gameInfo.currentPlayerId ? "playing" : "bid",
        });
      }, 500);
    }, 1500);

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
          {gameInfo?.currentPlayerId === user?._id &&
            gameInfo?.currentPlayerId === player.id &&
            isChoosingTrump && (
              <GameRounds
                rotatedPlayers={rotatedPlayers}
                hand={hand.slice(0, 3)}
                gameInfo={gameInfo as GameInfo}
                user={user as { _id: string }}
              />
            )}

          {player.id === user?._id &&
            (gameInfo?.status === "playing" || gameInfo?.status === "bid") && (
              <GameRounds
                rotatedPlayers={rotatedPlayers}
                hand={hand}
                gameInfo={gameInfo as GameInfo}
                user={user as { _id: string }}
              />
            )}

          {gameInfo?.status === "bid" &&
            gameInfo.currentPlayerId === player.id &&
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
            {gameInfo?.status === "dealing" &&
            (windowSize.width <= 800 || windowSize.height <= 800) ? null : (
              <>
                <div className={styles.name}>
                  <span className={styles.username}>
                    {substringText(player.username, 8)}
                  </span>
                  <p style={{ color: "red" }}>{index}</p>
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

export default Players;
