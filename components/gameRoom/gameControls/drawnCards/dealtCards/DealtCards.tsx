import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./DealtCards.module.scss";
import useWindowSize from "@/hooks/useWindowSize";

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
  const windowSize = useWindowSize();

  const getInitial = () => {
    switch (playerPositionIndex) {
      case 0: // bottom
        return {
          opacity: 0.5,
          bottom:
            windowSize.width <= 600
              ? -30
              : (windowSize.width < 1000 && windowSize.width > 600) ||
                windowSize.height <= 800
              ? -50
              : -100,
          left: "50%",
          transform: "translate(-50%, 0)",
        };
      case 1: // left
        return {
          opacity: 0.5,
          left:
            windowSize.width <= 600
              ? -30
              : (windowSize.width < 1000 && windowSize.width > 600) ||
                windowSize.height <= 800
              ? -50
              : -100,
          top: "50%",
          transform: "translate(0, -50%)",
        };
      case 2: // top
        return {
          opacity: 0.5,
          top:
            windowSize.width <= 600
              ? -30
              : (windowSize.width < 1000 && windowSize.width > 600) ||
                windowSize.height <= 800
              ? -50
              : -100,
          left: "50%",
          transform: "translate(-50%, 0)",
        };
      case 3: // right
        return {
          opacity: 0.5,
          left:
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
        return {
          opacity: 1,
          bottom: 0,
          left: "50%",
          transform: "translate(-50%, 0)",
        };
      case 1: // left
        return {
          opacity: 1,
          top: "50%",
          left: 0,
          transform: "translate(0, -50%)",
        };
      case 2: // top
        return {
          opacity: 1,
          top: 0,
          left: "50%",
          transform: "translate(-50%, 0)",
        };
      case 3: // right
        return {
          opacity: 1,
          left: 0,
        };
      default:
        return {};
    }
  };

  return (
    <div className={styles.dealtCards_container}>
      {Array.from({ length: dealingCards[playerId] || 0 }).map((_, index) => (
        <motion.div
          key={index}
          initial={getInitial()}
          animate={getAnimate()}
          transition={{
            duration: 0.4,
            type: "spring",
            damping: 15,
            delay: index * 0.1, // Adjust the delay for each card
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
