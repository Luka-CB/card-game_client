"use client";

import useSignupStore from "@/store/auth/signupStore";
import Loader from "../../../loaders/Loader";
import styles from "./Verify.module.scss";
import { useEffect } from "react";
import useUserStore from "@/store/user/userStore";
import Link from "next/link";
import { CiWarning } from "react-icons/ci";
import useChangeEmailStore from "@/store/email/changeEmailStore";
import useSendVerifyEmailStore from "@/store/email/sendVerifyEmailStore";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useRouter, useSearchParams } from "next/navigation";

const Verify = () => {
  const { email, status, sendEmail } = useSendVerifyEmailStore();
  const { status: signupStatus, reset: signupReset } = useSignupStore();
  const { status: changeEmailStatus, reset: changeEmailReset } =
    useChangeEmailStore();
  const { user } = useUserStore();

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!user && !email) {
      router.push("/?auth=signin");
    }
  }, [user, email]);

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

  const handleRoute = (routeName: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("auth", routeName);
    router.push(`?${newParams.toString()}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.info_verify}>
        <h1>
          Almost there! <span>Verify email to start playing!</span>
        </h1>
      </div>
      {status === "success" && signupStatus === "success" ? (
        <h3>Authenticated successfully!</h3>
      ) : status === "success" && changeEmailStatus === "success" ? (
        <h3>Email sent to new email successfully!</h3>
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
        <div className={styles.go_back_wrapper}>
          <div className={styles.go_back} onClick={() => handleRoute("signin")}>
            <IoMdArrowRoundBack className={styles.icon} />
            <span>Go Back To Signin</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;
