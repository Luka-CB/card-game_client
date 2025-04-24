import styles from "./GameRounds.module.scss";
import { CardDeck } from "@/components/gameRoom/cardDeck";
import { PlayingCard } from "@/utils/interfaces";
import Image from "next/image";
import { motion } from "framer-motion";

interface GameRoundsProps {
  hand: PlayingCard[];
}

const GameRounds = ({ hand }: GameRoundsProps) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 0,
        translateY: 100,
      }}
      animate={{ opacity: 1, translateX: 0, translateY: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className={styles.player_hand}
    >
      {hand.map((card: PlayingCard) => {
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

        return (
          <div className={styles.card} key={card.id}>
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
          </div>
        );
      })}
    </motion.div>
  );
};

export default GameRounds;
