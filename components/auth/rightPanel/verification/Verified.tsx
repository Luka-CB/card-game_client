"use client";

import styles from "./Verified.module.scss";
import { FaCheck } from "react-icons/fa";
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Loader from "@/components/loaders/Loader";
import useVerifyStore from "@/store/email/verifyStore";
import useUserStore from "@/store/user/userStore";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const Verified = () => {
  const t = useTranslations("Auth.rightPanel.verified");

  const { status, verifyEmail, error } = useVerifyStore();
  const { setIsVerified } = useUserStore();

  const [countDown, setCountDown] = useState(10);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) verifyEmail(token);
  }, [token, verifyEmail]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (countDown < 1) {
      if (status === "success") {
        router.push("/");
        setIsVerified(true);
      } else if (status === "failed") {
        router.push("/?auth=verify");
      }
    } else {
      timeout = setTimeout(() => {
        setCountDown((prev) => prev - 1);
      }, 1000);
    }

    return () => clearTimeout(timeout);
  }, [status, countDown, router, setIsVerified]);

  if (status === "loading") {
    return (
      <div className={styles.loader}>
        <Loader />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className={styles.error}>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, type: "spring", delay: 0.4 }}
          className={styles.icon}
        >
          <MdOutlineReportGmailerrorred />
        </motion.div>
        <h1>{t("failed.title")}</h1>
        <p>{error || t("failed.error")}</p>
        <small>
          {t("failed.small.textOne")} <b>{countDown}</b>{" "}
          {t("failed.small.textTwo")}
        </small>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {status === "success" ? (
        <motion.div
          animate={{ borderColor: "#005c2b" }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={styles.icon_wrapper}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, type: "spring", delay: 0.4 }}
            className={styles.icon}
          >
            <FaCheck />
          </motion.div>
        </motion.div>
      ) : null}
      <h1>{t("success.title")}</h1>
      <small>
        {t("success.small.textOne")} <b>{countDown}</b>{" "}
        {t("success.small.textTwo")}
      </small>
    </div>
  );
};

export default Verified;
