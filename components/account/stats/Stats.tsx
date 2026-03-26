import useUserStatsStore from "@/store/user/stats/userStatsStore";
import styles from "./Stats.module.scss";
import { useEffect } from "react";
import Loader from "@/components/loaders/Loader";
import Activities from "../recentActivities/Activities";

const Stats = () => {
  const { stats, status, error, fetchStats } = useUserStatsStore();

  useEffect(() => {
    if (stats?._id) return;
    fetchStats();
  }, [stats, fetchStats]);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.stats}>
        <h2>Personal Game Stats</h2>
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
                <div className={styles.statLabel}>Games</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>
                  {stats?.gamesFinished.first}
                </div>
                <div className={styles.statLabel}>1st Place</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>
                  {stats?.gamesFinished.second}
                </div>
                <div className={styles.statLabel}>2nd Place</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>
                  {stats?.gamesFinished.third}
                </div>
                <div className={styles.statLabel}>3rd Place</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>
                  {stats?.gamesFinished.fourth}
                </div>
                <div className={styles.statLabel}>4th Place</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{stats?.gamesLeft}</div>
                <div className={styles.statLabel}>left Games</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{stats?.rating}</div>
                <div className={styles.statLabel}>Rating</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{stats?.topScore}</div>
                <div className={styles.statLabel}>Top score</div>
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
