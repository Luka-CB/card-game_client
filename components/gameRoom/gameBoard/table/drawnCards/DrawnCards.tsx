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
  user: {
    _id: string;
  };
  gameInfo: {
    dealerId: string | null;
    status: string;
    currentPlayerId: string;
  };
  isChoosingTrump: boolean;
  nextPlayerId: string | null;
}

const DrawnCards = ({
  drawnCards,
  playerPositionIndex,
  playerId,
  dealingCards,
  user,
  gameInfo,
  isChoosingTrump,
  nextPlayerId,
}: DrawnCardsProps) => {
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

      {isChoosingTrump && nextPlayerId !== user._id && (
        <DealtCards
          dealingCards={dealingCards}
          playerPositionIndex={playerPositionIndex}
          playerId={playerId}
        />
      )}

      {gameInfo?.dealerId &&
        gameInfo?.status === "dealing" &&
        !isChoosingTrump && (
          <DealtCards
            dealingCards={dealingCards}
            playerPositionIndex={playerPositionIndex}
            playerId={playerId}
          />
        )}
    </motion.div>
  );
};

export default DrawnCards;
