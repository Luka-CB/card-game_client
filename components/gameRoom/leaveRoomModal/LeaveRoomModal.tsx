import styles from "./LeaveRoomModal.module.scss";

const LeaveRoomModal = ({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  return (
    <div className={styles.modal_bg} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>Are you sure you want to leave?</h2>
        <p>If you leave, you won't be able to rejoin and will lose points.</p>
        <div className={styles.actions}>
          <button className={styles.confirm_btn} onClick={onConfirm}>
            Leave
          </button>
          <button className={styles.cancel_btn} onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveRoomModal;
