import styles from "./Oauth.module.scss";
import { FcGoogle } from "react-icons/fc";
import { useLocale, useTranslations } from "next-intl";

const googleUrl =
  process.env.NEXT_PUBLIC_GOOGLE_URL ||
  "http://localhost:5000/api/oauth/login/google";

const Oauth = () => {
  const t = useTranslations("Auth.leftPanel.oAuth");
  const locale = useLocale();

  const handleGoogleLogin = () => window.open(googleUrl, "_self");

  return (
    <div className={styles.social_auth} data-locale={locale}>
      <button onClick={handleGoogleLogin}>
        <FcGoogle className={styles.icon} />
        <span>{t("google")}</span>
      </button>
    </div>
  );
};

export default Oauth;
