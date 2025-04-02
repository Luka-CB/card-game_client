"use client";

import useUserStore from "@/store/user/userStore";
import styles from "./Header.module.scss";
import { FaCaretDown } from "react-icons/fa6";
import Image from "next/image";
import UserOption from "../home/UserOption";
import useUserOptionStore from "@/store/user/userOptionStore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { getStoredRandomAvatar } from "@/utils/misc";

const Header = () => {
  const { user } = useUserStore();
  const { setIsOpen, isOpen } = useUserOptionStore();
  const pathname = usePathname();

  const avatar = useMemo(() => {
    return user?.avatar || getStoredRandomAvatar();
  }, [user?.avatar]);

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
                href="/classic"
                className={pathname === "/classic" ? styles.active : undefined}
              >
                Classic Games
              </Link>
              <Link
                href="/nines"
                className={pathname === "/nines" ? styles.active : undefined}
              >
                Nines Games
              </Link>
              <Link
                href="/betting"
                className={pathname === "/betting" ? styles.active : undefined}
              >
                Betting Games
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
