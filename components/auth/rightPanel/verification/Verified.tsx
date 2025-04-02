"use client";

import styles from "./Verified.module.scss";
import { FaCheck } from "react-icons/fa";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Loader from "@/components/loaders/Loader";
import useVerifyStore from "@/store/email/verifyStore";
import useUserStore from "@/store/user/userStore";
import { useRouter, useSearchParams } from "next/navigation";

const Verified = () => {
  const { status, verifyEmail } = useVerifyStore();
  const { setIsVerified } = useUserStore();

  const [countDown, setCountDown] = useState(10);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) verifyEmail(token);
  }, [token]);

  useEffect(() => {
    let timeout: any;

    if (status === "success") {
      if (countDown < 1) {
        router.push("/");
        setIsVerified(true);
      } else {
        timeout = setTimeout(() => {
          setCountDown((prev) => prev - 1);
        }, 1000);
      }
    }

    return () => clearTimeout(timeout);
  }, [status, countDown]);

  if (status === "loading") {
    return (
      <div className={styles.loader}>
        <Loader />
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
