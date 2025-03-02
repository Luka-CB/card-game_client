"use client";

import Link from "next/link";
import styles from "./UserOption.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import useUserOptionStore from "@/app/store/user/userOptionStore";
import useLogoutStore from "@/app/store/auth/logoutStore";
import BtnLoader from "../loaders/BtnLoader";
import { useEffect } from "react";

const UserOption = () => {
  const { isOpen } = useUserOptionStore();
  const { status, logout } = useLogoutStore();

  useEffect(() => {
    if (status === "success") {
      document.location.reload();
    }
  }, [status]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.6, type: "spring" }}
          className={styles.container}
          onClick={(e) => e.stopPropagation()}
        >
          <Link href="/account" className={styles.link}>
            Your Account
          </Link>
          <Link href="#" className={styles.link}>
            Something Else
          </Link>
          <hr />
          <div className={styles.logout} onClick={logout}>
            {status === "loading" ? <BtnLoader /> : "Logout"}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default UserOption;
