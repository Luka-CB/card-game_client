import { useEffect, useMemo, useState } from "react";
import styles from "./Profile.module.scss";
import { IoMdEye, IoIosEyeOff } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";

import DeleteAccount from "../delete/DeleteAccount";
import useFlashMsgStore from "@/store/flashMsgStore";
import useUserAccountStore from "@/store/user/userAccountStore";
import BtnLoader from "@/components/loaders/BtnLoader";
import useUserActivityStore from "@/store/user/userActivityStore";
import { useLocale, useTranslations } from "next-intl";

interface ProfileProps {
  userAccount: {
    firstName: string;
    lastName: string;
    gender?: "male" | "female" | null;
    bio: string;
    provider: "local" | "google";
  };
}

type User = {
  firstName: string;
  lastName: string;
  gender?: "male" | "female" | null;
  password?: string;
  bio?: string;
};

function getInitialForm(ua?: ProfileProps["userAccount"]): User {
  return {
    firstName: ua?.firstName ?? "",
    lastName: ua?.lastName ?? "",
    gender: ua?.gender ?? null,
    password: "",
    bio: ua?.bio ?? "",
  };
}

const Profile: React.FC<ProfileProps> = ({ userAccount }) => {
  const t = useTranslations("AccountPage.profile");
  const locale = useLocale();

  const initialForm = useMemo(() => getInitialForm(userAccount), [userAccount]);
  const [form, setForm] = useState<User>(initialForm);

  const [visiblePassword, setVisiblePassword] = useState(false);
  const [isPassError, setIsPassError] = useState(false);

  const { setMsg } = useFlashMsgStore();
  const { updateUserAccount, updateStatus } = useUserAccountStore();
  const { fetchUserActivities } = useUserActivityStore();

  useEffect(() => {
    setForm(initialForm);
  }, [initialForm]);

  useEffect(() => {
    if (isPassError && form.password && form.password.length >= 6) {
      setIsPassError(false);
    }
  }, [isPassError, form.password]);

  useEffect(() => {
    if (updateStatus === "success") {
      setMsg(t("msgs.success"), "success");
      fetchUserActivities();
    } else if (updateStatus === "error") {
      setMsg(t("msgs.updateError"), "error");
    }
  }, [updateStatus, setMsg, fetchUserActivities]);

  function handleSave(e: React.SubmitEvent) {
    e.preventDefault();

    if (form.password && form.password.length < 6) {
      setIsPassError(true);
      setMsg(t("msgs.passwordError"), "error");
      return;
    }

    updateUserAccount(form);
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const target = e.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement;
    const { name, value } = target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function resetForm() {
    setForm(initialForm);
  }

  const isModified = useMemo(() => {
    return JSON.stringify(form) !== JSON.stringify(initialForm);
  }, [form, initialForm]);

  return (
    <section className={styles.profile} data-locale={locale}>
      <h2>{t("title")}</h2>
      <p className={styles.bio}>
        {userAccount?.bio ? userAccount.bio : t("paragraph")}
      </p>

      <form className={styles.form} onSubmit={handleSave}>
        <div className={styles.full_name}>
          <label className={styles.field}>
            <span>{t("form.firstName.label")}</span>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
            />
          </label>

          <label className={styles.field}>
            <span>{t("form.lastName.label")}</span>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
            />
          </label>
        </div>

        <label className={styles.field}>
          <span>{t("form.gender.label")}</span>
          <select
            name="gender"
            id="gender"
            value={form.gender || ""}
            onChange={handleChange}
          >
            <option value="">{t("form.gender.options.select")}</option>
            <option value="female">{t("form.gender.options.female")}</option>
            <option value="male">{t("form.gender.options.male")}</option>
          </select>
        </label>

        {userAccount?.provider === "local" && (
          <label className={styles.field}>
            <span>{t("form.password.label")}</span>
            <div className={styles.input_wrapper}>
              <input
                type={visiblePassword ? "text" : "password"}
                name="password"
                placeholder={t("form.password.placeholder")}
                value={form.password}
                onChange={handleChange}
                className={isPassError ? styles.input_error : ""}
              />
              <div className={styles.icons}>
                {visiblePassword ? (
                  <IoMdEye
                    className={styles.icon}
                    title={t("form.password.title.show")}
                    onClick={() => setVisiblePassword(!visiblePassword)}
                  />
                ) : (
                  <IoIosEyeOff
                    className={styles.icon}
                    title={t("form.password.title.hide")}
                    onClick={() => setVisiblePassword(!visiblePassword)}
                  />
                )}
              </div>
            </div>
          </label>
        )}

        <label className={styles.field}>
          <span>{t("form.bio.label")}</span>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder={t("form.bio.placeholder")}
          />
        </label>

        <div className={styles.provider}>
          <span>{t("form.profider.label")}</span>
          {userAccount?.provider === "google" ? (
            <div className={styles.provider_type}>
              <FcGoogle className={styles.icon} />
              <span>{t("form.profider.google")}</span>
            </div>
          ) : (
            <div className={styles.provider_type}>
              <span>{t("form.profider.local")}</span>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.saveBtn}
            disabled={!isModified || updateStatus === "loading"}
          >
            {updateStatus === "loading" ? (
              <BtnLoader />
            ) : (
              t("form.actions.confirm")
            )}
          </button>
          <button
            type="button"
            className={styles.resetBtn}
            onClick={resetForm}
            disabled={updateStatus === "loading"}
          >
            {t("form.actions.discard")}
          </button>
        </div>
      </form>
      <DeleteAccount />
    </section>
  );
};

export default Profile;
