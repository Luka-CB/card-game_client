import Image from "next/image";
import styles from "./Footer.module.scss";
import { usePathname, Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";

const Footer = () => {
  const t = useTranslations("Footer");
  const l = useTranslations("Links");
  const locale = useLocale();

  const pathname = usePathname();

  return (
    <footer className={styles.footer} data-locale={locale}>
      <div className={styles.copyright}>
        <Image
          src="/logos/logo.png"
          alt="Joker Clash Logo"
          width={50}
          height={50}
          loading="eager"
          className={styles.logo}
        />
        <p>{t("rights")}</p>
      </div>
      <span>|</span>
      <div className={styles.links}>
        <Link
          href="/rules"
          className={pathname === "/rules" ? styles.active : ""}
        >
          {l("rules")}
        </Link>
        <Link
          href="/about"
          className={pathname === "/about" ? styles.active : ""}
        >
          {l("about")}
        </Link>
        <Link
          href="/terms"
          className={pathname === "/terms" ? styles.active : ""}
        >
          {l("terms")}
        </Link>
        <Link
          href="/privacy"
          className={pathname === "/privacy" ? styles.active : ""}
        >
          {l("privacy")}
        </Link>
        <Link
          href="/data-deletion"
          className={pathname === "/data-deletion" ? styles.active : ""}
        >
          {l("dataDeletion")}
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
