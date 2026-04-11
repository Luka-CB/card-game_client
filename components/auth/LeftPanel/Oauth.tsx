import styles from "./Oauth.module.scss";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";

const googleUrl =
  process.env.NEXT_PUBLIC_GOOGLE_URL ||
  "http://localhost:5000/api/oauth/login/google";

const facebookUrl =
  process.env.NEXT_PUBLIC_FACEBOOK_URL ||
  "http://localhost:5000/api/oauth/login/facebook";

const Oauth = () => {
  const handleGoogleLogin = () => window.open(googleUrl, "_self");
  const handleFacebookLogin = () => window.open(facebookUrl, "_self");

  return (
    <div className={styles.social_auth}>
      <button onClick={handleGoogleLogin}>
        <FcGoogle className={styles.icon} />
        <span>Continue with Google</span>
      </button>
      <button onClick={handleFacebookLogin}>
        <FaFacebook className={styles.icon} />
        <span>Continue with Facebook</span>
      </button>
    </div>
  );
};

export default Oauth;
