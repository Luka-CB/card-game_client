"use client";

import { SubmitEvent, useEffect, useState } from "react";
import RouteLink from "../../../RouteLink";
import styles from "./ChangePassword.module.scss";
import { IoMdEye, IoIosEyeOff } from "react-icons/io";
import { motion } from "framer-motion";
import useChangePasswordStore from "@/store/auth/changePasswordStore";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import BtnLoader from "@/components/loaders/BtnLoader";
import { useTranslations } from "next-intl";

const ChangePassword = () => {
  const t = useTranslations("Auth.leftPanel.changePassword");

  const { status, changePassword, reset, error, setError } =
    useChangePasswordStore();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (error) {
      timeout = setTimeout(() => {
        setError(null);
      }, 3000);
    }

    if (status === "success") {
      timeout = setTimeout(() => {
        router.push("/?auth=signin");
        reset();
      }, 3000);
    }

    return () => clearTimeout(timeout);
  }, [status, error, router, setError, reset]);

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password.length < 6) {
      setError(t("msgs.passwordLength"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("msgs.passwordMatch"));
      return;
    }

    if (token) changePassword(password, token);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: "spring", delay: 1 }}
      className={styles.container}
    >
      {status === "success" ? (
        <p className={styles.success}>{t("msgs.success")}</p>
      ) : null}
      {error ? <p className={styles.error}>{error}</p> : null}
      <h2>{t("title")}</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.input_box}>
          <label htmlFor="password">{t("form.password.label")}</label>
          <div className={styles.input_wrapper}>
            <input
              type={visiblePassword ? "text" : "password"}
              name="password"
              id="password"
              className={styles.password_input}
              placeholder={t("form.password.placeholder")}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {visiblePassword ? (
              <div
                onClick={() => setVisiblePassword(false)}
                className={styles.icon}
                title={t("form.hide")}
              >
                <IoMdEye />
              </div>
            ) : (
              <div
                onClick={() => setVisiblePassword(true)}
                className={styles.icon}
                title={t("form.show")}
              >
                <IoIosEyeOff />
              </div>
            )}
          </div>
        </div>
        <div className={styles.input_box}>
          <label htmlFor="confirmPassword">
            {t("form.confirmPassword.label")}
          </label>
          <div className={styles.input_wrapper}>
            <input
              type={visibleConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
              className={styles.password_input}
              placeholder={t("form.confirmPassword.placeholder")}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {visibleConfirmPassword ? (
              <div
                onClick={() => setVisibleConfirmPassword(false)}
                className={styles.icon}
                title={t("form.hide")}
              >
                <IoMdEye />
              </div>
            ) : (
              <div
                onClick={() => setVisibleConfirmPassword(true)}
                className={styles.icon}
                title={t("form.show")}
              >
                <IoIosEyeOff />
              </div>
            )}
          </div>
        </div>
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? <BtnLoader /> : t("form.btn")}
        </button>
      </form>
      <RouteLink route="/?auth=signin" text={t("link")} />
    </motion.div>
  );
};

export default ChangePassword;
