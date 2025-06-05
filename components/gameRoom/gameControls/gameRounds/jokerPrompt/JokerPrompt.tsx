import { PlayingCard } from "@/utils/interfaces";
import styles from "./JokerPrompt.module.scss";
import { motion } from "framer-motion";
import { IoCloseCircle } from "react-icons/io5";
import { GiSpades, GiDiamonds, GiHearts, GiClubs } from "react-icons/gi";

interface JokerPromptProps {
  jokerCard: PlayingCard;
  clearJokerCard: () => void;
  playedCardHandler: (card: PlayingCard) => void;
  isPlayedCardsEmpty: boolean;
}

const JokerPrompt = ({
  jokerCard,
  clearJokerCard,
  playedCardHandler,
  isPlayedCardsEmpty,
}: JokerPromptProps) => {
  const handleJokerClick = (
    type: "need" | "pass" | "takes",
    requestedSuit: string = ""
  ) => {
    playedCardHandler({ ...jokerCard, type, requestedSuit });
    clearJokerCard();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, typepe: "spring" }}
      className={styles.joker_prompt}
    >
      <div className={styles.close_btn} onClick={clearJokerCard}>
        <IoCloseCircle className={styles.icon} />
      </div>
      {isPlayedCardsEmpty ? (
        <div className={styles.suits}>
          <div className={styles.need}>
            <p>Need highest:</p>
            <div className={styles.suit_btns}>
              <button
                className={styles.suit_btn_spades}
                onClick={() => handleJokerClick("need", "spades")}
              >
                <GiSpades className={styles.icon} />
              </button>
              <button
                className={styles.suit_btn_diamonds}
                onClick={() => handleJokerClick("need", "diamonds")}
              >
                <GiDiamonds className={styles.icon} />
              </button>
              <button
                className={styles.suit_btn_hearts}
                onClick={() => handleJokerClick("need", "hearts")}
              >
                <GiHearts className={styles.icon} />
              </button>
              <button
                className={styles.suit_btn_clubs}
                onClick={() => handleJokerClick("need", "clubs")}
              >
                <GiClubs className={styles.icon} />
              </button>
            </div>
          </div>
          <div className={styles.takes}>
            <p>Takes highest:</p>
            <div className={styles.suit_btns}>
              <button
                className={styles.suit_btn_spades}
                onClick={() => handleJokerClick("takes", "spades")}
              >
                <GiSpades className={styles.icon} />
              </button>
              <button
                className={styles.suit_btn_diamonds}
                onClick={() => handleJokerClick("takes", "diamonds")}
              >
                <GiDiamonds className={styles.icon} />
              </button>
              <button
                className={styles.suit_btn_hearts}
                onClick={() => handleJokerClick("takes", "hearts")}
              >
                <GiHearts className={styles.icon} />
              </button>
              <button
                className={styles.suit_btn_clubs}
                onClick={() => handleJokerClick("takes", "clubs")}
              >
                <GiClubs className={styles.icon} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.btns}>
          <button
            className={styles.take_btn}
            onClick={() => handleJokerClick("need")}
          >
            I'll take it
          </button>
          <button
            className={styles.no_btn}
            onClick={() => handleJokerClick("pass")}
          >
            Don't need it
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default JokerPrompt;
