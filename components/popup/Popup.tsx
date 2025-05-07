import styles from "./Popup.module.scss";
import { AnimatePresence, motion } from "framer-motion";

const Popup = ({
  primaryText,
  secondaryText = "",
}: {
  primaryText: string;
  secondaryText?: string;
}) => {
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
        className={styles.popup}
      >
        <p>{primaryText}</p>
        <b>{secondaryText}</b>
      </motion.div>
    </AnimatePresence>
  );
};

export default Popup;
