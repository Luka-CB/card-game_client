"use client";

import Loader from "../loaders/Loader";
import styles from "./Redirecting.module.scss";

const Redirecting = () => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.loader}>
          <Loader />
        </div>
        <span>Redirecting...</span>
      </div>
    </div>
  );
};

export default Redirecting;
