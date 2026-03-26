"use client";

import Loader from "../loaders/Loader";
import styles from "./Redirecting.module.scss";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/user/userStore";

const Redirecting = () => {
  const { getUser, user } = useUserStore();

  const router = useRouter();

  useEffect(() => {
    getUser();
  }, [getUser]);

  console.log("Current user in Redirecting component:", user);

  useEffect(() => {
    if (user) {
      console.log("Redirecting to root via router.replace");
      router.replace("/");

      // Fallback for environments where router.replace may be a no-op
      setTimeout(() => {
        if (typeof window !== "undefined" && window.location.pathname !== "/") {
          window.location.href = "/";
        }
      }, 200);
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
