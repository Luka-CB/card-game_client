import { PlayingCard } from "@/utils/interfaces";
import styles from "./DrawnCards.module.scss";
import DetermineDealerCard from "./DetermineDealerCard";
import DealtCards from "./dealtCards/DealtCards";
import { motion } from "framer-motion";

interface DrawnCardsProps {
  drawnCards: PlayingCard[];
  playerPositionIndex: number;
  playerId: string;
  dealingCards: Record<string, number>;
  gameInfo: {
    dealerId: string | null;
    status: string;
    currentPlayerId: string;
    currentHand: number | null;
    trumpCard?: PlayingCard | null;
  };
}

const DrawnCards = ({
  drawnCards,
  playerPositionIndex,
  playerId,
  dealingCards,
  gameInfo,
}: DrawnCardsProps) => {
  const hasActiveDealing = Object.values(dealingCards).some(
    (count) => count > 0,
  );

  const playerPosition =
    playerPositionIndex === 0
      ? styles.bottom_drawn_cards
      : playerPositionIndex === 1
        ? styles.left_drawn_cards
        : playerPositionIndex === 2
          ? styles.top_drawn_cards
          : styles.right_drawn_cards;

  return (
    <motion.div className={`${styles.drawn_cards} ${playerPosition}`}>
      {!gameInfo?.dealerId && (
        <div className={styles.determine_dealer_cards}>
          {drawnCards.map((card: PlayingCard, index) => (
            <DetermineDealerCard
              key={`${card.id}-${index}`}
              card={card}
              index={index}
              playerPositionIndex={playerPositionIndex}
            />
          ))}
        </div>
      )}

      {(hasActiveDealing ||
        gameInfo?.status === "choosingTrump" ||
        (gameInfo?.dealerId && gameInfo?.status === "dealing")) && (
        <DealtCards
          dealingCards={dealingCards}
          playerPositionIndex={playerPositionIndex}
          playerId={playerId}
          currentPlayerId={gameInfo.currentPlayerId}
          status={gameInfo.status}
          baseDealtCards={
            gameInfo.status === "dealing" &&
            gameInfo.currentHand === 9 &&
            Boolean(gameInfo.trumpCard)
              ? 3
              : 0
          }
        />
      )}
    </motion.div>
  );
};

export default DrawnCards;
