import { useTranslations } from "next-intl";
import styles from "./LeaveRoomModal.module.scss";

const LeaveRoomModal = ({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  const t = useTranslations("GameRoom.GameControls.leaveRoomModal");

  return (
    <div className={styles.modal_bg} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>{t("title")}</h2>
        <p>{t("paragraph")}</p>
        <div className={styles.actions}>
          <button className={styles.confirm_btn} onClick={onConfirm}>
            {t("btns.leave")}
          </button>
          <button className={styles.cancel_btn} onClick={onCancel}>
            {t("btns.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveRoomModal;
