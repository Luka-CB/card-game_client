import RouteLink from "@/components/RouteLink";
import styles from "./ConfirmEmail.module.scss";
import { SubmitEvent, useEffect, useState } from "react";
import useSendChangePasswordEmailStore from "@/store/email/sendChangePasswordEmailStore";
import BtnLoader from "@/components/loaders/BtnLoader";
import { useTranslations } from "next-intl";

const ConfirmEmail = () => {
  const t = useTranslations("Auth.leftPanel.confirmEmail");

  const { status, sendChangePasswordEmail, error, reset } =
    useSendChangePasswordEmailStore();

  const [email, setEmail] = useState("");

  useEffect(() => {
    if (status === "success") {
      setEmail("");

      const timeout = setTimeout(() => {
        reset();
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [status, reset]);

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email.trim() === "") return;

    sendChangePasswordEmail(email.trim());
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
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">{t("form.label")}</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder={t("form.placeholder")}
          disabled={status === "loading"}
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

export default ConfirmEmail;
