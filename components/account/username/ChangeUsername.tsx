import { useEffect, useState } from "react";
import styles from "./ChangeUsername.module.scss";
import { FaTimesCircle } from "react-icons/fa";
import useChangeUsernameStore from "@/store/user/changeUsernameStore";
import { AnimatePresence, motion } from "framer-motion";
import BtnLoader from "@/components/loaders/BtnLoader";
import useFlashMsgStore from "@/store/flashMsgStore";
import { useLocale, useTranslations } from "next-intl";

const ChangeUsername = () => {
  const t = useTranslations("AccountPage.changeUsername");
  const locale = useLocale();

  const [username, setUsername] = useState("");
  const { setMsg } = useFlashMsgStore();

  const {
    isChangeUsernameOpen,
    toggleChangeUsername,
    status,
    error,
    changeUsername,
    resetChangeUsernameState,
  } = useChangeUsernameStore();

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (status === "success") {
      setMsg(t("msg"), "success");

      timeout = setTimeout(() => {
        toggleChangeUsername(false);
        resetChangeUsernameState();
        setUsername("");
      }, 2000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [status, setMsg, toggleChangeUsername, resetChangeUsernameState]);

  useEffect(() => {
    if (isChangeUsernameOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isChangeUsernameOpen]);

  const handleConfirm = () => {
    if (username.trim() === "") return;
    changeUsername(username);
  };

  return (
    <AnimatePresence>
      {isChangeUsernameOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={styles.bg}
          onClick={() => toggleChangeUsername(false)}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className={styles.modal}
            data-locale={locale}
            onClick={(e) => e.stopPropagation()}
          >
            <FaTimesCircle
              className={styles.close_icon}
              onClick={() => toggleChangeUsername(false)}
            />
            <h2>{t("title")}</h2>
            <p>{t("paragraph")}</p>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t("placeholder")}
              className={error && status === "failed" ? styles.input_error : ""}
            />
            {error && status === "failed" && <small>{error}</small>}
            <div className={styles.actions}>
              <button
                className={styles.confirm_btn}
                onClick={handleConfirm}
                disabled={status === "loading" || username.trim() === ""}
              >
                {status === "loading" ? <BtnLoader /> : t("btns.confirm")}
              </button>
              <button
                className={styles.cancel_btn}
                onClick={() => toggleChangeUsername(false)}
                disabled={status === "loading"}
              >
                {t("btns.cancel")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChangeUsername;
