import styles from "./Error.module.scss";
import { FaFaceSadTear } from "react-icons/fa6";
import { IoMdArrowRoundBack } from "react-icons/io";
import { CiWarning } from "react-icons/ci";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const Error = () => {
  const t = useTranslations("Auth.error");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: "spring", delay: 1 }}
      className={styles.container}
    >
      <div className={styles.text_one}>
        <FaFaceSadTear className={styles.icon} />
        <h1>{t("title")}</h1>
      </div>
      <div className={styles.text_two}>
        <p>
          <CiWarning className={styles.icon} />
          {t("message")}
        </p>
        <small>{t("small")}</small>
        <div className={styles.go_back}>
          <IoMdArrowRoundBack className={styles.icon} />
          <Link href="?auth=signin">{t("link")}</Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Error;
