import useWindowSize from "@/hooks/useWindowSize";
import styles from "./GameRounds.module.scss";
import { motion } from "framer-motion";
import { Card, PlayingCard } from "@/utils/interfaces";

interface Props {
  cardId: string;
  card: PlayingCard;
  onPlay: (card: PlayingCard) => void;
  isDragging?: boolean;
}

const ActionBtn = ({ cardId, card, onPlay, isDragging = false }: Props) => {
  const windowSize = useWindowSize();

  // Only show on large screens on hover
  // Never show on small screens as we're using drag interaction instead
  const showButton = windowSize.width >= 1200 && cardId === card.id;

  if (!showButton) {
    return null;
  }

  return (
    <motion.button
      className={styles.play_btn}
      onClick={() => onPlay(card as PlayingCard)}
      aria-label="Play card"
    >
      Play
    </motion.button>
  );
};

export default ActionBtn;
