"use client";

import useUserStore from "@/app/store/userStore";
import styles from "./Header.module.scss";
import { FaCaretDown } from "react-icons/fa6";
import Image from "next/image";
import UserOption from "./UserOption";
import useUserOptionStore from "@/app/store/userOptionStore";

const Header = () => {
  const { user } = useUserStore();
  const { setIsOpen, isOpen } = useUserOptionStore();

  const avatar = user?.avatar ? user?.avatar : "/dummy-avatar.jpeg";

  return (
    <header className={styles.header}>
      <nav>
        <div className={styles.logo}>
          <h1>LOGO</h1>
        </div>
        <ul>
          <li>link one</li>
          <li>link two</li>
        </ul>
      </nav>
      <div className={styles.user}>
        <p>{user?.username}</p>
        <div className={styles.avatar} onClick={() => setIsOpen(!isOpen)}>
          <Image
            src={avatar}
            alt="avatar"
            width={50}
            height={50}
            className={styles.avatar_img}
          />
          <div className={styles.caret}>
            <FaCaretDown className={styles.caret_icon} />
          </div>
        </div>
        <UserOption />
      </div>
    </header>
  );
};

export default Header;
