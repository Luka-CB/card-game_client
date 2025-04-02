import RouteLink from "@/components/RouteLink";
import styles from "./ConfirmEmail.module.scss";
import { FormEvent, useEffect, useState } from "react";
import useSendChangePasswordEmailStore from "@/store/email/sendChangePasswordEmailStore";
import BtnLoader from "@/components/loaders/BtnLoader";

const ConfirmEmail = () => {
  const { status, sendChangePasswordEmail } = useSendChangePasswordEmailStore();

  const [email, setEmail] = useState("");

  useEffect(() => {
    if (status === "success") {
      setEmail("");
    }
  }, [status]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendChangePasswordEmail(email);
  };

  return (
    <div className={styles.container}>
      {status === "success" ? (
        <div className={styles.success}>
          <p>Email Sent Successfully!</p>
          <small>
            Please go to your email and follow the link we sent to change your
            password!
          </small>
        </div>
      ) : null}
      <h2>Confirm Email</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">
          Enter Email that you've used for registration
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Input email"
          disabled={status === "loading"}
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">
          {status === "loading" ? <BtnLoader /> : "Submit"}
        </button>
      </form>
      <RouteLink route="/?auth=signin" text="go back" />
    </div>
  );
};

export default ConfirmEmail;
