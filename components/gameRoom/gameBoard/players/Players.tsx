import React, { useMemo, useState } from "react";
import {
  HandBid,
  GameInfo,
  PlayingCard,
  RoomUser,
  ScoreBoard,
} from "@/utils/interfaces";
import GameRounds from "../../gameControls/gameRounds/GameRounds";
import styles from "./Players.module.scss";
import Image from "next/image";
import useWindowSize from "@/hooks/useWindowSize";
import { substringText } from "@/utils/misc";
import UserMetaPopup from "./UserMetaPopup";
import useUserMetaStore from "@/store/user/userMetaStore";
import { useTranslations } from "next-intl";

interface TimerData {
  duration: number;
  startedAt: number;
  playerId: string;
  type: string;
}

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
    scoreBoard?: ScoreBoard[] | null;
  } | null;
  room: { id: string; users: RoomUser[] | null };
  hand: PlayingCard[];
  getBids: (playerId: string) => number | undefined;
  getWins: (playerId: string) => number | undefined;
  messagePopups: Record<string, { message: string; timestamp: Date } | null>;
  showChat: boolean;
  emojiPopup: { playerId: string; emoji: string; timestamp: Date } | null;
  timerData: TimerData | null;
  timerProgress: number;
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

const interpolateColor = (value: number): string => {
  const r = Math.round(255 * value);
  const g = Math.round(255 * (1 - value));
  return `rgb(${r}, ${g}, 0)`;
};

const normalizeScore = (value: number, precision = 2) => {
  const factor = 10 ** precision;
  const rounded = Math.round((value + Number.EPSILON) * factor) / factor;
  return Object.is(rounded, -0) ? 0 : rounded;
};

