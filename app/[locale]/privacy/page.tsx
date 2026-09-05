import type { Metadata } from "next";
import styles from "./page.module.scss";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "Privacy Policy | Joker Clash",
};

export default function PrivacyPolicyPage() {
  const t = useTranslations("PrivacyPage");

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>{t("title")}</h1>
      <p className={styles.updated}>{t("updated")}</p>
      <p className={styles.intro}>{t("intro")}</p>

      <section className={styles.section}>
        <h2>1. {t("sectionOne.title")}</h2>
        <p>{t("sectionOne.paragraph")}</p>
        <ul>
          <li>
            <strong>{t("sectionOne.ul.liOne.strong")}</strong>{" "}
            {t("sectionOne.ul.liOne.normal")}
          </li>
          <li>
            <strong>{t("sectionOne.ul.liTwo.strong")}</strong>{" "}
            {t("sectionOne.ul.liTwo.normal")}
          </li>
          <li>
            <strong>{t("sectionOne.ul.liThree.strong")}</strong>{" "}
            {t("sectionOne.ul.liThree.normal")}
          </li>
          <li>
            <strong>{t("sectionOne.ul.liFour.strong")}</strong>{" "}
            {t("sectionOne.ul.liFour.normal")}
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>2. {t("sectionTwo.title")}</h2>
        <p>{t("sectionTwo.paragraph")}</p>
        <ul>
          <li>{t("sectionTwo.ul.liOne")}</li>
          <li>{t("sectionTwo.ul.liTwo")}</li>
          <li>{t("sectionTwo.ul.liThree")}</li>
          <li>{t("sectionTwo.ul.liFour")}</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>3. {t("sectionThree.title")}</h2>
        <p>{t("sectionThree.paragraph")}</p>
        <ul>
          <li>
            <strong>{t("sectionThree.ul.liOne.strong")}</strong>{" "}
            {t("sectionThree.ul.liOne.normal")}
          </li>
          <li>
            <strong>{t("sectionThree.ul.liTwo.strong")}</strong>{" "}
            {t("sectionThree.ul.liTwo.normal")}
          </li>
          <li>
            <strong>{t("sectionThree.ul.liThree.strong")}</strong>{" "}
            {t("sectionThree.ul.liThree.normal")}
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>4. {t("sectionFour.title")}</h2>
        <p>{t("sectionFour.paragraph")}</p>
      </section>

      <section className={styles.section}>
        <h2>5. {t("sectionFive.title")}</h2>
        <ul>
          <li>
            <strong>{t("sectionFive.ul.liOne.strong")}</strong>{" "}
            {t("sectionFive.ul.liOne.normal")}
          </li>
          <li>
            <strong>{t("sectionFive.ul.liTwo.strong")}</strong>{" "}
            {t("sectionFive.ul.liTwo.normal")}
          </li>
          <li>
            <strong>{t("sectionFive.ul.liThree.strong")}</strong>{" "}
            {t("sectionFive.ul.liThree.normal")}
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>6. {t("sectionSix.title")}</h2>
        <p>{t("sectionSix.paragraph")}</p>
      </section>

      <section className={styles.section}>
        <h2>7. {t("sectionSeven.title")}</h2>
        <p>{t("sectionSeven.paragraph")}</p>

        <h3>{t("sectionSeven.subtitleOne")}</h3>
        <ol>
          <li>
            {t("sectionSeven.olOne.liOne.normal")}{" "}
            <em>{t("sectionSeven.olOne.liOne.em")}</em>
          </li>
          <li>
            {t("sectionSeven.olOne.liTwo.normal")}{" "}
            <em>{t("sectionSeven.olOne.liTwo.em")}</em>{" "}
            {t("sectionSeven.olOne.liTwo.normalTwo")}
          </li>
          <li>
            {t("sectionSeven.olOne.liThree.normal")}{" "}
            <strong>{t("sectionSeven.olOne.liThree.strong")}</strong>{" "}
            {t("sectionSeven.olOne.liThree.normalTwo")}{" "}
            <em>{t("sectionSeven.olOne.liThree.em")}</em>{" "}
            {t("sectionSeven.olOne.liThree.normalThree")}
          </li>
        </ol>

        <h3>{t("sectionSeven.subtitleTwo")}</h3>
        <ol>
          <li>
            {t("sectionSeven.olTwo.liOne.normal")}{" "}
            <em>{t("sectionSeven.olTwo.liOne.em")}</em>
          </li>
          <li>
            {t("sectionSeven.olTwo.liTwo.normal")}{" "}
            <em>{t("sectionSeven.olTwo.liTwo.em")}</em>
          </li>
          <li>
            {t("sectionSeven.olTwo.liThree.normal")}{" "}
            <em>{t("sectionSeven.olTwo.liThree.em")}</em>,{" "}
            {t("sectionSeven.olTwo.liThree.normalTwo")}{" "}
            <strong>{t("sectionSeven.olTwo.liThree.strong")}</strong>,{" "}
            {t("sectionSeven.olTwo.liThree.normalThree")}
          </li>
        </ol>

        <h3>{t("sectionSeven.subtitleThree")}</h3>
        <ol>
          <li>{t("sectionSeven.olThree.liOne.normal")}</li>
          <li>
            {t("sectionSeven.olThree.liTwo.normal")}{" "}
            <em>{t("sectionSeven.olThree.liTwo.em")}</em>{" "}
            {t("sectionSeven.olThree.liTwo.normalTwo")}{" "}
            <strong>{t("sectionSeven.olThree.liTwo.strong")}</strong>{" "}
            {t("sectionSeven.olThree.liTwo.normalThree")}
          </li>
          <li>{t("sectionSeven.olThree.liThree.normal")}</li>
        </ol>

        <p>
          {t("sectionSeven.paragraphTwo.text")}{" "}
          <Link href="/data-deletion">
            {t("sectionSeven.paragraphTwo.link")}
          </Link>{" "}
          {t("sectionSeven.paragraphTwo.textTwo")}{" "}
          <a href="mailto:support@jokerclash.com">support@jokerclash.com</a>{" "}
          {t("sectionSeven.paragraphTwo.textThree")}
        </p>
      </section>

      <section className={styles.section}>
        <h2>{t("sectionEight.title")}</h2>
        <p>
          {t("sectionEight.paragraph")}{" "}
          <a href="mailto:support@jokerclash.com">support@jokerclash.com</a>
        </p>
      </section>
    </main>
  );
}
