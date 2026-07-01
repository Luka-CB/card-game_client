import styles from "./DeleteModal.module.scss";
import { FaTimesCircle } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import useDeleteUserStore from "@/store/user/deleteUserStore";
import { useEffect, useState } from "react";
import useFlashMsgStore from "@/store/flashMsgStore";
import BtnLoader from "@/components/loaders/BtnLoader";
import { useLocale, useTranslations } from "next-intl";

const deletionReasons = [
  { label: "reasonOne", value: "I have privacy concerns", reasonNumber: 1 },
  { label: "reasonTwo", value: "I receive too many emails", reasonNumber: 2 },
  {
    label: "reasonThree",
    value: "I want to create a new account",
    reasonNumber: 3,
  },
  {
    label: "reasonFour",
    value: "I no longer find the service useful",
    reasonNumber: 4,
  },
  { label: "reasonFive", value: "Platform has too many bugs", reasonNumber: 5 },
  {
    label: "reasonSix",
    value: "I waste too much time on the platform",
    reasonNumber: 6,
  },
];

const DeleteModal = () => {
  const t = useTranslations("AccountPage.delete.modal");
  const locale = useLocale();

  const { isDelModalOpen, toggleDelModal, deleteAccount, status, error } =
    useDeleteUserStore();
  const { setMsg } = useFlashMsgStore();
  const [selectedReason, setSelectedReason] = useState<{
    value: string;
    reasonNumber: number;
  } | null>(null);
  const [additionalFeedback, setAdditionalFeedback] = useState("");

  useEffect(() => {
    let timout: NodeJS.Timeout;

    if (status === "failed" && error) {
      setMsg(error, "error");
    }

    if (status === "success") {
      setMsg(t("msgs.success"), "success");

      timout = setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    }

    return () => clearTimeout(timout);
  }, [status, setMsg, error]);

  useEffect(() => {
    if (isDelModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isDelModalOpen]);

  const handleDelete = () => {
    if (!selectedReason) {
      setMsg(t("msgs.error"), "error");
      return;
    }

    deleteAccount(
      {
        value: selectedReason.value,
        reasonNumber: selectedReason.reasonNumber,
      },
      additionalFeedback,
    );
  };

  const handleCancelDelete = () => {
    setSelectedReason(null);
    toggleDelModal();
  };

  return (
    <AnimatePresence>
      {isDelModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={styles.bg}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className={styles.modal}
            data-locale={locale}
          >
            <FaTimesCircle
              className={styles.close_icon}
              onClick={handleCancelDelete}
            />
            <h2>{t("warning.title")}</h2>
            <p>{t("warning.paragraph")}</p>
            <hr />
            <h3>{t("reason.label")}</h3>
            <div className={styles.reasons}>
              {deletionReasons.map((reason) => (
                <div key={reason.reasonNumber} className={styles.reason}>
                  <input
                    type="radio"
                    id={`reason-${reason.reasonNumber}`}
                    name="deletionReason"
                    value={reason.value}
                    checked={
                      selectedReason?.reasonNumber === reason.reasonNumber
                    }
                    onChange={() => setSelectedReason(reason)}
                  />
                  <label htmlFor={`reason-${reason.reasonNumber}`}>
                    {t(`deletionReasons.${reason.label}`)}
                  </label>
                </div>
              ))}
            </div>
            <div className={styles.additional_feedback}>
              <label htmlFor="additionalFeedback">
                {t("reason.feedback.label")}
              </label>
              <textarea
                id="additionalFeedback"
                value={additionalFeedback}
                onChange={(e) => setAdditionalFeedback(e.target.value)}
                placeholder={t("reason.feedback.textarea.placeholder")}
              />
            </div>
            <hr />
            <div className={styles.buttons}>
              <button
                className={styles.cancel}
                onClick={handleCancelDelete}
                disabled={status === "loading"}
              >
                {t("btns.cancel")}
              </button>
              <button
                className={styles.delete}
                disabled={!selectedReason || status === "loading"}
                onClick={handleDelete}
              >
                {status === "loading" ? <BtnLoader /> : t("btns.confirm")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteModal;
