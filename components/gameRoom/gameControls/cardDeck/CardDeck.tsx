import { GameInfo } from "@/utils/interfaces";
import styles from "./CardDeck.module.scss";
import { motion } from "framer-motion";
import Image from "next/image";
import useWindowSize from "@/hooks/useWindowSize";

interface CardDeckProps {
  gameInfo: GameInfo | null;
}

const CardDeck = ({ gameInfo }: CardDeckProps) => {
  const windowSize = useWindowSize();

  let initialPosition;
  let animatePosition;

  const animationKey =
    gameInfo?.status === "dealing" || gameInfo?.status === "waiting"
      ? "dealing_waiting"
      : "default";

  if (gameInfo?.status === "dealing" || gameInfo?.status === "waiting") {
    initialPosition = {
      opacity: 0,
      y: 50,
    };

    animatePosition = {
      opacity: 1,
      y: 0,
      transition: { delay: 0.5, duration: 0.4 },
    };
  } else {
    initialPosition = {
      opacity: 0,
      top: "50%",
      right: "50%",
      transform: "translate(-50%, -50%)",
    };

    animatePosition = {
      opacity: 1,
      top: "2%",
      right: "2%",
      left: "unset",
      bottom: "unset",
      transform: "translate(0, 0)",
      transition: { delay: 0.5, duration: 0.4 },
    };
  }

  if (!gameInfo) {
    return null;
  }

  return (
    <motion.div
      initial={initialPosition}
      animate={animatePosition}
      className={styles.card_deck}
    >
      <div className={styles.trump_card}>
        {gameInfo?.trumpCard && (
          <Image
            src={`/cards/${
              gameInfo.trumpCard.suit
            }-${gameInfo?.trumpCard?.rank?.toLowerCase()}.png`}
            alt="Trump Card"
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
      <div className={styles.deck}>
        <Image
          src="/cards/card-back.png"
          alt="Card Deck"
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
          className={styles.card_deck_image}
        />
      </div>
    </motion.div>
  );
};

export default CardDeck;
