"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./page.module.scss";
import Image from "next/image";
import useFeedbackStore from "@/store/feedback/submitFeedback";
import useFlashMsgStore from "@/store/flashMsgStore";
import BtnLoader from "@/components/loaders/BtnLoader";

export default function FeedbackPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("bug");
  const [message, setMessage] = useState("");
  const [wordsCount, setWordsCount] = useState(0);
  const [includeMeta, setIncludeMeta] = useState(true);

  const { submitFeedback, state, successMessage, errorMessage } =
    useFeedbackStore();
  const { setMsg } = useFlashMsgStore();

  useEffect(() => {
    if (state === "success") {
      setMsg(successMessage, "success");
      setName("");
      setEmail("");
      setType("bug");
      setMessage("");
      setWordsCount(0);
    }

    if (state === "failed") {
      setMsg(errorMessage, "error");
    }
  }, [state, successMessage, errorMessage, setMsg]);

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
        <h1 className={styles.title}>Send Feedback</h1>
        <p className={styles.subtitle}>
          Found a bug or want a feature? Tell us what happened and how you'd
          like it to work.
        </p>
      </header>

      <main className={styles.main}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.inputs}>
              <label className={styles.label}>
                Your name (optional)
                <input
                  className={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>

              <label className={styles.label}>
                Email (optional)
                <input
                  type="email"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>

              <label className={styles.labelSmall}>
                Type*
                <select
                  className={styles.select}
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="bug">Bug</option>
                  <option value="feature">Feature Request</option>
                  <option value="idea">Idea / UX</option>
                  <option value="other">Other</option>
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
            Message*
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
              placeholder="At least 15 words"
            />
            <p className={styles.word_count}>{wordsCount} / 15 words</p>
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
              Include browser info (helps debugging)
            </label>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.submit}
              type="submit"
              disabled={
                wordsCount < 15 || !message.trim() || state === "loading"
              }
            >
              {state === "loading" ? <BtnLoader /> : "Send feedback"}
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
              disabled={state === "loading"}
            >
              Reset
            </button>
          </div>
        </form>

        <aside className={styles.side}>
          <div className={styles.card}>
            <h3>What to include</h3>
            <ul>
              <li>Steps to reproduce the bug</li>
              <li>Expected vs actual behavior</li>
              <li>Browser and OS (auto-included if allowed)</li>
              <li>Optional screenshot</li>
            </ul>
          </div>

          <div className={styles.card}>
            <h3>Why your feedback helps</h3>
            <p>
              We review reports regularly and triage bug fixes and feature work
              based on impact.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
