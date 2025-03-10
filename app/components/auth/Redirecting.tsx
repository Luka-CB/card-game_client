"use client";

import Loader from "../loaders/Loader";
import styles from "./Redirecting.module.scss";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "@/app/store/user/userStore";

const Redirecting = () => {
  const { getUser, user } = useUserStore();

  const router = useRouter();

  useEffect(() => {
    getUser();
  }, [getUser]);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

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
