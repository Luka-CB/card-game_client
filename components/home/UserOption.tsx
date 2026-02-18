"use client";

import Link from "next/link";
import styles from "./UserOption.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import useUserOptionStore from "@/store/user/userOptionStore";
import useLogoutStore from "@/store/auth/logoutStore";
import BtnLoader from "../loaders/BtnLoader";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useWindowSize from "@/hooks/useWindowSize";

const UserOption = () => {
  const { isOpen, setIsOpen } = useUserOptionStore();
  const { status, logout } = useLogoutStore();
  const router = useRouter();
  const windowSize = useWindowSize();

  useEffect(() => {
    if (status === "success") {
      router.push("/");
      setIsOpen(false);
    }
  }, [status, router]);

  const handleLogout = () => {
    logout();
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.6, type: "spring" }}
          className={
            windowSize.width <= 800 ? styles.container_sm : styles.container
          }
          onClick={(e) => e.stopPropagation()}
        >
          <Link href="/account" className={styles.link}>
            Your Account
          </Link>
          <Link href="#" className={styles.link}>
            Something Else
          </Link>
          <hr />
          <div className={styles.logout} onClick={handleLogout}>
            {status === "loading" ? <BtnLoader /> : "Logout"}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default UserOption;
