import styles from "./GameRounds.module.scss";
import { CardDeck } from "@/components/gameRoom/cardDeck";
import { PlayingCard } from "@/utils/interfaces";
import Image from "next/image";
import { motion } from "framer-motion";
import useWindowSize from "@/hooks/useWindowSize";

interface GameRoundsProps {
  hand: PlayingCard[];
}

const GameRounds = ({ hand }: GameRoundsProps) => {
  const windowSize = useWindowSize();

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 0,
        translateY: 100,
      }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.4, damping: 15, type: "spring" }}
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
              <Image
                src={cardImage}
                alt={card.rank}
                width={
                  windowSize.height <= 350
                    ? 40
                    : windowSize.height <= 600 && windowSize.height > 350
                    ? 50
                    : windowSize.height <= 800 &&
                      windowSize.height > 600 &&
                      windowSize.width > 600
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
                    : windowSize.height <= 800 &&
                      windowSize.height > 600 &&
                      windowSize.width > 600
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
                    : windowSize.height <= 800 &&
                      windowSize.height > 600 &&
                      windowSize.width > 600
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
                    : windowSize.height <= 800 &&
                      windowSize.height > 600 &&
                      windowSize.width > 600
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
          </div>
        );
      })}
    </motion.div>
  );
};

export default GameRounds;
