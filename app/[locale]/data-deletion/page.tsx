import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import styles from "./page.module.scss";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "Data Deletion | Joker Clash",
  description: "Request deletion of your Joker Clash account data.",
};

export default function Page() {
  const t = useTranslations("DataDeletionPage");

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>{t("title")}</h1>

        <p className={styles.lead}>{t("lead")}</p>

        <ol className={styles.steps}></ol>
        <section className={styles.provider}>
          <h2 className={styles.providerTitle}>{t("providerOne.name")}</h2>
          <ul className={styles.steps}>
            <li>
              <strong>{t("providerOne.steps.stepOne.strong")}</strong>{" "}
              {t("providerOne.steps.stepOne.normal")}{" "}
              <em>{t("providerOne.steps.stepOne.em")}</em>.
            </li>
            <li>
              <strong>{t("providerOne.steps.stepTwo.strong")}</strong>{" "}
              {t("providerOne.steps.stepTwo.normal")}{" "}
            </li>
            <li>
              <strong>{t("providerOne.steps.stepThree.strong")}</strong>{" "}
              {t("providerOne.steps.stepThree.normal")}{" "}
              <em>{t("providerOne.steps.stepThree.em")}</em>{" "}
              {t("providerOne.steps.stepThree.normalTwo")}
            </li>
          </ul>
        </section>

        <section className={styles.provider}>
          <h2 className={styles.providerTitle}>{t("providerTwo.name")}</h2>
          <ul className={styles.steps}>
            <li>
              <strong>{t("providerTwo.steps.stepOne.strong")}</strong>{" "}
              {t("providerTwo.steps.stepOne.normal")}{" "}
              <em>{t("providerTwo.steps.stepOne.em")}</em>{" "}
              (myaccount.google.com).
            </li>
            <li>
              {t("providerTwo.steps.stepTwo.normal")}{" "}
              <em>{t("providerTwo.steps.stepTwo.em")}</em>{" "}
              {t("providerTwo.steps.stepTwo.normalTwo")}{" "}
              <em>{t("providerTwo.steps.stepTwo.emTwo")}</em> (
              {t("providerTwo.steps.stepTwo.normalThree")}{" "}
              <em>{t("providerTwo.steps.stepTwo.emThree")}</em>).
            </li>
            <li>
              {t("providerTwo.steps.stepThree.normal")}{" "}
              <strong>{t("providerTwo.steps.stepThree.strong")}</strong>,{" "}
              {t("providerTwo.steps.stepThree.normalTwo")}{" "}
              <strong>{t("providerTwo.steps.stepThree.strongTwo")}</strong>,{" "}
              {t("providerTwo.steps.stepThree.normalThree")}{" "}
              <em>{t("providerTwo.steps.stepThree.em")}</em>.
            </li>
          </ul>
        </section>

        <section className={styles.provider}>
          <h2 className={styles.providerTitle}>{t("providerThree.name")}</h2>
          <ul className={styles.steps}>
            <li>
              <strong>{t("providerThree.steps.stepOne.strong")}</strong>{" "}
              {t("providerThree.steps.stepOne.normal")}
            </li>
            <li>
              {t("providerThree.steps.stepTwo.normal")}{" "}
              <em>{t("providerThree.steps.stepTwo.em")}</em>{" "}
              {t("providerThree.steps.stepTwo.normalTwo")}{" "}
              <strong>{t("providerThree.steps.stepTwo.strong")}</strong>{" "}
              {t("providerThree.steps.stepTwo.normalThree")}
            </li>
            <li>{t("providerThree.steps.stepThree.normal")} </li>
          </ul>

          <p className={styles.optional}>
            {t("providerThree.optional.text")}{" "}
            <Link href="/?auth-signin" className={styles.link}>
              {t("providerThree.optional.link")}
            </Link>{" "}
            {t("providerThree.optional.textTwo")}{" "}
            <a className={styles.link} href="mailto:support@jokerclash.com">
              support@jokerclash.com
            </a>
            .
          </p>
        </section>

        <p className={styles.note}>{t("note")}</p>

        <p className={styles.note}>{t("noteTwo")}</p>
      </div>
    </main>
  );
}
