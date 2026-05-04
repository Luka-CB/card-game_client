import React, { useEffect, useMemo, useState } from "react";
import { PlayedCard, RoomUser } from "@/utils/interfaces";
import styles from "./PlayedCards.module.scss";
import Image from "next/image";
import useWindowSize from "@/hooks/useWindowSize";
import { motion, useAnimation } from "framer-motion";
import usePlayedCardsStore from "@/store/gamePage/playedCardsStore";
import { soundManager } from "@/utils/sounds";
import { useDeckContext } from "@/context/DeckContext";

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
  const { getCardUrl } = useDeckContext();

  // Played cards are the table's focal point — size them larger than hand cards.
  // Use the smaller of (5.5% of width) and (8% of height), clamped to [32, 80]px.
  const cardWidth = Math.max(
    32,
    Math.min(80, Math.min(windowSize.width * 0.055, windowSize.height * 0.08)),
  );
  const cardHeight = Math.round(cardWidth * 1.5);

  const { roundWinnerId, setRoundWinnerId } = usePlayedCardsStore();
  const [cardsToAnimate, setCardsToAnimate] = useState<PlayedCard[] | null>(
    null,
  );
  const controls = useAnimation();
  // Tracks whether we're in the post-animation hidden state waiting for the
  // server to confirm the round cleared. Using state (not a ref) so the restore
  // effect re-runs when this flips true, handling the race where the server
  // responds before the animation .then() fires.
  const [isHidden, setIsHidden] = useState(false);

  const winnerIndex = useMemo(() => {
    if (!roundWinnerId) return null;
    const index = getPlayerIndex(roundWinnerId as string, rotatedPlayers);
    return index === -1 ? null : index;
  }, [roundWinnerId, rotatedPlayers]);

  // Restore visibility as soon as both: animation has finished (isHidden=true)
  // AND the server has moved on (playedCards.length < 4).
  // Using isHidden as a dependency means this fires immediately when .then()
  // sets it, even if the server already responded during the animation.
  useEffect(() => {
    if (isHidden && playedCards.length < 4) {
      setIsHidden(false);
      controls.set({ opacity: 1 });
    }
  }, [isHidden, playedCards.length, controls]);

  useEffect(() => {
    if (winnerIndex !== null && playedCards.length === 4) {
      setCardsToAnimate(playedCards);
      soundManager.play("winCards");

      const targetY =
        winnerIndex === 0 ? "30vh" : winnerIndex === 2 ? "-30vh" : 0;
      const targetX =
        winnerIndex === 1 ? "-50vh" : winnerIndex === 3 ? "50vh" : 0;

      controls
        .start({
          x: targetX,
          y: targetY,
          opacity: 0,
          transition: { duration: 0.8, ease: "easeInOut" },
        })
        .then(() => {
          controls.set({ x: 0, y: 0, opacity: 0 });
          // setIsHidden(true) triggers the restore effect above, which will
          // immediately restore opacity if the server already responded, or
          // wait for the next playedCards update if it hasn't yet.
          setIsHidden(true);
          setRoundWinnerId(null);
          setCardsToAnimate(null);
        });
    }
  }, [winnerIndex, playedCards]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (playedCards.length > 0) {
      const lastPlayedCard = playedCards[playedCards.length - 1];

      if (lastPlayedCard.card.joker && lastPlayedCard.card.type) {
        if (lastPlayedCard.card.type === "pass") {
          soundManager.play("slideUnder");
        } else {
          soundManager.play("playJoker");
        }
      } else {
        soundManager.play("playCard");
      }
    }
  }, [playedCards]);

  const cardsForRender = cardsToAnimate || playedCards;

  return (
    <motion.div
      animate={controls}
      className={styles.played_cards}
      style={{ width: cardHeight * 2, height: cardHeight * 2 }}
    >
      {cardsForRender.map(({ playerId, card }, index) => (
        <div
          key={card.id ?? `${playerId}-${index}`}
          className={`${styles.card} ${styles[`card_${getPlayerIndex(playerId, rotatedPlayers)}`]}`}
          style={{
            zIndex: card.type === "pass" ? 0 : index + 1,
          }}
        >
          {card.joker ? (
            <Image
              src={getCardUrl(card)}
              alt={`${card.rank} of ${card.suit}` || "joker"}
              width={cardWidth}
              height={cardHeight}
            />
          ) : (
            <Image
              src={getCardUrl(card)}
              alt={`${card.rank} of ${card.suit}` || "card"}
              width={cardWidth}
              height={cardHeight}
            />
          )}
        </div>
      ))}
    </motion.div>
  );
};

export default React.memo(PlayedCards);
