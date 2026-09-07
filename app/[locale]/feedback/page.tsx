"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.scss";
import Image from "next/image";
import useFeedbackStore from "@/store/feedback/submitFeedback";
import useFlashMsgStore from "@/store/flashMsgStore";
import BtnLoader from "@/components/loaders/BtnLoader";
import { useTranslations } from "next-intl";

export default function FeedbackPage() {
  const t = useTranslations("FeedbackPage");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("bug");
  const [message, setMessage] = useState("");
  const [wordsCount, setWordsCount] = useState(0);
  const [includeMeta, setIncludeMeta] = useState(true);

  const { submitFeedback, status, successMessage, errorMessage } =
    useFeedbackStore();
  const { setMsg } = useFlashMsgStore();

  useEffect(() => {
    if (status === "success") {
      setMsg(successMessage, "success");
      setName("");
      setEmail("");
      setType("bug");
      setMessage("");
      setWordsCount(0);
    }

    if (status === "failed") {
      setMsg(errorMessage, "error");
    }
  }, [status, successMessage, errorMessage, setMsg]);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!message.trim() && wordsCount < 15) return;

    let browserInfo = null;
    if (includeMeta) {
      browserInfo = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        screen: {
          width: window.screen.width,
          height: window.screen.height,
        },
      };
    }

    await submitFeedback({
      name,
      email,
      type,
      message,
      browserInfo,
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.subtitle}>{t("subtitle")}</p>
      </header>

      <main className={styles.main}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.inputs}>
              <label className={styles.label}>
                {t("inputs.labels.name")}
                <input
                  className={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>

              <label className={styles.label}>
                {t("inputs.labels.email")}
                <input
                  type="email"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>

              <label className={styles.labelSmall}>
                {t("select.label")}*
                <select
                  className={styles.select}
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="bug">{t("select.options.one")}</option>
                  <option value="feature">{t("select.options.two")}</option>
                  <option value="idea">{t("select.options.three")}</option>
                  <option value="other">{t("select.options.four")}</option>
                </select>
              </label>
            </div>
            <div className={styles.feedback_image}>
              <Image
                src="/feedback.png"
                alt="Feedback"
                width={320}
                height={240}
                loading="eager"
                className={styles.image}
              />
            </div>
          </div>

          <label className={styles.labelFull}>
            {t("textarea.label")}*
            <textarea
              className={styles.textarea}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setWordsCount(
                  e.target.value.split(/\s+/).filter(Boolean).length,
                );
              }}
              rows={8}
              placeholder={t("textarea.placeholder")}
            />
            <p className={styles.word_count}>
              {wordsCount} / {t("textarea.wordCount")}
            </p>
          </label>

          <div className={styles.optionsRow}>
            <input
              type="checkbox"
              id="incl"
              name="incl"
              checked={includeMeta}
              onChange={(e) => setIncludeMeta(e.target.checked)}
            />
            <label htmlFor="incl" className={styles.option}>
              {t("checkbox.label")}
            </label>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.submit}
              type="submit"
              disabled={
                wordsCount < 15 || !message.trim() || status === "loading"
              }
            >
              {status === "loading" ? <BtnLoader /> : t("actions.submit")}
            </button>
            <button
              type="button"
              className={styles.secondary}
              onClick={() => {
                setName("");
                setEmail("");
                setType("bug");
                setMessage("");
                setWordsCount(0);
              }}
              disabled={status === "loading"}
            >
              {t("actions.reset")}
            </button>
          </div>
        </form>

        <aside className={styles.side}>
          <div className={styles.card}>
            <h3>{t("aside.cardOne.title")}</h3>
            <ul>
              <li>{t("aside.cardOne.ul.liOne")}</li>
              <li>{t("aside.cardOne.ul.liTwo")}</li>
              <li>{t("aside.cardOne.ul.liThree")}</li>
            </ul>
          </div>

          <div className={styles.card}>
            <h3>{t("aside.cardTwo.title")}</h3>
            <p>{t("aside.cardTwo.paragraph")}</p>
          </div>
        </aside>
      </main>
    </div>
  );
}
