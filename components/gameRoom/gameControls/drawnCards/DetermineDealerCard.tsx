import { PlayingCard } from "@/utils/interfaces";
import { CardDeck } from "../../cardDeck";
import styles from "./DrawnCards.module.scss";
import Image from "next/image";
import { motion } from "framer-motion";
import useWindowSize from "@/hooks/useWindowSize";

interface Props {
  card: PlayingCard;
  index: number;
  playerPositionIndex: number;
}

const DetermineDealerCard = ({ card, index, playerPositionIndex }: Props) => {
  const windowSize = useWindowSize();

  const cardImage = CardDeck.find(
    (c: { suit: string; rank: string; image: string; color?: string }) =>
      c.suit === card.suit && c.rank === card.rank
  )?.image;

  const jokerImageBlack = CardDeck.find(
    (c: { suit: string; rank: string; image: string; color?: string }) =>
      c.rank === "JOKER" && c.color === "black"
  )?.image;

  const jokerImageRed = CardDeck.find(
    (c: { suit: string; rank: string; image: string; color?: string }) =>
      c.rank === "JOKER" && c.color === "red"
  )?.image;

  const offset = index * 3;

  const getInitial = () => {
    switch (playerPositionIndex) {
      case 0: // bottom
        return {
          opacity: 0.5,
          translateY:
            windowSize.width <= 600
              ? -30
              : (windowSize.width < 1000 && windowSize.width > 600) ||
                windowSize.height <= 800
              ? -50
              : 100,
        };
      case 1: // left
        return {
          opacity: 0.5,
          translateX:
            windowSize.width <= 600
              ? -30
              : (windowSize.width < 1000 && windowSize.width > 600) ||
                windowSize.height <= 800
              ? -50
              : -100,
        };
      case 2: // top
        return {
          opacity: 0.5,
          translateY:
            windowSize.width <= 600
              ? -30
              : (windowSize.width < 1000 && windowSize.width > 600) ||
                windowSize.height <= 800
              ? -50
              : -100,
        };
      case 3: // right
        return {
          opacity: 0.5,
          translateX:
            windowSize.width <= 600
              ? 30
              : (windowSize.width < 1000 && windowSize.width > 600) ||
                windowSize.height <= 800
              ? 50
              : 100,
        };
      default:
        return {};
    }
  };

  const getAnimate = () => {
    switch (playerPositionIndex) {
      case 0: // bottom
      case 2: // top
        return {
          opacity: 1,
          translateY: 0,
        };
      case 1: // left
      case 3: // right
        return {
          opacity: 1,
          translateX: 0,
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      initial={getInitial()}
      animate={getAnimate()}
      transition={{
        duration: 0.2,
        damping: 15,
        type: "spring",
      }}
      className={styles.card}
      style={{
        left: `${offset}px`,
        zIndex: index,
      }}
    >
      {cardImage ? (
        <Image
          src={cardImage}
          alt={card.rank}
          width={
            windowSize.height <= 350
              ? 40
              : windowSize.height <= 600 && windowSize.height > 350
              ? 50
              : windowSize.height <= 800 && windowSize.height > 600
              ? 70
              : windowSize.width <= 600
              ? 50
              : windowSize.width <= 900 && windowSize.width > 600
              ? 70
              : windowSize.width < 1300 && windowSize.width > 900
              ? 90
              : 100
          }
          height={
            windowSize.height <= 350
              ? 60
              : windowSize.height <= 600 && windowSize.height > 350
              ? 70
              : windowSize.height <= 800 && windowSize.height > 600
              ? 100
              : windowSize.width <= 600
              ? 70
              : windowSize.width <= 900 && windowSize.width > 600
              ? 100
              : windowSize.width < 1300 && windowSize.width > 900
              ? 130
              : 150
          }
        />
      ) : (
        <Image
          src={
            card.color === "black"
              ? jokerImageBlack || "/cards/joker-black.png"
              : jokerImageRed || "/cards/joker-red.png"
          }
          alt="Joker"
          width={
            windowSize.height <= 350
              ? 40
              : windowSize.height <= 600 && windowSize.height > 350
              ? 50
              : windowSize.height <= 800 && windowSize.height > 600
              ? 70
              : windowSize.width <= 600
              ? 50
              : windowSize.width <= 900 && windowSize.width > 600
              ? 70
              : windowSize.width < 1300 && windowSize.width > 900
              ? 90
              : 100
          }
          height={
            windowSize.height <= 350
              ? 60
              : windowSize.height <= 600 && windowSize.height > 350
              ? 70
              : windowSize.height <= 800 && windowSize.height > 600
              ? 100
              : windowSize.width <= 600
              ? 70
              : windowSize.width <= 900 && windowSize.width > 600
              ? 100
              : windowSize.width < 1300 && windowSize.width > 900
              ? 130
              : 150
          }
        />
      )}
    </motion.div>
  );
};

export default DetermineDealerCard;
