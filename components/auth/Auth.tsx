"use client";

import styles from "./Auth.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import Signin from "./LeftPanel/Signin";
import { useRouter, useSearchParams } from "next/navigation";
import Signup from "./LeftPanel/Signup";
import { useEffect } from "react";
import Verify from "./rightPanel/verification/Verify";
import useUserStore from "@/store/user/userStore";
import ChangeEmail from "./rightPanel/ChangeEmail";
import Verified from "./rightPanel/verification/Verified";
import Redirecting from "./Redirecting";
import Error from "./Error";
import ChangePassword from "./LeftPanel/forgotPassword/ChangePassword";
import ConfirmEmail from "./LeftPanel/forgotPassword/ConfirmEmail";

const leftSlideParams = ["signin", "signup", "confirm-email"];
const rightSlideParams = ["verify", "change-email"];
const textParams = [
  "verified",
  "redirecting",
  "error",
  "change-password",
  "confirm-email",
];

const Auth = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = searchParams.get("auth");
  const { loading, user } = useUserStore();

  useEffect(() => {
    if (!loading && !user && !auth) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set("auth", "signin");
      router.push(`?${newParams.toString()}`);
    }

    if (!loading && user && !user?.isVerified && !auth) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set("auth", "verify");
      router.push(`?${newParams.toString()}`);
    }
  }, [user, router, auth, loading]);

  if (!user || !user.isVerified || auth === "redirecting") {
    return (
      <motion.main
        initial={{ backdropFilter: "blur(0)" }}
        animate={{ backdropFilter: "blur(10px)", transition: { duration: 5 } }}
        className={styles.container}
      >
        <AnimatePresence>
          {auth && leftSlideParams.includes(auth) ? (
            <motion.div
              key="left-slide"
              initial={{ opacity: 0, x: -100 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: { duration: 0.4, type: "spring" },
              }}
              exit={{
                opacity: 0,
                x: -100,
                transition: { duration: 0.4, type: "spring" },
              }}
              className={styles.auth_wrapper}
            >
              {auth === "confirm-email" ? (
                <ConfirmEmail />
              ) : auth === "signup" ? (
                <Signup />
              ) : (
                <Signin />
              )}
            </motion.div>
          ) : null}

          {auth && rightSlideParams.includes(auth) ? (
            <motion.div
              key="right-slide"
              initial={{ opacity: 0, x: 100 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: { duration: 0.4, type: "spring" },
              }}
              exit={{
                opacity: 0,
                x: 100,
                transition: { duration: 0.4, type: "spring" },
              }}
              className={styles.verify_wrapper}
            >
              {auth === "verify" ? <Verify /> : <ChangeEmail />}
            </motion.div>
          ) : null}

          {auth === "verified" ? (
            <motion.div
              key="middle-slide"
              initial={{ opacity: 0, y: -200 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.4, type: "spring" },
              }}
              exit={{
                opacity: 0,
                transition: { duration: 0.4, type: "spring" },
              }}
              className={styles.verified_wrapper}
            >
              <Verified />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {auth && !textParams.includes(auth) ? (
          <AnimatePresence mode="wait">
            {auth === "signin" || auth === "signup" ? (
              <motion.div
                key="info-signup"
                initial={{ right: 0 }}
                transition={{ duration: 0.6 }}
                className={styles.info_signup}
              >
                <motion.h1
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.3, type: "spring", delay: 0.6 },
                  }}
                >
                  Authenticate! <span>It's Easy, Quick and Free</span>
                </motion.h1>
              </motion.div>
            ) : (
              <motion.div
                key="info-verify"
                initial={{ left: 0 }}
                transition={{ duration: 0.6 }}
                className={styles.info_verify}
              >
                <motion.h1
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.3, type: "spring", delay: 0.6 },
                  }}
                >
                  Almost there! <span>Verify email to start playing!</span>
                </motion.h1>
              </motion.div>
            )}
          </AnimatePresence>
        ) : null}

        {auth === "redirecting" ? <Redirecting /> : null}
        {auth === "error" ? <Error /> : null}
        {auth === "change-password" ? <ChangePassword /> : null}
      </motion.main>
    );
  }

  return null;
};

export default Auth;
