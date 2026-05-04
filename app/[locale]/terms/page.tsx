import type { Metadata } from "next";
import styles from "./page.module.scss";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "Terms of Service | Joker Clash",
};

export default function TermsPage() {
  const t = useTranslations("TermsPage");

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>{t("title")}</h1>
      <p className={styles.effective}>
        <strong>{t("paragraph.strong")}</strong> {t("paragraph.normal")}
      </p>

      <section className={styles.section}>
        <h2>1. {t("sectionOne.title")}</h2>
        <p>{t("sectionOne.paragraph")}</p>
      </section>

      <section className={styles.section}>
        <h2>2. {t("sectionTwo.title")}</h2>
        <p>{t("sectionTwo.paragraph")}</p>
      </section>

      <section className={styles.section}>
        <h2>3. {t("sectionThree.title")}</h2>
        <p>{t("sectionThree.paragraph")}</p>
      </section>

      <section className={styles.section}>
        <h2>4. {t("sectionFour.title")}</h2>
        <p>{t("sectionFour.paragraph")}</p>
        <ul>
          <li>{t("sectionFour.ul.liOne")}</li>
          <li>{t("sectionFour.ul.liTwo")}</li>
          <li>{t("sectionFour.ul.liThree")}</li>
          <li>{t("sectionFour.ul.liFour")}</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>5. {t("sectionFive.title")}</h2>
        <p>{t("sectionFive.paragraph")}</p>
      </section>

      <section className={styles.section}>
        <h2>6. {t("sectionSix.title")}</h2>
        <p>{t("sectionSix.paragraph")}</p>
      </section>

      <section className={styles.section}>
        <h2>7. {t("sectionSeven.title")}</h2>
        <p>{t("sectionSeven.paragraph")}</p>
      </section>

      <section className={styles.section}>
        <h2>8. {t("sectionEight.title")}</h2>
        <p>{t("sectionEight.paragraph")}</p>
      </section>

      <section className={styles.section}>
        <h2>9. {t("sectionNine.title")}</h2>
        <p>{t("sectionNine.paragraph")}</p>
      </section>

      <section className={styles.section}>
        <h2>10. {t("sectionTen.title")}</h2>
        <p>{t("sectionTen.paragraph")}</p>
      </section>

      <section className={styles.section}>
        <h2>11. {t("sectionEleven.title")}</h2>
        <p>{t("sectionEleven.paragraph")}</p>
      </section>

      <section className={styles.section}>
        <h2>12. {t("sectionTwelve.title")}</h2>
        <p>{t("sectionTwelve.paragraph")}</p>
      </section>

      <section className={styles.section}>
        <h2>13. {t("sectionThirteen.title")}</h2>
        <p>
          {t("sectionThirteen.paragraph")}{" "}
          <a href="mailto:legal@jokerclash.com">legal@jokerclash.com</a>
        </p>
      </section>
    </main>
  );
}
