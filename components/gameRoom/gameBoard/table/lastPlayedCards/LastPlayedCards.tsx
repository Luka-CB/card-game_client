import { PlayedCard, RoomUser } from "@/utils/interfaces";
import styles from "./LastPlayedCards.module.scss";
import useWindowSize from "@/hooks/useWindowSize";
import useLastPlayedCardsStore from "@/store/gamePage/lastPlayedCardsStore";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useDeckContext } from "@/context/DeckContext";

interface LastPlayedCardsProps {
  lastPlayedCards: PlayedCard[];
  rotatedPlayers: RoomUser[];
}

const LastPlayedCards: React.FC<LastPlayedCardsProps> = ({
  lastPlayedCards,
  rotatedPlayers,
}) => {
  const t = useTranslations("GameRoom.gameBoard");
  const { getCardUrl, cardBackUrl } = useDeckContext();

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
      <div className={styles.display_cards} title={t("lastPlayedCards")}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className={styles.card}>
            <img
              src={cardBackUrl}
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
              style={{ height: "auto" }}
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
                className={`${styles.card} ${styles[`card_${getPlayerIndex(playerId)}`]}`}
                style={{ zIndex: index + 1 }}
              >
                {card.joker ? (
                  <img
                    src={getCardUrl(card)}
                    alt={`${card.rank} of ${card.suit}` || "joker"}
                    width={50}
                    height={80}
                    style={{ height: "auto" }}
                  />
                ) : (
                  <img
                    src={getCardUrl(card)}
                    alt={`${card.rank} of ${card.suit}` || "card"}
                    width={40}
                    height={60}
                    style={{ height: "auto" }}
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
