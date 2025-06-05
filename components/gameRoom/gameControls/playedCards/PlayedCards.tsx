import { PlayedCard, PlayingCard, RoomUser, HandWin } from "@/utils/interfaces";
import styles from "./PlayedCards.module.scss";
import Image from "next/image";
import useWindowSize from "@/hooks/useWindowSize";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import useSocket from "@/hooks/useSocket";
import { get } from "http";

interface PlayedCardsProps {
  playedCards: PlayedCard[];
  trumpCard: PlayingCard;
  roomId: string;
  currentHand: number;
  handCount: number;
  HandWins: HandWin[] | null;
  players: string[];
  dealerId: string;
  rotatedPlayers: RoomUser[];
}

const PlayedCards: React.FC<PlayedCardsProps> = ({
  playedCards,
  trumpCard,
  roomId,
  currentHand,
  handCount,
  HandWins,
  players,
  dealerId,
  rotatedPlayers,
}) => {
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const roundCountRef = useRef(0);
  const winnerCardRef = useRef<PlayedCard | null>(null);

  const windowSize = useWindowSize();
  const socket = useSocket();

  const getPlayerIndex = (playerId: string) => {
    const playerIndex = rotatedPlayers.findIndex((p) => p.id === playerId);
    return playerIndex;
  };

  useEffect(() => {
    if (!socket || !roomId) return;

    socket.emit("getRoundCount", roomId);
    socket.on(
      "getRoundCount",
      (roundCount: { roomId: string; count: number }) => {
        roundCountRef.current = roundCount.count;
      }
    );

    return () => {
      socket.off("getRoundCount");
    };
  }, [socket, roomId]);

  useEffect(() => {
    if (!socket || !roomId || playedCards.length !== 4) return;

    const jokers = playedCards.filter((c) => c.card.joker);
    const trumps = playedCards.filter((c) => c.card.suit === trumpCard.suit);
    const leadSuit = playedCards[0].card.suit;
    const sameSuit = playedCards.filter((c) => c.card.suit === leadSuit);

    if (jokers.length > 0 && jokers.some((j) => j.card.type === "need")) {
      if (jokers.length === 1 && jokers[0].card.type === "need") {
        winnerCardRef.current = jokers[0];
      } else if (jokers.length === 2 && jokers[1].card.type === "need") {
        winnerCardRef.current = jokers[1];
      } else {
        winnerCardRef.current = jokers[0];
      }
    } else if (jokers.length > 0 && jokers[0].card.type === "takes") {
      const requestedSuit = jokers[0].card.requestedSuit;
      const existingRequestedSuits = playedCards.filter(
        (c) => c.card.suit === requestedSuit
      );

      if (jokers.length === 2 && jokers[1].card.type === "need") {
        winnerCardRef.current = jokers[1];
      } else if (trumps.length > 0) {
        winnerCardRef.current = trumps.reduce((max, c) =>
          c.card.strength > max.card.strength ? c : max
        );
      } else if (existingRequestedSuits.length > 0) {
        winnerCardRef.current = existingRequestedSuits.reduce((max, c) =>
          c.card.strength > max.card.strength ? c : max
        );
      } else {
        winnerCardRef.current = jokers[0];
      }
    } else if (trumps.length > 0) {
      winnerCardRef.current = trumps.reduce((max, c) =>
        c.card.strength > max.card.strength ? c : max
      );
    } else {
      winnerCardRef.current = sameSuit.reduce((max, c) =>
        c.card.strength > max.card.strength ? c : max
      );
    }

    setWinnerIndex(getPlayerIndex(winnerCardRef.current.playerId));

    const winCount =
      HandWins?.find(
        (w) => w.playerId === winnerCardRef.current?.playerId
      )?.wins.find((w) => w.gameHand === currentHand)?.win || 0;

    const timeout1 = setTimeout(() => {
      socket.emit("updateWins", roomId, {
        gameHand: currentHand,
        playerId: winnerCardRef.current?.playerId,
        win: winCount + 1,
      });
    }, 500);

    const timeout2 = setTimeout(() => {
      socket.emit("updateGameInfo", roomId, {
        currentPlayerId: winnerCardRef.current?.playerId,
        playedCards: null,
      });

      setWinnerIndex(null);
      winnerCardRef.current = null;
    }, 1000);

    if (roundCountRef.current < currentHand) {
      socket.emit("setRoundCount", roomId, roundCountRef.current + 1);
    }

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      setWinnerIndex(null);
      winnerCardRef.current = null;
      socket.off("updateWins");
      socket.off("updateGameInfo");
      socket.off("setRoundCount");
    };
  }, [playedCards.length, socket, roomId, currentHand]);

  useEffect(() => {
    if (
      !socket ||
      !roomId ||
      roundCountRef.current !== currentHand ||
      playedCards.length
    )
      return;

    const nextDealer = players[(players.indexOf(dealerId) + 1) % 4];
    const nextDealerIndex = getPlayerIndex(nextDealer);
    const nextPlayer = players[(nextDealerIndex + 1) % 4];

    const timeout = setTimeout(() => {
      socket.emit("calculatePoints", roomId);
    }, 1000);

    const timeout2 = setTimeout(() => {
      socket.emit("updateGameInfo", roomId, {
        handCount: !handCount ? 1 : handCount + 1,
        status: "waiting",
        trumpCard: null,
        dealerId: nextDealer,
        currentPlayerId: (currentHand === 8 || currentHand === 9) && nextPlayer,
        hands: null,
      });

      roundCountRef.current = 0;
      socket.emit("setRoundCount", roomId, 0);
    }, 2000);

    return () => {
      socket.off("updateGameInfo");
      socket.off("setRoundCount");
      clearTimeout(timeout);
      clearTimeout(timeout2);
    };
  }, [socket, roundCountRef.current, roomId, currentHand, playedCards.length]);

  return (
    <motion.div
      animate={{
        opacity: 1,
        y: winnerIndex === 0 ? 150 : winnerIndex === 2 ? -150 : 0,
        x: winnerIndex === 1 ? -200 : winnerIndex === 3 ? 200 : 0,
      }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className={styles.played_cards}
    >
      {playedCards.map(({ playerId, card }, index) => (
        <div
          key={playerId}
          className={`${styles.card} ${styles.card}_${getPlayerIndex(
            playerId
          )}`}
          style={{
            zIndex: index + 1,
          }}
        >
          {card.joker ? (
            <Image
              src={
                card.color === "black"
                  ? "/cards/joker-black.png"
                  : "/cards/joker-red.png"
              }
              alt={`${card.rank} of ${card.suit}`}
              width={
                windowSize.height <= 450
                  ? 30
                  : windowSize.height <= 550 && windowSize.height > 450
                  ? 40
                  : windowSize.height <= 600 && windowSize.height > 350
                  ? 50
                  : windowSize.height <= 800 &&
                    windowSize.height > 600 &&
                    windowSize.width > 600
                  ? 70
                  : windowSize.width <= 600
                  ? 40
                  : windowSize.width <= 990 && windowSize.width > 600
                  ? 50
                  : windowSize.width <= 1150 && windowSize.width > 990
                  ? 70
                  : windowSize.width < 1300 && windowSize.width > 1150
                  ? 90
                  : 100
              }
              height={
                windowSize.height <= 450
                  ? 45
                  : windowSize.height <= 550 && windowSize.height > 450
                  ? 60
                  : windowSize.height <= 600 && windowSize.height > 350
                  ? 70
                  : windowSize.height <= 800 &&
                    windowSize.height > 600 &&
                    windowSize.width > 600
                  ? 100
                  : windowSize.width <= 600
                  ? 55
                  : windowSize.width <= 990 && windowSize.width > 600
                  ? 70
                  : windowSize.width <= 1150 && windowSize.width > 990
                  ? 100
                  : windowSize.width < 1300 && windowSize.width > 1150
                  ? 130
                  : 150
              }
            />
          ) : (
            <Image
              src={`/cards/${card.suit}-${card.rank?.toLowerCase()}.png`}
              alt={`${card.rank} of ${card.suit}`}
              width={
                windowSize.height <= 450
                  ? 30
                  : windowSize.height <= 550 && windowSize.height > 450
                  ? 40
                  : windowSize.height <= 600 && windowSize.height > 350
                  ? 50
                  : windowSize.height <= 800 &&
                    windowSize.height > 600 &&
                    windowSize.width > 600
                  ? 70
                  : windowSize.width <= 600
                  ? 40
                  : windowSize.width <= 990 && windowSize.width > 600
                  ? 50
                  : windowSize.width <= 1150 && windowSize.width > 990
                  ? 70
                  : windowSize.width < 1300 && windowSize.width > 1150
                  ? 90
                  : 100
              }
              height={
                windowSize.height <= 450
                  ? 45
                  : windowSize.height <= 550 && windowSize.height > 450
                  ? 60
                  : windowSize.height <= 600 && windowSize.height > 350
                  ? 70
                  : windowSize.height <= 800 &&
                    windowSize.height > 600 &&
                    windowSize.width > 600
                  ? 100
                  : windowSize.width <= 600
                  ? 55
                  : windowSize.width <= 990 && windowSize.width > 600
                  ? 70
                  : windowSize.width <= 1150 && windowSize.width > 990
                  ? 100
                  : windowSize.width < 1300 && windowSize.width > 1150
                  ? 130
                  : 150
              }
            />
          )}
        </div>
      ))}
    </motion.div>
  );
};

export default PlayedCards;
