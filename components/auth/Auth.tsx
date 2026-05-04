"use client";

import styles from "./Auth.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import Signin from "./LeftPanel/Signin";
import { useSearchParams } from "next/navigation";
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
import ForgotUsername from "./LeftPanel/forgotUsername/ForgotUsername";
import { usePathname, useRouter } from "@/i18n/navigation";
import LanguageSwitcher from "../LanguageSwitcher";
import { useLocale, useTranslations } from "next-intl";
import Links from "./Links";
import useWindowSize from "@/hooks/useWindowSize";

const leftSlideParams = [
  "signin",
  "signup",
  "confirm-email",
  "recover-username",
];
const rightSlideParams = ["verify", "change-email"];

const Auth = () => {
  const t = useTranslations("Auth.info");
  const locale = useLocale();

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = searchParams.get("auth");
  const { loading, user } = useUserStore();
  const windowWidth = useWindowSize().width;

  const buildUrlWithAuth = (value: string) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("auth", value);

    return `${pathname}?${nextParams.toString()}`;
  };

  useEffect(() => {
    if (!loading && !user && !auth) {
      router.replace(buildUrlWithAuth("signin"), { scroll: false });
    }

    if (!loading && user && !user?.isGuest && !user?.isVerified && !auth) {
      router.replace(buildUrlWithAuth("verify"), { scroll: false });
    }
  }, [auth, loading, router, searchParams, user, pathname]);

  useEffect(() => {
    if (
      auth === "redirecting" &&
      user &&
      (user.isGuest || user.isVerified) &&
      pathname
    ) {
      const nextParams = new URLSearchParams(searchParams.toString());
      nextParams.delete("auth");

      const nextQuery = nextParams.toString();
      const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;

      window.history.replaceState(window.history.state, "", nextUrl);
      router.replace(nextUrl, { scroll: false });
    }
  }, [auth, pathname, router, searchParams, user]);

  useEffect(() => {
    if (
      !user ||
      (!user.isGuest && !user.isVerified) ||
      auth === "redirecting"
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [user, auth]);

  if (!user || (!user.isGuest && !user.isVerified) || auth === "redirecting") {
    return (
      <motion.main
        initial={{ backdropFilter: "blur(0)" }}
        animate={{ backdropFilter: "blur(18px)", transition: { duration: 5 } }}
        className={styles.container}
        data-locale={locale}
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
              <div className={styles.auth}>
                {auth === "recover-username" ? (
                  <ForgotUsername />
                ) : auth === "confirm-email" ? (
                  <ConfirmEmail />
                ) : auth === "signup" ? (
                  <Signup />
                ) : (
                  <Signin />
                )}
              </div>
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
                  {t("right.title")} <span>{t("right.span")}</span>
                </motion.h1>
                {windowWidth > 900 && <Links isRight />}
              </motion.div>
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
                  {t("left.title")} <span>{t("left.span")}</span>
                </motion.h1>
                {windowWidth > 900 && <Links />}
              </motion.div>
              <div className={styles.verify_content}>
                {auth === "verify" ? <Verify /> : <ChangeEmail />}
              </div>
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

        {windowWidth > 900 && (
          <div
            className={
              auth && leftSlideParams.includes(auth)
                ? styles.language_switcher_right
                : styles.language_switcher_left
            }
          >
            <LanguageSwitcher />
          </div>
        )}

        {auth === "redirecting" ? <Redirecting /> : null}
        {auth === "error" ? <Error /> : null}
        {auth === "change-password" ? <ChangePassword /> : null}
      </motion.main>
    );
  }

  return null;
};

export default Auth;
