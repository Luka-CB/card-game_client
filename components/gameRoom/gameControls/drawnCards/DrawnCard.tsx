import { PlayingCard } from "@/utils/interfaces";
import { motion } from "framer-motion";
import { CardDeck } from "../../cardDeck";
import styles from "./DrawnCards.module.scss";
import Image from "next/image";

interface Props {
  card: PlayingCard;
  index: number;
  playerPositionIndex: number;
}

const DrawnCard = ({ card, index, playerPositionIndex }: Props) => {
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

  return (
    <motion.div
      initial={{
        opacity: 0,
        translateX:
          playerPositionIndex === 1 ? 400 : playerPositionIndex === 3 ? 0 : 0,
        translateY:
          playerPositionIndex === 0 ? 0 : playerPositionIndex === 2 ? 130 : 0,
      }}
      animate={{
        opacity: 1,
        translateX:
          playerPositionIndex === 1 ? 0 : playerPositionIndex === 3 ? 400 : 0,
        translateY:
          playerPositionIndex === 0 ? 130 : playerPositionIndex === 2 ? 0 : 0,
        transition: {
          duration: 0.6,
          ease: "easeInOut",
        },
      }}
      className={styles.card}
      style={{
        left: `${offset}px`,
        zIndex: index,
      }}
    >
      {cardImage ? (
        <Image src={cardImage} alt={card.rank} width={100} height={150} />
      ) : (
        <Image
          src={
            card.color === "black"
              ? jokerImageBlack || "/cards/joker-black.png"
              : jokerImageRed || "/cards/joker-red.png"
          }
          alt="Joker"
          width={100}
          height={150}
        />
      )}
    </motion.div>
  );
};

export default DrawnCard;
