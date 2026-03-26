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

  useEffect(() => {
    if (user) {
      const url = new URL(window.location.href);
      url.searchParams.delete("auth");
      const newPath = `${url.pathname}${url.search}`;
      router.replace(newPath);
      router.refresh();

      setTimeout(() => {
        if (window.location.href.includes("auth=redirecting"))
          window.location.href = newPath;
      }, 300);
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
