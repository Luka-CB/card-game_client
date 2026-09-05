import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import styles from "./page.module.scss";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "About | Joker Clash",
  description:
    "Learn about Joker Clash – the online multiplayer card game built for real-time play with friends.",
};

const values = ["fairPlay", "fastMatches", "communityDriven"] as const;

const features = [
  "realtimeMultiplayer",
  "classicMechanics",
  "liveScoreboards",
  "responsiveExperience",
  "soundAndAnimations",
] as const;

export default function AboutPage() {
  const t = useTranslations("AboutPage");

  return (
    <main className={styles.about}>
      <section className={styles.hero}>
        <p className={styles.badge}>{t("hero.badge")}</p>
        <h1>{t("hero.title")}</h1>
        <p>{t("hero.paragraph")}</p>
      </section>

      <section className={styles.section}>
        <h2>{t("sectionOne.title")}</h2>
        <p>{t("sectionOne.paragraph")}</p>
      </section>

      <section className={styles.section}>
        <h2>{t("sectionTwo.title")}</h2>
        <ul className={styles.list}>
          {features.map((item) => (
            <li key={item}>{t(`features.${item}`)}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2>{t("sectionThree.title")}</h2>
        <div className={styles.grid}>
          {values.map((item) => (
            <article key={item} className={styles.card}>
              <h3>{t(`values.${item}.title`)}</h3>
              <p>{t(`values.${item}.text`)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>{t("sectionFour.title")}</h2>
        <p>{t("sectionFour.paragraph")}</p>
        <div className={styles.links}>
          <Link href="/rules">{t("sectionFour.links.rules")}</Link>
          <Link href="/privacy">{t("sectionFour.links.privacy")}</Link>
          <Link href="/terms">{t("sectionFour.links.terms")}</Link>
          <Link href="/data-deletion">
            {t("sectionFour.links.dataDeletion")}
          </Link>
        </div>
      </section>

      <section className={styles.cta}>
        <h2>{t("cta.title")}</h2>
        <p>{t("cta.paragraph")}</p>
        <Link href="/rooms" className={styles.ctaBtn}>
          {t("cta.link")}
        </Link>
      </section>
    </main>
  );
}
