import { useEffect, useMemo, useState } from "react";
import styles from "./Profile.module.scss";
import { IoMdEye, IoIosEyeOff } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";
import DeleteAccount from "../delete/DeleteAccount";
import useFlashMsgStore from "@/store/flashMsgStore";
import useUserAccountStore from "@/store/user/userAccountStore";
import BtnLoader from "@/components/loaders/BtnLoader";
import useUserActivityStore from "@/store/user/userActivityStore";

interface ProfileProps {
  userAccount: {
    firstName: string;
    lastName: string;
    username: string;
    gender?: "male" | "female" | null;
    bio: string;
    provider: "local" | "google" | "facebook";
  };
}

type User = {
  firstName: string;
  lastName: string;
  username: string;
  gender?: "male" | "female" | null;
  password?: string;
  bio?: string;
};

function getInitialForm(ua?: ProfileProps["userAccount"]): User {
  return {
    firstName: ua?.firstName ?? "",
    lastName: ua?.lastName ?? "",
    username: ua?.username ?? "",
    gender: ua?.gender ?? null,
    password: "",
    bio: ua?.bio ?? "",
  };
}

const Profile: React.FC<ProfileProps> = ({ userAccount }) => {
  const initialForm = useMemo(() => getInitialForm(userAccount), [userAccount]);
  const [form, setForm] = useState<User>(initialForm);

  const [visiblePassword, setVisiblePassword] = useState(false);
  const [isPassError, setIsPassError] = useState(false);

  const { setMsg } = useFlashMsgStore();
  const { updateUserAccount, updateState } = useUserAccountStore();
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
    if (updateState === "success") {
      setMsg("Profile updated successfully", "success");
      fetchUserActivities();
    } else if (updateState === "error") {
      setMsg("Failed to update profile", "error");
    }
  }, [updateState, setMsg, fetchUserActivities]);

  function handleSave(e: React.SubmitEvent) {
    e.preventDefault();

    if (form.password && form.password.length < 6) {
      setIsPassError(true);
      setMsg("Password must be at least 6 characters long", "error");
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
    <section className={styles.profile}>
      <h2>Profile</h2>
      <p className={styles.bio}>
        {userAccount?.bio ? userAccount.bio : "No bio available"}
      </p>

      <form className={styles.form} onSubmit={handleSave}>
        <div className={styles.full_name}>
          <label className={styles.field}>
            <span>First Name</span>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
            />
          </label>

          <label className={styles.field}>
            <span>Last Name</span>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
            />
          </label>
        </div>

        <label className={styles.field}>
          <span>Username</span>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
          />
        </label>

        <label className={styles.field}>
          <span>Gender</span>
          <select
            name="gender"
            id="gender"
            value={form.gender || ""}
            onChange={handleChange}
          >
            <option value="">Select gender</option>
            <option value="female"> Female </option>
            <option value="male"> Male </option>
          </select>
        </label>

        {userAccount?.provider === "local" && (
          <label className={styles.field}>
            <span>Set New Password</span>
            <div className={styles.input_wrapper}>
              <input
                type={visiblePassword ? "text" : "password"}
                name="password"
                placeholder="Password must be at least 6 characters long"
                value={form.password}
                onChange={handleChange}
                className={isPassError ? styles.input_error : ""}
              />
              <div className={styles.icons}>
                {visiblePassword ? (
                  <IoMdEye
                    className={styles.icon}
                    title="show password"
                    onClick={() => setVisiblePassword(!visiblePassword)}
                  />
                ) : (
                  <IoIosEyeOff
                    className={styles.icon}
                    title="hide password"
                    onClick={() => setVisiblePassword(!visiblePassword)}
                  />
                )}
              </div>
            </div>
          </label>
        )}

        <label className={styles.field}>
          <span>Bio (optional)</span>
          <textarea name="bio" value={form.bio} onChange={handleChange} />
        </label>

        <div className={styles.provider}>
          <span>Signed up with:</span>
          {userAccount?.provider === "google" ? (
            <div className={styles.provider_type}>
              <FcGoogle className={styles.icon} />
              <span>Google Account</span>
            </div>
          ) : userAccount?.provider === "facebook" ? (
            <div className={styles.provider_type}>
              <FaFacebook className={styles.icon} />
              <span>Facebook Account</span>
            </div>
          ) : (
            <div className={styles.provider_type}>
              <span>Local Account</span>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.saveBtn}
            disabled={!isModified || updateState === "loading"}
          >
            {updateState === "loading" ? <BtnLoader /> : "Save changes"}
          </button>
          <button
            type="button"
            className={styles.resetBtn}
            onClick={resetForm}
            disabled={updateState === "loading"}
          >
            Discard
          </button>
        </div>
      </form>
      <DeleteAccount />
    </section>
  );
};

export default Profile;
