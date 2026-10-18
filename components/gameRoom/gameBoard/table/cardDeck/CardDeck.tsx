import { GameInfo } from "@/utils/interfaces";
import styles from "./CardDeck.module.scss";
import { motion } from "framer-motion";
import useWindowSize from "@/hooks/useWindowSize";
import { GiSpades, GiDiamonds, GiHearts, GiClubs } from "react-icons/gi";
import { TbPlayCardOff } from "react-icons/tb";
import { useDeckContext } from "@/context/DeckContext";

interface CardDeckProps {
  gameInfo: GameInfo | null;
}

const CardDeck = ({ gameInfo }: CardDeckProps) => {
  const windowSize = useWindowSize();
  const { getCardUrl, cardBackUrl } = useDeckContext();

  if (!gameInfo) {
    return null;
  }

  const suitIcon = (suit: string | undefined) => {
    switch (suit) {
      case "spades":
        return <GiSpades className={styles.spades} />;
      case "diamonds":
        return <GiDiamonds className={styles.diamonds} />;
      case "hearts":
        return <GiHearts className={styles.hearts} />;
      case "clubs":
        return <GiClubs className={styles.clubs} />;
      case "pass":
        return <TbPlayCardOff className={styles.pass} />;
      default:
        return null;
    }
  };

  const trumpCard = gameInfo?.trumpCard ? getCardUrl(gameInfo.trumpCard) : null;

  return (
    <motion.div
      initial={{
        opacity: 0,
        top: 100,
        right: 50,
      }}
      animate={
        gameInfo?.trumpCard
          ? {
              opacity: 1,
              top: 20,
            }
          : undefined
      }
      transition={{
        duration: 1,
        type: "spring",
      }}
      className={styles.card_deck}
    >
      <div className={styles.trump_card}>
        {gameInfo?.trumpCard && gameInfo?.currentHand !== 9 ? (
          <img
            src={trumpCard ?? ""}
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
            style={{ height: "auto" }}
          />
        ) : (
          <div className={styles.trump_card_placeholder}>
            {suitIcon(gameInfo?.trumpCard?.suit)}
          </div>
        )}
      </div>
      <div className={styles.deck}>
        <img
          src={cardBackUrl}
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
          style={{ height: "auto" }}
          className={styles.card_deck_image}
        />
      </div>
    </motion.div>
  );
};

export default CardDeck;
