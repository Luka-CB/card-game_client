import { PlayingCard } from "@/utils/interfaces";
import styles from "./DrawnCards.module.scss";
import { motion } from "framer-motion";
import useWindowSize from "@/hooks/useWindowSize";
import { useDeckContext } from "@/context/DeckContext";
import { useEffect, useState } from "react";

interface Props {
  card: PlayingCard;
  index: number;
  playerPositionIndex: number;
}

const DetermineDealerCard = ({ card, index, playerPositionIndex }: Props) => {
  const windowSize = useWindowSize();
  const { getCardUrl } = useDeckContext();

  const cardUrl = getCardUrl(card);
  const [imgSrc, setImgSrc] = useState(cardUrl);
  const offset = index * 3;

  useEffect(() => {
    setImgSrc(cardUrl);
  }, [cardUrl]);

  const fallbackCardUrl = card.joker
    ? card.color === "black"
      ? "/cards/joker-black.png"
      : "/cards/joker-red.png"
    : `/cards/${card.suit}-${card.rank?.toLowerCase()}.png`;

  const getInitial = () => {
    switch (playerPositionIndex) {
      case 0:
        return {
          opacity: 0,
          translateY:
            windowSize.width <= 600
              ? 30
              : (windowSize.width < 1000 && windowSize.width > 600) ||
                  windowSize.height <= 800
                ? 50
                : 100,
        };
      case 1:
        return {
          opacity: 0,
          translateX:
            windowSize.width <= 600
              ? -30
              : (windowSize.width < 1000 && windowSize.width > 600) ||
                  windowSize.height <= 800
                ? -50
                : -100,
        };
      case 2:
        return {
          opacity: 0,
          translateY:
            windowSize.width <= 600
              ? -30
              : (windowSize.width < 1000 && windowSize.width > 600) ||
                  windowSize.height <= 800
                ? -50
                : -100,
        };
      case 3:
        return {
          opacity: 0,
          translateX:
            windowSize.width <= 600
              ? 30
              : (windowSize.width < 1000 && windowSize.width > 600) ||
                  windowSize.height <= 800
                ? 50
                : 100,
        };
      default:
        return { opacity: 0 };
    }
  };

  const getAnimate = () => {
    switch (playerPositionIndex) {
      case 0:
      case 2:
        return {
          opacity: 1,
          translateY: 0,
        };
      case 1:
      case 3:
        return {
          opacity: 1,
          translateX: 0,
        };
      default:
        return { opacity: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitial()}
      animate={getAnimate()}
      transition={{
        duration: 0.04,
        ease: "linear",
      }}
      className={styles.card}
      style={{
        left: `${offset}px`,
        zIndex: index,
      }}
    >
      <img
        src={imgSrc}
        alt={card.rank || "card"}
        onError={() => {
          if (imgSrc !== fallbackCardUrl) {
            setImgSrc(fallbackCardUrl);
          }
        }}
        loading="eager"
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
        style={{ height: "auto" }}
      />
    </motion.div>
  );
};

export default DetermineDealerCard;
