import useUserActivityStore from "@/store/user/userActivityStore";
import styles from "./Activities.module.scss";
import { useEffect } from "react";
import { timeAgoStrict } from "@/utils/misc";

const Activities = () => {
  const { activities, state, fetchUserActivities } = useUserActivityStore();

  useEffect(() => {
    fetchUserActivities();
  }, [fetchUserActivities]);

  return (
    <div className={styles.recent}>
      <h3>Recent Activity</h3>
      <ul>
        {state === "loading" ? (
          <li>Loading...</li>
        ) : state === "failed" ? (
          <li>Error loading activities</li>
        ) : (
          activities.map((a) => (
            <li key={a._id}>
              {a.activity} —{" "}
              <small>{timeAgoStrict(new Date(a.timestamp))}</small>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Activities;
