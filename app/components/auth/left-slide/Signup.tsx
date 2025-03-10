"use client";

import styles from "./Sign.module.scss";
import { useRouter, useSearchParams } from "next/navigation";
import Avatar from "./Avatar";
import { useEffect, useState } from "react";
import useSignupStore from "@/app/store/auth/signupStore";
import useAvatarStore from "@/app/store/user/avatarStore";
import BtnLoader from "../../loaders/BtnLoader";
import Oauth from "./Oauth";
import { IoMdEye, IoIosEyeOff } from "react-icons/io";
import useUserStore from "@/app/store/user/userStore";

const Signup = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { status, signup, error, setError, user } = useSignupStore();
  const { setUser } = useUserStore();
  const { avatar, setAvatar } = useAvatarStore();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(false);

  const handleRoute = (routeName: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("auth", routeName);
    router.push(`?${newParams.toString()}`);
  };

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
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      handleRoute("verify");
    }
  }, [setAvatar, status, user]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    signup({ username, email, avatar: avatar || "", password });
  };

  return (
    <div className={styles.container}>
      {error && <p className={styles.error}>{error}</p>}
      <h2>Sign up</h2>
      <div className={styles.local_auth}>
        <Avatar />
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className={styles.input_wrapper}>
            <input
              type={visiblePassword ? "text" : "password"}
              placeholder="Password"
              className={styles.password_input}
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
          <div className={styles.input_wrapper}>
            <input
              type={visibleConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className={styles.password_input}
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
          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? <BtnLoader /> : "Sign Up"}
          </button>
        </form>
      </div>
      <div className={styles.divider}>
        <div className={styles.line}></div>
        <span>or</span>
        <div className={styles.line}></div>
      </div>
      <Oauth />
      <div className={styles.signup}>
        <p>Already have an account?</p>
        <span onClick={() => handleRoute("signin")}>Sign In</span>
      </div>
    </div>
  );
};

export default Signup;
