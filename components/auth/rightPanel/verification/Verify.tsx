"use client";

import useSignupStore from "@/store/auth/signupStore";
import Loader from "../../../loaders/Loader";
import styles from "./Verify.module.scss";
import { useEffect } from "react";
import useUserStore from "@/store/user/userStore";
import { Link, useRouter } from "@/i18n/navigation";
import { CiWarning } from "react-icons/ci";
import useChangeEmailStore from "@/store/email/changeEmailStore";
import useSendVerifyEmailStore from "@/store/email/sendVerifyEmailStore";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Links from "../../Links";
import useWindowSize from "@/hooks/useWindowSize";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Verify = () => {
  const t = useTranslations("Auth.rightPanel.verify");
  const locale = useLocale();

  const { email, status, sendEmail, error } = useSendVerifyEmailStore();
  const { status: signupStatus, reset: signupReset } = useSignupStore();
  const { status: changeEmailStatus, reset: changeEmailReset } =
    useChangeEmailStore();
  const { user } = useUserStore();
  const windowWidth = useWindowSize().width;

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!user && !email) {
      router.push("/?auth=signin");
    }
  }, [user, email, router]);

  useEffect(() => {
    if (signupStatus === "success" || changeEmailStatus === "success") {
      sendEmail();
      signupReset();
      changeEmailReset();
    }
  }, [
    signupStatus,
    changeEmailStatus,
    sendEmail,
    signupReset,
    changeEmailReset,
  ]);

  if (status === "loading") {
    return (
      <div className={styles.loader}>
        <Loader />
      </div>
    );
  }

  const handleRoute = (routeName: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("auth", routeName);
    router.push(`?${newParams.toString()}`);
  };

  return (
    <div className={styles.container} data-locale={locale}>
      {status === "failed" && (
        <div className={styles.error}>
          <h4>{error}</h4>
        </div>
      )}

      {windowWidth <= 900 && (
        <div className={styles.language_switcher}>
          <LanguageSwitcher />
        </div>
      )}

      {windowWidth <= 900 && (
        <div className={styles.info_verify}>
          <h1>
            {t("infoVerify.title.normal")}{" "}
            <span>{t("infoVerify.title.span")}</span>
          </h1>
        </div>
      )}
      {status === "success" && signupStatus === "success" ? (
        <h3>{t("msgs.msgOne")}</h3>
      ) : status === "success" && changeEmailStatus === "success" ? (
        <h3>{t("msgs.msgTwo")}</h3>
      ) : status === "success" ? (
        <h3>{t("msgs.msgThree")}</h3>
      ) : null}
      <div className={styles.resend}>
        <p>{t("paragraph")}</p>
        <small>{t("small")}</small>
        <button
          className={styles.btn}
          onClick={sendEmail}
          disabled={changeEmailStatus === "loading"}
        >
          {t("btn")}
        </button>
      </div>
      <div className={styles.notice}>
        <div className={styles.warning}>
          <CiWarning className={styles.icon} />
          <span className={styles.text_one}>
            {t("notice.warning.text.normal")}{" "}
            <b>{t("notice.warning.text.b")}</b>{" "}
            {t("notice.warning.text.normalTwo")}
          </span>
        </div>
        <span className={styles.text_two}>
          {t("notice.usedEmail")} <b>{email ? email : user?.email}</b>
        </span>
        <span className={styles.text_three}>
          {t("notice.sudgestion.text")}{" "}
          <Link href="/?auth=change-email">{t("notice.sudgestion.link")}</Link>
        </span>
        <span className={styles.text_four}>
          {t("notice.finalSudgestion")}{" "}
          <Link href="mailto:support@jokerclash.com">
            support@jokerclash.com
          </Link>
        </span>
        <div className={styles.go_back_wrapper}>
          <div className={styles.go_back} onClick={() => handleRoute("signin")}>
            <IoMdArrowRoundBack className={styles.icon} />
            <span>{t("goBack")}</span>
          </div>
        </div>
        {windowWidth <= 900 && (
          <div className={styles.links}>
            <Links isSm />
          </div>
        )}
      </div>
    </div>
  );
};

export default Verify;
