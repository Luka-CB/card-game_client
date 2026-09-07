import useUserStatsStore from "@/store/user/stats/userStatsStore";
import styles from "./Stats.module.scss";
import { useEffect } from "react";
import Loader from "@/components/loaders/Loader";
import Activities from "../recentActivities/Activities";
import { useLocale, useTranslations } from "next-intl";

const Stats = () => {
  const t = useTranslations("AccountPage.stats");
  const locale = useLocale();

  const { stats, status, error, fetchStats } = useUserStatsStore();

  useEffect(() => {
    if (stats?._id) return;
    fetchStats();
  }, [stats, fetchStats]);

  return (
    <aside className={styles.sidebar} data-locale={locale}>
      <div className={styles.stats}>
        <h2>{t("title")}</h2>
        <div className={styles.statGrid}>
          {status === "loading" ? (
            <div className={styles.loader}>
              <Loader />
            </div>
          ) : status === "failed" ? (
            <p className={styles.error}>{error}</p>
          ) : (
            <>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{stats?.gamesPlayed}</div>
                <div className={styles.statLabel}>{t("grid.gridOne")}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>
                  {stats?.gamesFinished.first}
                </div>
                <div className={styles.statLabel}>{t("grid.gridTwo")}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>
                  {stats?.gamesFinished.second}
                </div>
                <div className={styles.statLabel}>{t("grid.gridThree")}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>
                  {stats?.gamesFinished.third}
                </div>
                <div className={styles.statLabel}>{t("grid.gridFour")}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>
                  {stats?.gamesFinished.fourth}
                </div>
                <div className={styles.statLabel}>{t("grid.gridFive")}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{stats?.gamesLeft}</div>
                <div className={styles.statLabel}>{t("grid.gridSix")}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{stats?.rating}</div>
                <div className={styles.statLabel}>{t("grid.gridSeven")}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{stats?.topScore}</div>
                <div className={styles.statLabel}>{t("grid.gridEight")}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{stats?.level}</div>
                <div className={styles.statLabel}>{t("grid.gridNine")}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{stats?.progressionScore}</div>
                <div className={styles.statLabel}>{t("grid.gridTen")}</div>
              </div>
            </>
          )}
        </div>
      </div>
      <Activities />
    </aside>
  );
};

export default Stats;
