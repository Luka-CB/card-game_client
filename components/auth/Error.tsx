import styles from "./Error.module.scss";
import { FaFaceSadTear } from "react-icons/fa6";
import { IoMdArrowRoundBack } from "react-icons/io";
import { CiWarning } from "react-icons/ci";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { IoClose } from "react-icons/io5";

const Error = () => {
  const t = useTranslations("Auth.error");
  const searchParams = useSearchParams();
  const router = useRouter();
  const errorCode = searchParams.get("errorCode")?.trim();
  const serverErrorMessage = searchParams.get("error")?.trim();
  const translatedError = errorCode ? t(errorCode) : "";

  const handleClose = () => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("auth", "signin");
    nextParams.delete("error");
    router.replace(`?${nextParams.toString()}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: "spring", delay: 1 }}
      className={styles.container}
    >
      <button
        type="button"
        className={styles.close_btn}
        onClick={handleClose}
        aria-label={t("close") || "Close"}
      >
        <IoClose className={styles.close_icon} />
      </button>
      <div className={styles.text_one}>
        <FaFaceSadTear className={styles.icon} />
        <h1>{t("title")}</h1>
      </div>
      <div className={styles.text_two}>
        <p>
          <CiWarning className={styles.icon} />
          {translatedError || serverErrorMessage || t("paragraph")}
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
