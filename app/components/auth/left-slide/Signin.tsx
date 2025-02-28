"use client";

import Oauth from "./Oauth";
import styles from "./Sign.module.scss";
import { useRouter, useSearchParams } from "next/navigation";

const Signin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleRoute = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("auth", "signup");
    router.push(`?${newParams.toString()}`);
  };

  return (
    <div className={styles.container}>
      <h2>Sign in</h2>
      <div className={styles.local_auth}>
        <form>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="submit">Sign in</button>
          <p>Forgot Password?</p>
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
