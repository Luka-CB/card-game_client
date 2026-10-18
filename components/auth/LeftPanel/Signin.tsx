"use client";

import { SubmitEvent, useEffect, useState } from "react";
import Oauth from "./Oauth";
import styles from "./Sign.module.scss";
import { useSearchParams } from "next/navigation";
import useSigninStore from "@/store/auth/signinStore";
import useUserStore from "@/store/user/userStore";
import BtnLoader from "../../loaders/BtnLoader";
import { Link, useRouter } from "@/i18n/navigation";
import { IoMdEye, IoIosEyeOff } from "react-icons/io";
import useJCoinsStore from "@/store/user/stats/jCoinsStore";
import useRatingStore from "@/store/user/stats/ratingStore";
import { useLocale, useTranslations } from "next-intl";
import useWindowSize from "@/hooks/useWindowSize";
import useTouchDevice from "@/hooks/useTouchDevice";
import Links from "../Links";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { FcInfo } from "react-icons/fc";
import { reconnectSocket } from "@/hooks/useSocket";

const Signin = () => {
  const t = useTranslations("Auth.leftPanel.signin");
  const locale = useLocale();

  const { user, status, error, setError, signin, signinGuest, reset } =
    useSigninStore();
  const { setUser } = useUserStore();
  const { clearJCoins } = useJCoinsStore();
  const { clearRating } = useRatingStore();
  const windowWidth = useWindowSize().width;
  const isTouch = useTouchDevice();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [showGuestInfo, setShowGuestInfo] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (error) {
      timeout = setTimeout(() => {
        setError(null);
      }, 3000);
    }

    return () => clearTimeout(timeout);
  }, [error, setError]);

  useEffect(() => {
    if (status === "success" && user) {
      setUser(user);
      reconnectSocket();
      if (user.isGuest) {
        clearJCoins();
        clearRating();
      }
      router.replace("/");
      reset();
      setUsername("");
      setPassword("");
    }
  }, [status, router, user, reset, setUser, clearJCoins, clearRating]);

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    signin({
      username,
      password,
    });
  };

  const handleRoute = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("auth", "signup");
    router.push(`?${newParams.toString()}`);
  };

  const handleGuestSignin = async () => {
    await signinGuest();
  };

  return (
    <div className={styles.container} data-locale={locale}>
      {error ? <p className={styles.error}>{error}</p> : null}
      {windowWidth <= 900 && (
        <div className={styles.language_switcher}>
          <LanguageSwitcher />
        </div>
      )}
      <h2>{t("title")}</h2>
      <small>{t("small")}</small>
      <div className={styles.local_auth}>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder={t("form.username.placeholder")}
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className={styles.forgot}>
            <Link href="/?auth=recover-username">
              {t("form.username.forgot")}
            </Link>
          </div>
          <div className={styles.input_wrapper}>
            <input
              type={visiblePassword ? "text" : "password"}
              placeholder={t("form.password.placeholder")}
              className={styles.password_input}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {visiblePassword ? (
              <div
                onClick={() => setVisiblePassword(false)}
                className={styles.icon}
                title={t("form.password.hide")}
              >
                <IoMdEye />
              </div>
            ) : (
              <div
                onClick={() => setVisiblePassword(true)}
                className={styles.icon}
                title={t("form.password.show")}
              >
                <IoIosEyeOff />
              </div>
            )}
            <div className={styles.forgot}>
              <Link href="/?auth=confirm-email">
                {t("form.password.forgot")}
              </Link>
            </div>
          </div>
          <div className={styles.btns}>
            <button
              className={styles.submit_btn}
              type="submit"
              disabled={status === "loading"}
            >
              {status === "loading" ? <BtnLoader /> : t("form.btn")}
            </button>
            <div className={styles.guest_signin}>
              <button
                type="button"
                className={styles.guest_btn}
                disabled={status === "loading"}
                onClick={handleGuestSignin}
              >
                {t("form.guestBtn")}
              </button>
              <FcInfo
                className={styles.info_icon}
                onMouseEnter={() => {
                  if (!isTouch) setShowGuestInfo(true);
                }}
                onMouseLeave={() => {
                  if (!isTouch) setShowGuestInfo(false);
                }}
                onClick={() => {
                  if (isTouch) setShowGuestInfo((current) => !current);
                }}
                role="button"
                tabIndex={0}
                aria-label="Guest mode information"
              />
              {showGuestInfo && <GuestInfo />}
            </div>
          </div>
        </form>
      </div>
      <div className={styles.divider}>
        <div className={styles.line}></div>
        <span>{t("or")}</span>
        <div className={styles.line}></div>
      </div>
      <Oauth />
      <div className={styles.signup}>
        <p>{t("link.paragraph")}</p>
        <span onClick={handleRoute}>{t("link.span")}</span>
      </div>
      {windowWidth <= 900 && (
        <div className={styles.links}>
          <Links isSm />
        </div>
      )}
    </div>
  );
};

const GuestInfo = () => {
  const t = useTranslations("Auth.leftPanel.signin.form.guestInfo");

  return (
    <div className={styles.guest_info}>
      <small>{t("small")}</small>
      <ul>
        <li>{t("ul.liOne")}</li>
        <li>{t("ul.liTwo")}</li>
        <li>{t("ul.liThree")}</li>
        <li>{t("ul.liFour")}</li>
        <li>{t("ul.liFive")}</li>
      </ul>
      <b>{t("b")}</b>
    </div>
  );
};

export default Signin;
