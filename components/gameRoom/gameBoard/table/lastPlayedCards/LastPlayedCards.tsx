import { PlayedCard, RoomUser } from "@/utils/interfaces";
import styles from "./LastPlayedCards.module.scss";
import Image from "next/image";
import useWindowSize from "@/hooks/useWindowSize";
import useLastPlayedCardsStore from "@/store/gamePage/lastPlayedCardsStore";
import { AnimatePresence, motion } from "framer-motion";

interface LastPlayedCardsProps {
  lastPlayedCards: PlayedCard[];
  rotatedPlayers: RoomUser[];
}

const LastPlayedCards: React.FC<LastPlayedCardsProps> = ({
  lastPlayedCards,
  rotatedPlayers,
}) => {
  const { toggleLastPlayedCardsModal, setToggleLastPlayedCards } =
    useLastPlayedCardsStore();

  const { width, height } = useWindowSize();

  const getPlayerIndex = (playerId: string) => {
    const playerIndex = rotatedPlayers.findIndex((p) => p.id === playerId);
    return playerIndex;
  };

  return (
    <div
      className={styles.container}
      onClick={() => setToggleLastPlayedCards(true)}
    >
      <div className={styles.display_cards} title="last played cards">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className={styles.card}>
            <Image
              src="/cards/card-back.png"
              alt="card back"
              width={
                height < 800
                  ? 20
                  : width < 1000 && width > 600
                  ? 25
                  : width < 600
                  ? 20
                  : 35
              }
              height={
                height < 800
                  ? 30
                  : width < 1000 && width > 600
                  ? 40
                  : width < 600
                  ? 30
                  : 50
              }
            />
          </div>
        ))}
      </div>
      <AnimatePresence>
        {toggleLastPlayedCardsModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className={styles.played_cards}
          >
            {lastPlayedCards.map(({ playerId, card }, index) => (
              <div
                key={playerId}
                className={`${styles.card} ${styles.card}_${getPlayerIndex(
                  playerId
                )}`}
                style={{ zIndex: index + 1 }}
              >
                {card.joker ? (
                  <Image
                    src={
                      card.color === "black"
                        ? "/cards/joker-black.png"
                        : "/cards/joker-red.png"
                    }
                    alt={`${card.rank} of ${card.suit}`}
                    width={50}
                    height={80}
                  />
                ) : (
                  <Image
                    src={`/cards/${card.suit}-${card.rank?.toLowerCase()}.png`}
                    alt={`${card.rank} of ${card.suit}`}
                    width={40}
                    height={60}
                  />
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LastPlayedCards;
