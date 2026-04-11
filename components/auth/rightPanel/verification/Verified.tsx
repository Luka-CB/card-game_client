"use client";

import styles from "./Verified.module.scss";
import { FaCheck } from "react-icons/fa";
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Loader from "@/components/loaders/Loader";
import useVerifyStore from "@/store/email/verifyStore";
import useUserStore from "@/store/user/userStore";
import { useRouter, useSearchParams } from "next/navigation";

const Verified = () => {
  const { status, verifyEmail, error } = useVerifyStore();
  const { setIsVerified } = useUserStore();

  const [countDown, setCountDown] = useState(10);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) verifyEmail(token);
  }, [token, verifyEmail]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (countDown < 1) {
      if (status === "success") {
        router.push("/");
        setIsVerified(true);
      } else if (status === "failed") {
        router.push("/?auth=verify");
      }
    } else {
      timeout = setTimeout(() => {
        setCountDown((prev) => prev - 1);
      }, 1000);
    }

    return () => clearTimeout(timeout);
  }, [status, countDown, router, setIsVerified]);

  if (status === "loading") {
    return (
      <div className={styles.loader}>
        <Loader />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className={styles.error}>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, type: "spring", delay: 0.4 }}
          className={styles.icon}
        >
          <MdOutlineReportGmailerrorred />
        </motion.div>
        <h1>Verification Failed!</h1>
        <p>{error || "An error occurred during email verification."}</p>
        <small>
          Redirecting to the request page in <b>{countDown}</b> seconds
        </small>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {status === "success" ? (
        <motion.div
          animate={{ borderColor: "#005c2b" }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={styles.icon_wrapper}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, type: "spring", delay: 0.4 }}
            className={styles.icon}
          >
            <FaCheck />
          </motion.div>
        </motion.div>
      ) : null}
      <h1>Congratulations! Your account activated successfully.</h1>
      <small>
        Redirecting to the main page in <b>{countDown}</b> seconds
      </small>
    </div>
  );
};

export default Verified;
