"use client";

import useUserStore from "@/store/user/userStore";
import styles from "./Header.module.scss";
import { FaCaretDown } from "react-icons/fa6";
import Image from "next/image";
import UserOption from "../home/UserOption";
import useUserOptionStore from "@/store/user/userOptionStore";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const { user } = useUserStore();
  const { setIsOpen, isOpen } = useUserOptionStore();
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <nav>
        <div className={styles.logo}>
          <Link href="/">
            <h1>LOGO</h1>
          </Link>
        </div>
        <ul>
          {pathname !== "/" && (
            <>
              <Link
                href="/games"
                className={pathname === "/games" ? styles.active : undefined}
              >
                Games
              </Link>
            </>
          )}
          <Link
            href="/about-us"
            className={pathname === "/about-us" ? styles.active : undefined}
          >
            About Us
          </Link>
          <Link
            href="/about-game"
            className={pathname === "/about-game" ? styles.active : undefined}
          >
            About Game
          </Link>
        </ul>
      </nav>
      <div className={styles.user}>
        <p>{user?.originalUsername}</p>
        <div className={styles.avatar} onClick={() => setIsOpen(!isOpen)}>
          <Image
            src={user?.avatar || "/default-avatar.jpeg"}
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
