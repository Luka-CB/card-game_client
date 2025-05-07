import useSocket from "@/hooks/useSocket";
import styles from "./BusyBg.module.scss";
import { motion } from "framer-motion";

interface BusyBgProps {
  roomId: string;
  userId: string | null;
  setShowLeaveModal: (show: boolean) => void;
}

const BusyBg: React.FC<BusyBgProps> = ({
  roomId,
  userId,
  setShowLeaveModal,
}) => {
  const socket = useSocket();

  const handleRejoin = () => {
    if (!socket || !roomId || !userId) return;

    socket.emit("updateUserStatus", roomId, userId, "active");
  };

  const handleLeave = () => {
    if (!socket || !roomId || !userId) return;

    setShowLeaveModal(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={styles.bg}
    >
      <motion.div
        initial={{
          opacity: 0,
          y: 200,
        }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 1,
          duration: 0.5,
          type: "spring",
        }}
        className={styles.content}
      >
        <p>You're out of the game. The bot is playing instead of you.</p>
        <div className={styles.btns}>
          <button className={styles.btn_play} onClick={handleRejoin}>
            Continue Playing
          </button>
          <button className={styles.btn_leave} onClick={handleLeave}>
            Leave Room
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BusyBg;
