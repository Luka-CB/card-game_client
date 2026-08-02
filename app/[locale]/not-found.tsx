import { Link } from "@/i18n/navigation";
import styles from "./not-found.module.scss";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("NotFoundPage");

  return (
    <div className={styles.container}>
      <h1>{t("title")}</h1>
      <p>{t("paragraph")}</p>
      <Link href="/">{t("link")}</Link>
    </div>
  );
}
