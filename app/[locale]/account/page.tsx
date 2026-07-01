"use client";

import { useEffect } from "react";
import styles from "./page.module.scss";
import useUserAccountStore from "@/store/user/userAccountStore";
import Loader from "@/components/loaders/Loader";
import HeaderInfo from "@/components/account/header/HeaderInfo";
import Profile from "@/components/account/profile/Profile";
import Stats from "@/components/account/stats/Stats";
import UpdateEmail from "@/components/account/emailUpdate/UpdateEmail";
import DeleteModal from "@/components/account/delete/deleteModal/DeleteModal";
import ChangeUsername from "@/components/account/username/ChangeUsername";

export default function AccountPage() {
  const { userAccount, fetchUserAccount, updateStatus, error } =
    useUserAccountStore();

  useEffect(() => {
    fetchUserAccount();
  }, []);

  if (updateStatus === "loading") {
    return <Loader fullPage />;
  }

  if (updateStatus === "error" && error) {
    return (
      <div className={styles.error_wrapper}>
        <div className={styles.error}>
          <h2>Error loading account</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className={styles.container}>
      <HeaderInfo
        avatar={userAccount?.avatar || ""}
        firstName={userAccount?.firstName || ""}
        lastName={userAccount?.lastName || ""}
        username={userAccount?.username || ""}
        originalUsername={userAccount?.originalUsername || ""}
        email={userAccount?.email || ""}
        isVerified={userAccount?.isVerified || false}
        createdAt={userAccount?.createdAt || ""}
        provider={userAccount?.provider || "local"}
      />
      <div className={styles.grid}>
        <Profile
          userAccount={{
            firstName: userAccount?.firstName || "",
            lastName: userAccount?.lastName || "",
            gender: userAccount?.gender || null,
            bio: userAccount?.bio || "",
            provider: userAccount?.provider || "local",
          }}
        />

        <div className={styles.divider}></div>

        <Stats />
      </div>

      <UpdateEmail changeEmail={userAccount?.emailChange} />
      <DeleteModal />
      <ChangeUsername />
    </main>
  );
}
