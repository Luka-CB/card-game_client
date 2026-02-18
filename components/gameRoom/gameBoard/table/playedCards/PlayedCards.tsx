import React, { useEffect, useMemo, useState } from "react";
import { PlayedCard, RoomUser } from "@/utils/interfaces";
import styles from "./PlayedCards.module.scss";
import Image from "next/image";
import useWindowSize from "@/hooks/useWindowSize";
import { motion } from "framer-motion";
import usePlayedCardsStore from "@/store/gamePage/playedCardsStore";

interface PlayedCardsProps {
  playedCards: PlayedCard[];
  currentPlayerId: string;
  rotatedPlayers: RoomUser[];
}

const getPlayerIndex = (playerId: string, rotatedPlayers: RoomUser[]) => {
  const playerIndex = rotatedPlayers.findIndex((p) => p.id === playerId);
  return playerIndex;
};

const PlayedCards: React.FC<PlayedCardsProps> = ({
  playedCards,
  rotatedPlayers,
}) => {
  const windowSize = useWindowSize();
  const { roundWinnerId, setRoundWinnerId } = usePlayedCardsStore();
  const [animationWinnerIndex, setAnimationWinnerIndex] = useState<
    number | null
  >(null);
  const [cardsToAnimate, setCardsToAnimate] = useState<PlayedCard[] | null>(
    null
  );

  const winnerIndex = useMemo(() => {
    if (!roundWinnerId) return null;
    const index = getPlayerIndex(roundWinnerId as string, rotatedPlayers);
    return index === -1 ? null : index;
  }, [roundWinnerId, rotatedPlayers]);

  const animateProps = useMemo(
    () => ({
      opacity: 1,
      y:
        animationWinnerIndex === 0
          ? "30vh"
          : animationWinnerIndex === 2
          ? "-30vh"
          : 0,
      x:
        animationWinnerIndex === 1
          ? "-50vh"
          : animationWinnerIndex === 3
          ? "50vh"
          : 0,
    }),
    [animationWinnerIndex]
  );

  useEffect(() => {
    if (winnerIndex !== null && playedCards.length === 4) {
      setCardsToAnimate(playedCards);
      setAnimationWinnerIndex(winnerIndex);
    }
  }, [winnerIndex, playedCards]);

  const handleAnimationComplete = () => {
    setAnimationWinnerIndex(null);
    setRoundWinnerId(null);
    setCardsToAnimate(null);
  };

  const cardsForRender = cardsToAnimate || playedCards;

  return (
    <motion.div
      animate={animateProps}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      onAnimationComplete={handleAnimationComplete}
      className={styles.played_cards}
    >
      {cardsForRender.map(({ playerId, card }, index) => (
        <div
          key={playerId}
          className={`${styles.card} ${styles.card}_${getPlayerIndex(
            playerId,
            rotatedPlayers
          )}`}
          style={{
            zIndex: card.type === "pass" ? 0 : index + 1,
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
                  : windowSize.height <= 900 &&
                    windowSize.height > 600 &&
                    windowSize.width > 600
                  ? 50
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
                  : windowSize.height <= 600 && windowSize.height > 450
                  ? 60
                  : windowSize.height <= 900 &&
                    windowSize.height > 600 &&
                    windowSize.width > 600
                  ? 8
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
                  : windowSize.height <= 600 && windowSize.height > 450
                  ? 40
                  : windowSize.height <= 900 &&
                    windowSize.height > 600 &&
                    windowSize.width > 600
                  ? 50
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
                  : windowSize.height <= 600 && windowSize.height > 450
                  ? 60
                  : windowSize.height <= 900 &&
                    windowSize.height > 600 &&
                    windowSize.width > 600
                  ? 80
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

export default React.memo(PlayedCards);
