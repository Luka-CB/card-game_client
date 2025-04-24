"use client";

import Link from "next/link";
import styles from "./UserOption.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import useUserOptionStore from "@/store/user/userOptionStore";
import useLogoutStore from "@/store/auth/logoutStore";
import BtnLoader from "../loaders/BtnLoader";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useSocket from "@/hooks/useSocket";
import useUserStore from "@/store/user/userStore";

const UserOption = () => {
  const { isOpen, setIsOpen } = useUserOptionStore();
  const { status, logout } = useLogoutStore();
  const { user, setJoinedRoom, joinedRoom } = useUserStore();
  const socket = useSocket();
  const router = useRouter();

  useEffect(() => {
    if (status === "success") {
      router.push("/");
      setIsOpen(false);
    }
  }, [status, router]);

  const handleLogout = () => {
    if (user && joinedRoom) {
      socket?.emit("leaveRoom", joinedRoom.id, user._id);
      setJoinedRoom(null);
    }

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
          <div className={styles.logout} onClick={handleLogout}>
            {status === "loading" ? <BtnLoader /> : "Logout"}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default UserOption;
