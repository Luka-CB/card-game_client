import useSocket from "@/hooks/useSocket";
import styles from "./BusyBg.module.scss";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("GameRoom.busyBg");

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
        <p>{t("paragraph")}</p>
        <div className={styles.btns}>
          <button className={styles.btn_play} onClick={handleRejoin}>
            {t("btns.continue")}
          </button>
          <button className={styles.btn_leave} onClick={handleLeave}>
            {t("btns.leave")}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BusyBg;
