import styles from "./Oauth.module.scss";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";

const googleUrl = "http://localhost:5000/api/oauth/login/google";

const Oauth = () => {
  const handleGoogleLogin = () => window.open(googleUrl, "_self");

  return (
    <div className={styles.social_auth}>
      <button onClick={handleGoogleLogin}>
        <FcGoogle className={styles.icon} />
        <span>Continue with Google</span>
      </button>
      <button>
        <FaFacebook className={styles.icon} />
        <span>Continue with Facebook</span>
      </button>
    </div>
  );
};

export default Oauth;
