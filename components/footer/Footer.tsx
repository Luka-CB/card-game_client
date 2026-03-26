import Image from "next/image";
import styles from "./Footer.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  return (
    <footer className={styles.footer}>
      <div className={styles.copyright}>
        <Image
          src="/logos/logo.png"
          alt="Joker Clash Logo"
          width={50}
          height={50}
          loading="eager"
          className={styles.logo}
        />
        <p>© 2026 jokerclash.com. All rights reserved.</p>
      </div>
      <span>|</span>
      <div className={styles.links}>
        <Link
          href="/rules"
          className={pathname === "/rules" ? styles.active : ""}
        >
          Game Rules
        </Link>
        <Link
          href="/about"
          className={pathname === "/about" ? styles.active : ""}
        >
          About Us
        </Link>
        <Link
          href="/terms"
          className={pathname === "/terms" ? styles.active : ""}
        >
          Terms of Service
        </Link>
        <Link
          href="/privacy"
          className={pathname === "/privacy" ? styles.active : ""}
        >
          Privacy Policy
        </Link>
        <Link
          href="/data-deletion"
          className={pathname === "/data-deletion" ? styles.active : ""}
        >
          Data Deletion
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
