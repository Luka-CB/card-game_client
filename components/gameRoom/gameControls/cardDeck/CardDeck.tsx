import { GameInfo } from "@/utils/interfaces";
import styles from "./CardDeck.module.scss";
import { motion } from "framer-motion";
import Image from "next/image";

interface CardDeckProps {
  gameInfo: GameInfo | null;
}

const CardDeck = ({ gameInfo }: CardDeckProps) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: gameInfo?.status === "dealing" ? 400 : -270,
        x: gameInfo?.status === "dealing" ? 0 : 500,
      }}
      animate={{
        opacity: 1,
        y: gameInfo?.status === "dealing" ? 0 : -270,
        x: gameInfo?.status === "dealing" ? 0 : 500,
        transition: { delay: 1, duration: 0.6 },
      }}
      className={styles.card_deck}
    >
      <div className={styles.trump_card}>
        {gameInfo?.trumpCard && (
          <Image
            src={`/cards/${
              gameInfo.trumpCard.suit
            }-${gameInfo.trumpCard.rank.toLowerCase()}.png`}
            alt="Trump Card"
            width={120}
            height={180}
          />
        )}
      </div>
      <div className={styles.deck}>
        <Image
          src="/cards/card-back.png"
          alt="Card Deck"
          width={120}
          height={180}
          className={styles.card_deck_image}
        />
      </div>
    </motion.div>
  );
};

export default CardDeck;
