import useDeleteUserStore from "@/store/user/deleteUserStore";
import styles from "./DeleteAccount.module.scss";

const DeleteAccount = () => {
  const { toggleDelModal } = useDeleteUserStore();

  function handleDelete() {
    // Dummy delete flow — replace with API call when ready
    if (
      confirm(
        "Are you sure you want to delete your account? This is a dummy action.",
      )
    ) {
      console.log("Account delete (dummy)");
    }
  }

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
