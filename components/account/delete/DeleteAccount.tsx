import useDeleteUserStore from "@/store/user/deleteUserStore";
import styles from "./DeleteAccount.module.scss";

const DeleteAccount = () => {
  const { toggleDelModal } = useDeleteUserStore();

  return (
    <div className={styles.deleteWrap}>
      <h3>Danger zone</h3>
      <p className={styles.deleteNote}>
        Deleting your account will remove all personal data!.
      </p>
      <button className={styles.deleteBtn} onClick={toggleDelModal}>
        Delete account
      </button>
    </div>
  );
};

export default DeleteAccount;
