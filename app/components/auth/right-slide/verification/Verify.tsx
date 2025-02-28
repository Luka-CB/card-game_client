"use client";

import useSignupStore from "@/app/store/signupStore";
import Loader from "../../../loaders/Loader";
import styles from "./Verify.module.scss";
import { useEffect } from "react";
import useUserStore from "@/app/store/userStore";
import Link from "next/link";
import { CiWarning } from "react-icons/ci";
import useChangeEmailStore from "@/app/store/changeEmailStore";
import useSendEmailStore from "@/app/store/sendEmailStore";

const Verify = () => {
  const { email, status, sendEmail } = useSendEmailStore();
  const { status: signupStatus, reset: signupReset } = useSignupStore();
  const { status: changeEmailStatus, reset: changeEmailReset } =
    useChangeEmailStore();
  const { user } = useUserStore();

  useEffect(() => {
    if (signupStatus === "success" || changeEmailStatus === "success") {
      sendEmail();
      signupReset();
      changeEmailReset();
    }
  }, [signupStatus, changeEmailStatus]);

  if (status === "loading") {
    return (
      <div className={styles.loader}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {status === "success" && signupStatus === "success" ? (
        <h3>Authenticated successfully!</h3>
      ) : status === "success" && changeEmailStatus === "success" ? (
        <h3>Email sent to new email successfukky!</h3>
      ) : status === "success" ? (
        <h3>Email sent successfully!</h3>
      ) : null}
      <p>
        We've sent you a verification email, please check your email and verify
        it.
      </p>
      <small>If you didn't recieve email</small>
      <button onClick={sendEmail}>Send Again</button>
      <div className={styles.notice}>
        <span className={styles.text_one}>
          <CiWarning className={styles.icon} /> Please make sure, that you've
          used <b>valid email</b> for registration
        </span>
        <span className={styles.text_two}>
          This is the email you've used for registration:{" "}
          <b>{email ? email : user?.email}</b>
        </span>
        <span className={styles.text_three}>
          If it's not a correct email:{" "}
          <Link href="/?auth=change-email">change email</Link>
        </span>
      </div>
    </div>
  );
};

export default Verify;
