import useUserActivityStore from "@/store/user/userActivityStore";
import styles from "./Activities.module.scss";
import { useEffect } from "react";
import { timeAgoStrict } from "@/utils/misc";
import { useLocale, useTranslations } from "next-intl";

const Activities = () => {
  const t = useTranslations("AccountPage.recentActivities");
  const locale = useLocale();

  const { activities, status, fetchUserActivities } = useUserActivityStore();

  useEffect(() => {
    fetchUserActivities();
  }, [fetchUserActivities]);

  return (
    <div className={styles.recent}>
      <h3>{t("title")}</h3>
      <ul>
        {status === "loading" ? (
          <li>Loading...</li>
        ) : status === "failed" ? (
          <li>{t("error")}</li>
        ) : (
          activities.map((a) => (
            <li key={a._id}>
              {a.activity} —{" "}
              <small>{timeAgoStrict(new Date(a.timestamp), locale)}</small>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Activities;
