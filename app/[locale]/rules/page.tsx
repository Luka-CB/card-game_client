import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "Rules | Joker Clash",
  description:
    "Learn how to play Joker Clash – rules for Classic, Nines, and Betting game modes.",
};

const classicRounds = ["roundOne", "roundTwo", "roundThree", "roundFour"];

const ninesRounds = ["roundOne", "roundTwo", "roundThree", "roundFour"];

export default function RulesPage() {
  const t = useTranslations("RulesPage");

  return (
    <main className={styles.rules}>
      <section className={styles.hero}>
        <h1>{t("hero.title")}</h1>
        <p>{t("hero.paragraph")}</p>
      </section>

      <section className={styles.section}>
        <h2>{t("sectionOne.title")}</h2>

        <h3>{t("sectionOne.subtitleOne")}</h3>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>{t("sectionOne.tr.thOne")}</th>
                <th>{t("sectionOne.tr.thTwo")}</th>
                <th>{t("sectionOne.tr.thThree")}</th>
              </tr>
            </thead>
            <tbody>
              {classicRounds.map((r) => (
                <tr key={t(`classicRounds.${r}.round`)}>
                  <td>{t(`classicRounds.${r}.round`)}</td>
                  <td>{t(`classicRounds.${r}.hands`)}</td>
                  <td>{t(`classicRounds.${r}.cards`)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3>{t("sectionOne.subtitleTwo")}</h3>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>{t("sectionOne.tr.thOne")}</th>
                <th>{t("sectionOne.tr.thTwo")}</th>
                <th>{t("sectionOne.tr.thThree")}</th>
              </tr>
            </thead>
            <tbody>
              {ninesRounds.map((r) => (
                <tr key={t(`ninesRounds.${r}.round`)}>
                  <td>{t(`ninesRounds.${r}.round`)}</td>
                  <td>{t(`ninesRounds.${r}.hands`)}</td>
                  <td>{t(`ninesRounds.${r}.cards`)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section}>
        <h2>2&#41; {t("sectionTwo.title")}</h2>
        <ol>
          <li>{t("sectionTwo.ol.liOne")}</li>
          <li>{t("sectionTwo.ol.liTwo")}</li>
          <li>{t("sectionTwo.ol.liThree")}</li>
          <li>{t("sectionTwo.ol.liFour")}</li>
          <li>{t("sectionTwo.ol.liFive")}</li>
          <li>{t("sectionTwo.ol.liSix")}</li>
        </ol>
      </section>

      <section className={styles.section}>
        <h2>3&#41; {t("sectionThree.title")}</h2>
        <ul>
          <li>{t("sectionThree.ul.liOne")}</li>
          <li>{t("sectionThree.ul.liTwo")}</li>
          <li>
            {t("sectionThree.ul.liThree.text")}
            <ul>
              <li>
                <b>{t("sectionThree.ul.liThree.ul.liOne.b")}</b>:{" "}
                {t("sectionThree.ul.liThree.ul.liOne.normal")}
              </li>
              <li>
                <b>{t("sectionThree.ul.liThree.ul.liTwo.b")}</b>:{" "}
                {t("sectionThree.ul.liThree.ul.liTwo.normal")}
              </li>
            </ul>
          </li>
          <li>{t("sectionThree.ul.liFour")}</li>
          <li>{t("sectionThree.ul.liFive")}</li>
          <li>{t("sectionThree.ul.liSix")}</li>
          <li>{t("sectionThree.ul.liSeven")}</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>4&#41; {t("sectionFour.title")}</h2>

        <h3>{t("sectionFour.subtitleOne")}</h3>
        <p>
          {t("sectionFour.paragraphOne.text")}
          <br />
          {t("sectionFour.paragraphOne.textTwo")}{" "}
          <code>{t("sectionFour.paragraphOne.code")}</code>
        </p>

        <h3>{t("sectionFour.subtitleTwo")}</h3>
        <p>
          {t("sectionFour.paragraphTwo.text")}
          <br />
          {t("sectionFour.paragraphTwo.textTwo")}{" "}
          <code>{t("sectionFour.paragraphTwo.code")}</code>
        </p>

        <h3>{t("sectionFour.subtitleThree")}</h3>
        <p>
          {t("sectionFour.paragraphThree.text")}
          <br />
          {t("sectionFour.paragraphThree.textTwo")}{" "}
          <code>{t("sectionFour.paragraphThree.code")}</code>
        </p>

        <h3>{t("sectionFour.subtitleFour")}</h3>
        <p>
          {t("sectionFour.paragraphFour")} <code> -200 </code> /{" "}
          <code>-500</code> / <code>-900</code>
        </p>
      </section>

      <section className={styles.section}>
        <h2>5&#41; {t("sectionFive.title")}</h2>

        <h3>{t("sectionFive.subtitleOne")}</h3>
        <ul>
          <li>{t("sectionFive.ulOne.liOne")}</li>
          <li>{t("sectionFive.ulOne.liTwo")}</li>
          <li>{t("sectionFive.ulOne.liThree")}</li>
          <li>{t("sectionFive.ulOne.liFour")}</li>
        </ul>
        <p>
          {t("sectionFive.paragraph.text")}{" "}
          <b>{t("sectionFive.paragraph.b")}</b>{" "}
          {t("sectionFive.paragraph.textTwo")}
        </p>

        <h3>{t("sectionFive.subtitleTwo")}</h3>
        <ul>
          <li>{t("sectionFive.ulTwo.liOne")}</li>
          <li>
            {t("sectionFive.ulTwo.liTwo.normal")}{" "}
            <code>{t("sectionFive.ulTwo.liTwo.code")}</code>
          </li>
          <li>
            {t("sectionFive.ulTwo.liThree.normal")}{" "}
            <code>{t("sectionFive.ulTwo.liThree.code")}</code>
          </li>
        </ul>
      </section>
    </main>
  );
}
