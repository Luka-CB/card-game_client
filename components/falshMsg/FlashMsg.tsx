"use client";

import useFlashMsgStore from "@/store/flashMsgStore";
import styles from "./FlashMsg.module.scss";
import { motion } from "framer-motion";
import { useEffect } from "react";

const FlashMsg = () => {
  const { msg, type, setMsg } = useFlashMsgStore();

  useEffect(() => {
    let timeout: any;
    if (msg) {
      timeout = setTimeout(() => {
        setMsg(null, null);
      }, 4000);
    }

    return () => clearTimeout(timeout);
  }, [msg]);

  return (
    <motion.div
      initial={{
        top: 0,
        opacity: 0,
      }}
      animate={{
        top: "2%",
        opacity: 1,
      }}
      transition={{ duration: 0.6, type: "spring" }}
      className={
        type === "error" ? styles.flash_msg_error : styles.flash_msg_success
      }
    >
      <p>{msg}</p>
    </motion.div>
  );
};

export default FlashMsg;
