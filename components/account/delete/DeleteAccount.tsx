import useDeleteUserStore from "@/store/user/deleteUserStore";
import styles from "./DeleteAccount.module.scss";
import { useTranslations } from "next-intl";

const DeleteAccount = () => {
  const t = useTranslations("AccountPage.delete");

  const { toggleDelModal } = useDeleteUserStore();

  return (
    <div className={styles.deleteWrap}>
      <h3>{t("title")}</h3>
      <p className={styles.deleteNote}>{t("paragraph")}</p>
      <button className={styles.deleteBtn} onClick={toggleDelModal}>
        {t("btn")}
      </button>
    </div>
  );
};

export default DeleteAccount;