const Players: React.FC<PlayersProps> = ({
  rotatedPlayers,
  user,
  gameInfo,
  room,
  hand,
  getBids,
  getWins,
  messagePopups,
  showChat,
  emojiPopup,
  timerData,
  timerProgress,
}) => {
  const t = useTranslations("GameRoom.gameBoard.players");

  const windowSize = useWindowSize();
  const { toggleMetaVisibility } = useUserMetaStore();

  const [clickedPlayerId, setClickedPlayerId] = useState<string | null>(null);

  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * timerProgress;
  const ringColor = interpolateColor(timerProgress);

  const choosingTrumpHand = useMemo(() => hand.slice(0, 3), [hand]);

  const getCumulativeRoundSum = (playerId: string) => {
    const playerScore = gameInfo?.scoreBoard?.find(
      (score) => score.playerId === playerId,
    );

    if (!playerScore) return 0;

    return (
      (playerScore.roundSumOne || 0) +
      (playerScore.roundSumTwo || 0) +
      (playerScore.roundSumThree || 0) +
      (playerScore.roundSumFour || 0)
    );
  };

  const handleClickPlayer = (
    e: React.MouseEvent,
    playerId: string,
    isBot: boolean,
  ) => {
    e.stopPropagation();

    if (isBot) return;

    if (clickedPlayerId === playerId) {
      setClickedPlayerId(null);
      toggleMetaVisibility(false);
    } else {
      setClickedPlayerId(playerId);
      toggleMetaVisibility(true);
    }
  };

  return (
    <div className={styles.players}>
      {rotatedPlayers.map((player, index) => {
        const isCurrentTurn = timerData?.playerId === player.id;
        const isActive =
          room?.users?.find((u) => u.id === player.id)?.status === "active";
        const secondsLeft =
          timerData && isCurrentTurn
            ? Math.max(0, Math.ceil(timerData.duration * (1 - timerProgress)))
            : null;

        const showTimer =
          isCurrentTurn && secondsLeft !== null && secondsLeft > 0;
        const cumulativeRoundSum = getCumulativeRoundSum(player.id);
        const normalizedRoundSum = normalizeScore(cumulativeRoundSum);

        return (
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
                  hand={choosingTrumpHand}
                  gameInfo={gameInfo as GameInfo}
                  user={user as { _id: string }}
                  roomUsers={room.users || []}
                />
              )}

            {player.id === user?._id &&
              (gameInfo?.status === "playing" ||
                gameInfo?.status === "bid") && (
                <GameRounds
                  rotatedPlayers={rotatedPlayers}
                  hand={hand}
                  gameInfo={gameInfo as GameInfo}
                  user={user as { _id: string }}
                  roomUsers={room.users || []}
                />
              )}

            {player.id !== user?._id &&
              !player.isBot &&
              clickedPlayerId === player.id && (
                <UserMetaPopup playerId={player.id} />
              )}

            <div
              className={styles.player_info}
              title={
                player.username && player.username.length > 10
                  ? player.username
                  : undefined
              }
            >
              {!showChat && messagePopups[player.id] && (
                <div className={styles.message_popup}>
                  <span>{messagePopups[player.id]?.message}</span>
                </div>
              )}

              <div
                className={`${styles.avatar_container} ${isCurrentTurn ? styles.timer_active : ""}`}
                onClick={(e) =>
                  handleClickPlayer(e, player.id, player.isBot || false)
                }
              >
                {emojiPopup && emojiPopup.playerId === player.id && (
                  <div className={styles.emoji_popup}>
                    <span>{emojiPopup.emoji}</span>
                  </div>
                )}

                {isCurrentTurn && (
                  <svg className={styles.timer_ring} viewBox="0 0 72 72">
                    <circle
                      cx="36"
                      cy="36"
                      r={radius}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.15)"
                      strokeWidth="4"
                    />
                    <circle
                      cx="36"
                      cy="36"
                      r={radius}
                      fill="none"
                      stroke={ringColor}
                      strokeWidth="4"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      transform="rotate(-90 36 36)"
                    />
                  </svg>
                )}

                {showTimer && (
                  <div
                    className={styles.seconds_left}
                    style={{ color: ringColor }}
                  >
                    {secondsLeft}
                  </div>
                )}

                {isActive ? (
                  <Image
                    src={player.avatar || "/avatars/avatar-1.jpeg"}
                    alt={player.username || "avatar"}
                    width={100}
                    height={100}
                    style={{
                      border: `3px solid ${player.color?.value}`,
                      borderRadius: "50%",
                    }}
                    className={styles.avatar}
                  />
                ) : (
                  <Image
                    src={player.botAvatar || "/bots/bot-1.jpeg"}
                    alt={player.username || "avatar"}
                    width={80}
                    height={80}
                    style={{
                      border: `3px solid ${player.color?.value}`,
                      borderRadius: "50%",
                    }}
                    className={styles.avatar}
                  />
                )}
                {player.status !== "active" && (
                  <div className={styles.bot_label}>
                    <small>{t("bot")}</small>
                  </div>
                )}
              </div>
              {(gameInfo?.status === "dealing" ||
                gameInfo?.status === "choosingTrump") &&
              (windowSize.width <= 800 || windowSize.height <= 800) ? null : (
                <>
                  <div className={styles.name}>
                    <span className={styles.username}>
                      {substringText(player.username || "", 8)}
                    </span>
                    {player.id === user?._id && (
                      <span className={styles.you}>{t("you")}</span>
                    )}
                  </div>
                  <div className={styles.bid}>
                    <b>{getBids(player.id)}</b>/
                    <span
                      className={
                        getBids(player.id) === getWins(player.id)
                          ? styles.success
                          : styles.warning
                      }
                    >
                      {getWins(player.id)}
                    </span>
                  </div>
                  <div className={styles.round_sum}>
                    <small>{t("roundSum")}</small>
                    <span
                      className={
                        normalizedRoundSum > 0
                          ? styles.round_sum_positive
                          : normalizedRoundSum < 0
                            ? styles.round_sum_negative
                            : styles.round_sum_neutral
                      }
                    >
                      {normalizedRoundSum > 0
                        ? `+${normalizedRoundSum}`
                        : normalizedRoundSum}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(Players);
