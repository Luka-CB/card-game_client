import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./DealtCards.module.scss";
import useWindowSize from "@/hooks/useWindowSize";

interface DealtCardsProps {
  dealingCards: Record<string, number>;
  playerPositionIndex: number;
  playerId: string;
  currentPlayerId?: string;
  status?: string;
}

const DealtCards = ({
  dealingCards,
  playerPositionIndex,
  playerId,
  status,
  currentPlayerId,
}: DealtCardsProps) => {
  const windowSize = useWindowSize();

  const playerPosition = ["bottom", "left", "top", "right"][
    playerPositionIndex
  ];

  const initialY =
    windowSize.width <= 500
      ? 10
      : windowSize.width <= 800 && windowSize.width > 500
      ? 30
      : windowSize.width < 1400 && windowSize.width > 800
      ? 50
      : 100;
  const initialX =
    windowSize.width <= 500
      ? 15
      : windowSize.width <= 800 && windowSize.width > 500
      ? 30
      : windowSize.width < 1400 && windowSize.width > 800
      ? 50
      : 100;

  const offset =
    windowSize.width <= 500
      ? 1
      : windowSize.width <= 700 && windowSize.width > 500
      ? 2
      : windowSize.width < 1200 && windowSize.width > 700
      ? 3
      : 5;

  if (status === "choosingTrump" && currentPlayerId === playerId) {
    return null;
  }

  return (
    <div className={`${styles.dealtCards_container} ${styles[playerPosition]}`}>
      {Array.from({ length: dealingCards[playerId] || 0 }).map((_, index) => (
        <motion.div
          key={index}
          initial={{
            opacity: 0,
            y: playerPositionIndex === 0 ? initialY : -initialY,
            x: playerPositionIndex === 1 ? -initialX : initialX,
          }}
          animate={{
            opacity: 1,
            y: 0,
            x: 0,
          }}
          transition={{
            duration: 0.4,
            type: "spring",
            damping: 15,
            delay: index * 0.1, // Adjust the delay for each card
          }}
          style={{
            position: "absolute",
            left: `${index * offset}px`,
            zIndex: index,
          }}
        >
          <Image
            src="/cards/card-back.png"
            alt="Card Back"
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
        </motion.div>
      ))}
    </div>
  );
};

export default DealtCards;
