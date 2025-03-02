"use client";

import { FormEvent, useEffect, useState } from "react";
import Oauth from "./Oauth";
import styles from "./Sign.module.scss";
import { useRouter, useSearchParams } from "next/navigation";
import useSigninStore from "@/app/store/auth/signinStore";
import useUserStore from "@/app/store/user/userStore";
import BtnLoader from "../../loaders/BtnLoader";
import Link from "next/link";
import { IoMdEye, IoIosEyeOff } from "react-icons/io";

const Signin = () => {
  const { data, status, error, setError, signin, reset } = useSigninStore();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [visiblePassword, setVisiblePassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    let timeout: any;

    if (error) {
      timeout = setTimeout(() => {
        setError(null);
      }, 3000);
    }

    return () => clearTimeout(timeout);
  }, [error]);

  useEffect(() => {
    if (status === "success") {
      router.push("/");
      useUserStore.setState({ user: data });
      reset();
      setUsername("");
      setPassword("");
    }
  }, [status, router]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
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

  return (
    <div className={styles.container}>
      {error ? <p className={styles.error}>{error}</p> : null}
      <h2>Sign in</h2>
      <div className={styles.local_auth}>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? <BtnLoader /> : "sign in"}
          </button>
          <Link href="/?auth=confirm-email">Forgot Password?</Link>
        </form>
      </div>
      <div className={styles.divider}>
        <div className={styles.line}></div>
        <span>or</span>
        <div className={styles.line}></div>
      </div>
      <Oauth />
      <div className={styles.signup}>
        <p>Don't have an account?</p>
        <span onClick={handleRoute}>Sign Up</span>
      </div>
    </div>
  );
};

export default Signin;
