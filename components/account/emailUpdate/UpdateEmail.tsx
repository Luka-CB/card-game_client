import { useEffect, useState } from "react";
import styles from "./UpdateEmail.module.scss";
import {
  FaTimesCircle,
  FaLongArrowAltRight,
  FaLongArrowAltLeft,
} from "react-icons/fa";
import useUpdateEmailStore from "@/store/email/updateEmailStore";
import { AnimatePresence, motion } from "framer-motion";
import BtnLoader from "@/components/loaders/BtnLoader";
import useFlashMsgStore from "@/store/flashMsgStore";
import useUserAccountStore from "@/store/user/userAccountStore";
import { useTranslations } from "next-intl";

interface UpdateEmailProps {
  changeEmail?: {
    pendingEmail: string | undefined;
    emailChangeCode: string | undefined;
    emailChangeExpires: Date | undefined;
    emailChangeAttempts: number;
  };
}

const UpdateEmail = ({ changeEmail }: UpdateEmailProps) => {
  const t = useTranslations("AccountPage.emailUpdate");

  const [isEnterCode, setIsEnterCode] = useState(false);
  const [email, setEmail] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { fetchUserAccount } = useUserAccountStore();
  const { setMsg } = useFlashMsgStore();
  const {
    isChangeEmailModalOpen,
    toggleChangeEmailModal,
    sendChangeEmailRequest,
    sendRequestStatus,
    sendRequestError,
    confirmChangeEmail,
    confirmCodeStatus,
    confirmCodeError,
    reset,
  } = useUpdateEmailStore();

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (sendRequestStatus === "success") {
      setIsEnterCode(true);
      setSuccessMessage(t("msgs.localSuccess"));
      if (!changeEmail?.pendingEmail) fetchUserAccount();

      timeout = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [sendRequestStatus, changeEmail, fetchUserAccount]);

  useEffect(() => {
    if (confirmCodeStatus === "success") {
      setMsg(t("msgs.flashSuccess"), "success");
      fetchUserAccount();
      setTimeout(() => {
        reset();
        toggleChangeEmailModal();
      }, 500);
    }
  }, [
    confirmCodeStatus,
    setMsg,
    reset,
    toggleChangeEmailModal,
    fetchUserAccount,
  ]);

  useEffect(() => {
    if (isChangeEmailModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      setIsEnterCode(false);
      setEmail("");
      setConfirmationCode("");
      setSuccessMessage("");
      reset();
    }
  }, [isChangeEmailModalOpen]);

  const isEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSendRequest = () => {
    if (!isEmailRegex.test(email)) return;

    if (changeEmail?.pendingEmail) {
      if (email === changeEmail.pendingEmail) {
        setMsg(t("msgs.flashError"), "error");
        return;
      }
    }

    sendChangeEmailRequest(email.trim());
  };

  const handleConfirmCode = () => {
    if (confirmationCode.length !== 6) return;
    reset();
    confirmChangeEmail(confirmationCode.trim());
  };

  const handleRetry = () => {
    if (changeEmail?.pendingEmail) {
      reset();
      sendChangeEmailRequest(changeEmail.pendingEmail);
      setConfirmationCode("");
    }
  };

  const handleCloseModal = () => {
    toggleChangeEmailModal();
  };

  return (
    <AnimatePresence>
      {isChangeEmailModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          exit={{ opacity: 0 }}
          className={styles.bg}
          onClick={handleCloseModal}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            exit={{ opacity: 0, scale: 0.2 }}
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            {successMessage && (
              <p className={styles.success}>{successMessage}</p>
            )}
            {sendRequestError && (
              <p className={styles.error}>{sendRequestError}</p>
            )}
            {confirmCodeError && (
              <p className={styles.error}>{confirmCodeError}</p>
            )}
            <FaTimesCircle
              className={styles.close_icon}
              onClick={handleCloseModal}
            />
            {!isEnterCode && (
              <div className={styles.confirmation}>
                <h2>{t("sendRequest.title")}</h2>
                <input
                  type="email"
                  placeholder={
                    changeEmail?.pendingEmail
                      ? t("sendRequest.inputPlaceholders.other")
                      : t("sendRequest.inputPlaceholders.new")
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={sendRequestError ? styles.error_input : ""}
                />
                <button
                  disabled={
                    !isEmailRegex.test(email) || sendRequestStatus === "loading"
                  }
                  onClick={handleSendRequest}
                >
                  {sendRequestStatus === "loading" ? (
                    <BtnLoader />
                  ) : (
                    t("sendRequest.btn")
                  )}
                </button>
                {changeEmail?.pendingEmail && (
                  <div
                    className={styles.code}
                    onClick={() => {
                      setIsEnterCode(true);
                      reset();
                      setConfirmationCode("");
                      setEmail("");
                    }}
                  >
                    <p>{t("sendRequest.link")}</p>
                    <FaLongArrowAltRight className={styles.arrow_icon} />
                  </div>
                )}
              </div>
            )}
            {isEnterCode && (
              <div className={styles.confirmation}>
                <h2>{t("confirmRequest.title")}</h2>
                <input
                  type="number"
                  placeholder={t("confirmRequest.inputPlaceholder")}
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  className={confirmCodeError ? styles.error_input : ""}
                />
                <button
                  disabled={
                    confirmationCode.length !== 6 ||
                    confirmCodeStatus === "loading"
                  }
                  onClick={handleConfirmCode}
                >
                  {confirmCodeStatus === "loading" ? (
                    <BtnLoader />
                  ) : (
                    t("confirmRequest.btn")
                  )}
                </button>
                <div className={styles.retry}>
                  <p>{t("confirmRequest.retry.text")}</p>
                  <button
                    onClick={handleRetry}
                    disabled={sendRequestStatus === "loading"}
                    className={styles.resend_btn}
                  >
                    {sendRequestStatus === "loading" ? (
                      <BtnLoader />
                    ) : (
                      t("confirmRequest.retry.btn")
                    )}
                  </button>
                </div>
                <div
                  className={styles.request}
                  onClick={() => {
                    setIsEnterCode(false);
                    reset();
                    setConfirmationCode("");
                    setEmail("");
                  }}
                >
                  <FaLongArrowAltLeft className={styles.arrow_icon} />
                  <p>{t("confirmRequest.link")}</p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpdateEmail;
