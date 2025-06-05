import styles from "./TrumpModal.module.scss";
import { GiSpades, GiDiamonds, GiHearts, GiClubs } from "react-icons/gi";
import { motion } from "framer-motion";
import useSocket from "@/hooks/useSocket";

interface Props {
  roomId: string;
  onClose: () => void;
}

const TrumpModal = ({ onClose, roomId }: Props) => {
  const socket = useSocket();

  const handleChooseTrump = (suit: string) => {
    if (!socket || !roomId) return;

    socket.emit("chooseTrumpCard", roomId, {
      id: "none",
      suit,
      rank: "none",
      Strength: "none",
    });
    onClose();
  };

  return (
    <div className={styles.bg}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        className={styles.container}
      >
        <p>Choose a Trump</p>
        <div className={styles.suits}>
          <button
            className={styles.btn_pass}
            onClick={() => handleChooseTrump("pass")}
          >
            -
          </button>
          <button
            className={styles.btn_spades}
            onClick={() => handleChooseTrump("spades")}
          >
            <GiSpades className={styles.icon} />
          </button>
          <button
            className={styles.btn_diamonds}
            onClick={() => handleChooseTrump("diamonds")}
          >
            <GiDiamonds className={styles.icon} />
          </button>
          <button
            className={styles.btn_clubs}
            onClick={() => handleChooseTrump("clubs")}
          >
            <GiClubs className={styles.icon} />
          </button>
          <button
            className={styles.btn_hearts}
            onClick={() => handleChooseTrump("hearts")}
          >
            <GiHearts className={styles.icon} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TrumpModal;
