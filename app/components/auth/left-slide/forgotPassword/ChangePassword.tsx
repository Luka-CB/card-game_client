"use client";

import { FormEvent, useEffect, useState } from "react";
import RouteLink from "../../../RouteLink";
import styles from "./ChangePassword.module.scss";
import { IoMdEye, IoIosEyeOff } from "react-icons/io";
import { motion } from "framer-motion";
import useChangePasswordStore from "@/app/store/auth/changePasswordStore";
import { useRouter, useSearchParams } from "next/navigation";
import BtnLoader from "@/app/components/loaders/BtnLoader";

const ChangePassword = () => {
  const { status, changePassword, reset, error, setError } =
    useChangePasswordStore();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    let timeout: any;

    if (error) {
      timeout = setTimeout(() => {
        setError(null);
      }, 3000);
    }

    if (status === "success") {
      timeout = setTimeout(() => {
        router.push("/?auth=signin");
        reset();
      }, 3000);
    }

    return () => clearTimeout(timeout);
  }, [status, error]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    if (token) changePassword(password, token);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: "spring", delay: 1 }}
      className={styles.container}
    >
      {status === "success" ? (
        <p className={styles.success}>Password changed successfully!</p>
      ) : null}
      {error ? <p className={styles.error}>{error}</p> : null}
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.input_box}>
          <label htmlFor="password">New Password</label>
          <div className={styles.input_wrapper}>
            <input
              type={visiblePassword ? "text" : "password"}
              name="password"
              id="password"
              className={styles.password_input}
              placeholder="Input password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {visiblePassword ? (
              <div
                onClick={() => setVisiblePassword(false)}
                className={styles.icon}
                title="hide password"
              >
                <IoMdEye />
              </div>
            ) : (
              <div
                onClick={() => setVisiblePassword(true)}
                className={styles.icon}
                title="show password"
              >
                <IoIosEyeOff />
              </div>
            )}
          </div>
        </div>
        <div className={styles.input_box}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className={styles.input_wrapper}>
            <input
              type={visibleConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
              className={styles.password_input}
              placeholder="Retype password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {visibleConfirmPassword ? (
              <div
                onClick={() => setVisibleConfirmPassword(false)}
                className={styles.icon}
                title="hide password"
              >
                <IoMdEye />
              </div>
            ) : (
              <div
                onClick={() => setVisibleConfirmPassword(true)}
                className={styles.icon}
                title="show password"
              >
                <IoIosEyeOff />
              </div>
            )}
          </div>
        </div>
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? <BtnLoader /> : "Submit"}
        </button>
      </form>
      <RouteLink route="/?auth=signin" text="back to sign in" />
    </motion.div>
  );
};

export default ChangePassword;
