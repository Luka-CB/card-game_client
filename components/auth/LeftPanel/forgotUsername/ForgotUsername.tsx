import { SubmitEvent, useEffect, useState } from "react";
import styles from "./ForgotUsername.module.scss";
import BtnLoader from "@/components/loaders/BtnLoader";
import RouteLink from "@/components/RouteLink";
import useUsernameRecoveryStore from "@/store/email/usernameRecovery";
import { useTranslations } from "next-intl";

const ForgotUsername = () => {
  const t = useTranslations("Auth.leftPanel.forgotUsername");

  const [email, setEmail] = useState("");

  const { status, sendUsernameRecoveryEmail, error, reset } =
    useUsernameRecoveryStore();

  useEffect(() => {
    if (status === "success") {
      setEmail("");

      const timeout = setTimeout(() => {
        reset();
      }, 10_000 * 60);

      return () => clearTimeout(timeout);
    }
  }, [status, reset]);

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email.trim() === "") return;

    sendUsernameRecoveryEmail(email.trim());
  };

  return (
    <div className={styles.container}>
      {status === "success" ? (
        <div className={styles.success}>
          <p>{t("success.paragraph")}</p>
          <small>{t("success.small")}</small>
        </div>
      ) : null}
      {status === "failed" && error ? (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      ) : null}
      <h2>{t("title")}</h2>
      <small>{t("small")}</small>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">{t("form.label")}</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder={t("form.placeholder")}
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          disabled={status === "loading" || email.trim() === ""}
        >
          {status === "loading" ? <BtnLoader /> : t("form.btn")}
        </button>
      </form>
      <RouteLink route="/?auth=signin" text={t("link")} />
    </div>
  );
};

export default ForgotUsername;
