import styles from "./DeleteModal.module.scss";
import { FaTimesCircle } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import useDeleteUserStore from "@/store/user/deleteUserStore";
import { useEffect, useState } from "react";
import useFlashMsgStore from "@/store/flashMsgStore";
import BtnLoader from "@/components/loaders/BtnLoader";

const deletionReasons = [
  { value: "I have privacy concerns", reasonNumber: 1 },
  { value: "I receive too many emails", reasonNumber: 2 },
  { value: "I want to create a new account", reasonNumber: 3 },
  { value: "I no longer find the service useful", reasonNumber: 4 },
  { value: "Platform has too many bugs", reasonNumber: 5 },
  { value: "I waste too much time on the platform", reasonNumber: 6 },
];

const DeleteModal = () => {
  const { isDelModalOpen, toggleDelModal, deleteAccount, state, error } =
    useDeleteUserStore();
  const { setMsg } = useFlashMsgStore();
  const [selectedReason, setSelectedReason] = useState<{
    value: string;
    reasonNumber: number;
  } | null>(null);
  const [additionalFeedback, setAdditionalFeedback] = useState("");

  useEffect(() => {
    let timout: NodeJS.Timeout;

    if (state === "failed" && error) {
      setMsg(error, "error");
    }

    if (state === "success") {
      setMsg("Account deleted successfully.", "success");

      timout = setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    }

    return () => clearTimeout(timout);
  }, [state, setMsg, error]);

  useEffect(() => {
    if (isDelModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isDelModalOpen]);

  const handleDelete = () => {
    if (!selectedReason) {
      setMsg("Please select a reason for deletion.", "error");
      return;
    }

    deleteAccount(selectedReason, additionalFeedback);
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
          >
            <FaTimesCircle
              className={styles.close_icon}
              onClick={handleCancelDelete}
            />
            <h2>Are you sure you want to delete your account?</h2>
            <p>
              This action is irreversible. All your data will be permanently
              deleted.
            </p>
            <hr />
            <h3>Please let us know why you're leaving (pick one):</h3>
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
                    {reason.value}
                  </label>
                </div>
              ))}
            </div>
            <div className={styles.additional_feedback}>
              <label htmlFor="additionalFeedback">
                Additional feedback (optional):
              </label>
              <textarea
                id="additionalFeedback"
                value={additionalFeedback}
                onChange={(e) => setAdditionalFeedback(e.target.value)}
                placeholder="Your feedback helps us improve our service."
              />
            </div>
            <hr />
            <div className={styles.buttons}>
              <button
                className={styles.cancel}
                onClick={handleCancelDelete}
                disabled={state === "loading"}
              >
                Cancel
              </button>
              <button
                className={styles.delete}
                disabled={!selectedReason || state === "loading"}
                onClick={handleDelete}
              >
                {state === "loading" ? <BtnLoader /> : "Delete Account"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteModal;
