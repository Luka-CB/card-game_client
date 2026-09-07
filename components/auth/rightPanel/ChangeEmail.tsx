"use client";

import { SubmitEvent, useCallback, useEffect, useState } from "react";
import useUserStore from "@/store/user/userStore";
import styles from "./ChangeEmail.module.scss";
import useChangeEmailStore from "@/store/email/changeEmailStore";
import BtnLoader from "../../loaders/BtnLoader";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useLocale, useTranslations } from "next-intl";

const ChangeEmail = () => {
  const t = useTranslations("Auth.rightPanel.changeEmail");
  const locale = useLocale();

  const router = useRouter();
  const searchParams = useSearchParams();

  const { user } = useUserStore();
  const { status, updateEmail } = useChangeEmailStore();

  const [email, setEmail] = useState("");

  const handleRoute = useCallback(
    (routeName: string) => {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set("auth", routeName);
      router.push(`?${newParams.toString()}`);
    },
    [router, searchParams],
  );

  useEffect(() => {
    if (status === "success") {
      handleRoute("verify");
      setEmail("");
    }
  }, [status, router, handleRoute]);

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateEmail(email);
  };

  return (
    <div className={styles.container} data-locale={locale}>
      <h1>{t("title")}</h1>
      <p>
        <b>{user?.email}</b>: {t("currentEmail")}
      </p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">{t("form.label")}</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder={t("form.placeholder")}
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? <BtnLoader /> : t("form.btn")}
        </button>
      </form>
      <div className={styles.go_back_wrapper}>
        <div className={styles.go_back} onClick={() => handleRoute("verify")}>
          <IoMdArrowRoundBack className={styles.icon} />
          <span>{t("goBack")}</span>
        </div>
      </div>
    </div>
  );
};

export default ChangeEmail;
