"use client";

import useSessionUserStore from "@/app/store/sessionUserStore";
import Loader from "../loaders/Loader";
import styles from "./Redirecting.module.scss";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "@/app/store/userStore";

const Redirecting = () => {
  const { status, getSessionUser, data } = useSessionUserStore();

  const router = useRouter();

  useEffect(() => {
    if (status === "success") {
      router.push("/");
      useUserStore.setState({ user: data });
    }
  }, [status, router]);

  useEffect(() => {
    getSessionUser();
  }, []);

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
