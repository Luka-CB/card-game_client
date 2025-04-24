import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./DealtCards.module.scss";

interface DealtCardsProps {
  dealingCards: Record<string, number>;
  playerPositionIndex: number;
  playerId: string;
}

const DealtCards = ({
  dealingCards,
  playerPositionIndex,
  playerId,
}: DealtCardsProps) => {
  return (
    <div className={styles.dealtCards_container}>
      {Array.from({ length: dealingCards[playerId] || 0 }).map((_, index) => (
        <motion.div
          key={index}
          initial={{
            opacity: 0,
            translateX:
              playerPositionIndex === 1
                ? 400
                : playerPositionIndex === 3
                ? 0
                : 0,
            translateY:
              playerPositionIndex === 0
                ? 0
                : playerPositionIndex === 2
                ? 130
                : 0,
          }}
          animate={{
            opacity: 1,
            translateX:
              playerPositionIndex === 1
                ? 0
                : playerPositionIndex === 3
                ? 400
                : 0,
            translateY:
              playerPositionIndex === 0
                ? 130
                : playerPositionIndex === 2
                ? 0
                : 0,
            transition: {
              duration: 0.6,
              ease: "easeInOut",
            },
          }}
          style={{
            position: "absolute",
            left: `${index * 3}px`, // Adjust this value as needed
            zIndex: 1,
          }}
        >
          <Image
            src="/cards/card-back.png"
            alt="Card Back"
            width={100}
            height={150}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default DealtCards;
