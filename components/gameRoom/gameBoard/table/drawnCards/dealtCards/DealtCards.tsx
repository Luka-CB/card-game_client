import { motion } from "framer-motion";
import styles from "./DealtCards.module.scss";
import useWindowSize from "@/hooks/useWindowSize";
import { useDeckContext } from "@/context/DeckContext";
import { useEffect, useRef, useState } from "react";
import { soundManager } from "@/utils/sounds";

interface DealtCardsProps {
  dealingCards: Record<string, number>;
  playerPositionIndex: number;
  playerId: string;
  currentPlayerId?: string;
  status?: string;
  baseDealtCards?: number;
}

const DealtCards = ({
  dealingCards,
  playerPositionIndex,
  playerId,
  status,
  currentPlayerId,
  baseDealtCards = 0,
}: DealtCardsProps) => {
  const windowSize = useWindowSize();
  const { cardBackUrl } = useDeckContext();
  const [backSrc, setBackSrc] = useState(cardBackUrl);
  const incrementalDealtCount = dealingCards[playerId] || 0;
  const dealtCardCount = baseDealtCards + incrementalDealtCount;

  const playerPosition = ["bottom", "left", "top", "right"][
    playerPositionIndex
  ];

  const initialY =
    windowSize.width <= 500
      ? 6
      : windowSize.width <= 800 && windowSize.width > 500
        ? 18
        : windowSize.width < 1400 && windowSize.width > 800
          ? 30
          : 60;
  const initialX =
    windowSize.width <= 500
      ? 8
      : windowSize.width <= 800 && windowSize.width > 500
        ? 18
        : windowSize.width < 1400 && windowSize.width > 800
          ? 30
          : 60;

  const offset =
    windowSize.width <= 500
      ? 1
      : windowSize.width <= 700 && windowSize.width > 500
        ? 2
        : windowSize.width < 1200 && windowSize.width > 700
          ? 3
          : 5;

  const stackSpread = Math.max(0, (dealtCardCount - 1) * offset);
  const dealDuration =
    dealtCardCount >= 8 ? 0.012 : dealtCardCount >= 5 ? 0.018 : 0.025;
  const prevIncrementalDealtCountRef = useRef(incrementalDealtCount);
  const lastDealSoundAtRef = useRef(0);
  const lastDealSoundCountRef = useRef(0);

  useEffect(() => {
    setBackSrc(cardBackUrl);
  }, [cardBackUrl]);

  useEffect(() => {
    const prevCount = prevIncrementalDealtCountRef.current;
    const hasNewCard = incrementalDealtCount > prevCount;

    // Trigger one deal sound per dealing step from a single anchor position,
    // so audio cadence matches the visual speed without overlapping 4x.
    if (hasNewCard && status === "dealing" && playerPositionIndex === 0) {
      const now = Date.now();
      const isSameCountReplay =
        incrementalDealtCount === lastDealSoundCountRef.current;

      // Avoid audible "double hit" artifacts when updates arrive back-to-back
      // at cycle boundaries (e.g. card 4 then immediate next cycle event).
      if (!isSameCountReplay && now - lastDealSoundAtRef.current >= 110) {
        soundManager.play("dealCard");
        lastDealSoundAtRef.current = now;
        lastDealSoundCountRef.current = incrementalDealtCount;
      }
    }

    if (incrementalDealtCount === 0) {
      lastDealSoundCountRef.current = 0;
    }

    prevIncrementalDealtCountRef.current = incrementalDealtCount;
  }, [incrementalDealtCount, playerPositionIndex, status]);

  const getCardLeft = (index: number) => {
    if (playerPositionIndex === 3) {
      return index * offset - stackSpread;
    }

    if (playerPositionIndex === 0 || playerPositionIndex === 2) {
      return index * offset - stackSpread / 2;
    }

    return index * offset;
  };

  // Nines UX: trump chooser "picks up" the first 3 cards while selecting trump.
  // After trump is chosen, those 3 are shown again and dealing continues.
  if (status === "choosingTrump" && currentPlayerId === playerId) {
    return null;
  }

  return (
    <div className={`${styles.dealtCards_container} ${styles[playerPosition]}`}>
      {Array.from({ length: dealtCardCount }).map((_, index) => (
        <motion.div
          key={index}
          initial={{
            opacity: 1,
            y: playerPositionIndex === 0 ? initialY : -initialY,
            x: playerPositionIndex === 1 ? -initialX : initialX,
          }}
          animate={{
            opacity: 1,
            y: 0,
            x: 0,
          }}
          transition={{
            duration: dealDuration,
            ease: "easeOut",
          }}
          style={{
            position: "absolute",
            left: `${getCardLeft(index)}px`,
            zIndex: index,
          }}
        >
          <img
            src={backSrc}
            alt="Card Back"
            loading="eager"
            onError={() => {
              if (backSrc !== "/cards/card-back.png") {
                setBackSrc("/cards/card-back.png");
              }
            }}
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
        </motion.div>
      ))}
    </div>
  );
};

export default DealtCards;
