"use client";

import { FormEvent, useEffect, useState } from "react";
import useUserStore from "@/store/user/userStore";
import styles from "./ChangeEmail.module.scss";
import useChangeEmailStore from "@/store/email/changeEmailStore";
import BtnLoader from "../../loaders/BtnLoader";
import { useRouter, useSearchParams } from "next/navigation";
import { IoMdArrowRoundBack } from "react-icons/io";

const ChangeEmail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { user } = useUserStore();
  const { status, updateEmail } = useChangeEmailStore();

  const [email, setEmail] = useState("");

  const handleRoute = (routeName: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("auth", routeName);
    router.push(`?${newParams.toString()}`);
  };

  useEffect(() => {
    if (status === "success") {
      handleRoute("verify");
      setEmail("");
    }
  }, [status, router]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateEmail(email);
  };

  return (
    <div className={styles.container}>
      <h1>Change Email</h1>
      <p>
        <b>{user?.email}lukaaslamazashvili20@gmail.com</b>: Your current email
      </p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">New Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Input valid email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? <BtnLoader /> : "Submit"}
        </button>
      </form>
      <div className={styles.go_back_wrapper}>
        <div className={styles.go_back} onClick={() => handleRoute("verify")}>
          <IoMdArrowRoundBack className={styles.icon} />
          <span>Go Back</span>
        </div>
      </div>
    </div>
  );
};

export default ChangeEmail;
