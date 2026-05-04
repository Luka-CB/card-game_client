"use client";

import styles from "./Sign.module.scss";
import { useSearchParams } from "next/navigation";
import { useRouter, Link } from "@/i18n/navigation";
import { SubmitEvent, useCallback, useEffect, useRef, useState } from "react";
import useSignupStore from "@/store/auth/signupStore";
import useAvatarStore from "@/store/user/avatarStore";
import BtnLoader from "../../loaders/BtnLoader";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import Oauth from "./Oauth";
import { IoMdEye, IoIosEyeOff } from "react-icons/io";
import useUserStore from "@/store/user/userStore";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import useWindowSize from "@/hooks/useWindowSize";
import Links from "../Links";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Signup = () => {
  const t = useTranslations("Auth.leftPanel.signup");
  const locale = useLocale();

  const router = useRouter();
  const searchParams = useSearchParams();

  const { status, signup, error, setError, user } = useSignupStore();
  const { setUser } = useUserStore();
  const { avatar, setAvatar, toggleAvatarGallery } = useAvatarStore();
  const windowWidth = useWindowSize().width;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState<"male" | "female" | null>("male");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarError, setAvatarError] = useState(false);

  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(false);

  const errorRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if ((error || avatarError) && errorRef.current) {
      errorRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [error, avatarError]);

  const handleRoute = useCallback(
    (routeName: string) => {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set("auth", routeName);
      router.push(`?${newParams.toString()}`);
    },
    [router, searchParams],
  );

  useEffect(() => {
    let timeOut: NodeJS.Timeout;
    if (error) {
      timeOut = setTimeout(() => {
        setError(null);
      }, 5000);
    }

    return () => clearTimeout(timeOut);
  }, [error, setError]);

  useEffect(() => {
    if (status === "success") {
      if (user) setUser(user);
      setAvatar("");
      setAvatarError(false);
      setFirstName("");
      setLastName("");
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      handleRoute("verify");
    }
  }, [setAvatar, status, user, setUser, handleRoute]);

  useEffect(() => {
    if (avatar) {
      setAvatarError(false);
    }
  });

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password.length < 6) {
      setError(t("msgs.passwordLength"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("msgs.passwordMatch"));
      return;
    }

    if (!avatar) {
      setError(t("msgs.avatar"));
      setAvatarError(true);
      return;
    }

    signup({ firstName, lastName, username, email, gender, avatar, password });
  };

  return (
    <div className={styles.container} data-locale={locale}>
      {error && (
        <p ref={errorRef} className={styles.error}>
          {error}
        </p>
      )}
      {windowWidth <= 900 && (
        <div className={styles.language_switcher}>
          <LanguageSwitcher />
        </div>
      )}
      <h2>{t("title")}</h2>
      <small>{t("small")}</small>
      <div className={styles.local_auth}>
        <div
          className={
            avatarError
              ? styles.choose_avatar_wrapper_error
              : styles.choose_avatar_wrapper
          }
          onClick={() => toggleAvatarGallery()}
        >
          <div className={styles.choose_avatar}>
            <button>
              {!avatar ? (
                <div className={styles.choose}>
                  <MdOutlineAddPhotoAlternate className={styles.icon} />
                  <span>{t("avatar.title")}</span>
                </div>
              ) : (
                <div
                  className={styles.image}
                  title={t("avatar.pickedImgTitle")}
                >
                  <Image src={avatar} width={100} height={100} alt="avatar" />
                </div>
              )}
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder={t("form.firstName.placeholder")}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder={t("form.lastName.placeholder")}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="text"
            placeholder={t("form.username.placeholder")}
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder={t("form.email.placeholder")}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
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
          </div>
          <div className={styles.input_wrapper}>
            <input
              type={visibleConfirmPassword ? "text" : "password"}
              placeholder={t("form.password.confirmPlaceholder")}
              className={styles.password_input}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {visibleConfirmPassword ? (
              <div
                onClick={() => setVisibleConfirmPassword(false)}
                className={styles.icon}
                title={t("form.password.hide")}
              >
                <IoMdEye />
              </div>
            ) : (
              <div
                onClick={() => setVisibleConfirmPassword(true)}
                className={styles.icon}
                title={t("form.password.show")}
              >
                <IoIosEyeOff />
              </div>
            )}
          </div>
          <div className={styles.radio_wrapper}>
            <strong>{t("form.gender.label")}</strong>
            <div className={styles.male}>
              <input
                type="radio"
                name="gender"
                value="male"
                id="male"
                checked={gender === "male"}
                onChange={() => setGender("male")}
              />
              <label htmlFor="male">{t("form.gender.options.male")}</label>
            </div>
            <div className={styles.female}>
              <input
                type="radio"
                name="gender"
                value="female"
                id="female"
                checked={gender === "female"}
                onChange={() => setGender("female")}
              />
              <label htmlFor="female">{t("form.gender.options.female")}</label>
            </div>
          </div>
          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? <BtnLoader /> : t("form.btn")}
          </button>
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
        <span onClick={() => handleRoute("signin")}>{t("link.span")}</span>
      </div>
      {windowWidth <= 900 && (
        <div className={styles.links}>
          <Links isSm />
        </div>
      )}
    </div>
  );
};

export default Signup;
