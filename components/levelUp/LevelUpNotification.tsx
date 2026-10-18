"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useLevelUpStore from "@/store/levelUpStore";
import styles from "./LevelUpNotification.module.scss";

const LEVEL_BADGES: Record<string, string> = {
  novice: "🃏",
  amateur: "🎴",
  competent: "⚔️",
  promising: "🌟",
  professional: "💎",
  diabolical: "🔥",
  legend: "👑",
  joker: "🃏",
};

const AUTO_DISMISS_MS = 5000;

export default function LevelUpNotification() {
  const { levelUp, setLevelUp } = useLevelUpStore();

  useEffect(() => {
    if (!levelUp) return;
    const t = setTimeout(() => setLevelUp(null), AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [levelUp, setLevelUp]);

  return (
    <AnimatePresence>
      {levelUp && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className={styles.card}
            initial={{ scale: 0.6, y: 60, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: -40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            onClick={() => setLevelUp(null)}
          >
            <span className={styles.badge}>
              {LEVEL_BADGES[levelUp.toLevel] ?? "🏆"}
            </span>
            <p className={styles.label}>Level Up!</p>
            <p className={styles.level_name}>{levelUp.toLevel}</p>
            <p className={styles.from}>
              from&nbsp;
              <span style={{ textTransform: "capitalize" }}>
                {levelUp.fromLevel}
              </span>
            </p>
            <p className={styles.dismiss}>click to dismiss</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
