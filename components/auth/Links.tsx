import { useLocale, useTranslations } from "next-intl";
import styles from "./Links.module.scss";
import { Link } from "@/i18n/navigation";

const Links = ({ isSm, isRight }: { isSm?: boolean; isRight?: boolean }) => {
  const l = useTranslations("Links");
  const locale = useLocale();

  return (
    <div
      className={
        isSm ? styles.linkSm : isRight ? styles.linksRight : styles.links
      }
      data-locale={locale}
    >
      <Link href="/rules" className={styles.link}>
        {l("rules")}
      </Link>
      <Link href="/about" className={styles.link}>
        {l("about")}
      </Link>
      <Link href="/privacy" className={styles.link}>
        {l("privacy")}
      </Link>
      <Link href="/terms" className={styles.link}>
        {l("terms")}
      </Link>
      <Link href="/data-deletion" className={styles.link}>
        {l("dataDeletion")}
      </Link>
    </div>
  );
};

export default Links;
