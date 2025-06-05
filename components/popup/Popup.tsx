import { substringText } from "@/utils/misc";
import styles from "./Popup.module.scss";
import { AnimatePresence, motion } from "framer-motion";

export const UserTurnPopup = ({ username }: { username: string }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{
          opacity: 0,
          y: -50,
        }}
        exit={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={styles.your_turn_popup}
      >
        <p>it's your turn</p>
        <b title={username.length > 6 ? username : undefined}>
          {substringText(username, 6)}
        </b>
      </motion.div>
    </AnimatePresence>
  );
};

export const JokerPopup = ({
  username,
  sute,
  type,
}: {
  username: string;
  sute: string;
  type: string;
}) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        exit={{ opacity: 0, y: 550 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        className={styles.joker_popup}
      >
        <b title={username.length > 6 ? username : undefined}>
          {substringText(username, 6)}
        </b>
        <p>{type === "takes" ? "Takes" : "Requested"} highest</p>
        <b>{sute}</b>
      </motion.div>
    </AnimatePresence>
  );
};
