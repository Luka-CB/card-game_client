import { PlayingCard } from "@/utils/interfaces";
import styles from "./DrawnCards.module.scss";
import DrawnCard from "./DrawnCard";

interface DrawnCardsProps {
  drawnCards: PlayingCard[];
  playerPositionIndex: number;
}

const DrawnCards = ({ drawnCards, playerPositionIndex }: DrawnCardsProps) => {
  return (
    <div className={styles.drawnCards_Container}>
      {drawnCards.map((card: PlayingCard, index) => (
        <DrawnCard
          key={`${card.id}-${index}`}
          card={card}
          index={index}
          playerPositionIndex={playerPositionIndex}
        />
      ))}
    </div>
  );
};

export default DrawnCards;
