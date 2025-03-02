import styles from "./Error.module.scss";
import { FaFaceSadTear } from "react-icons/fa6";
import { IoMdArrowRoundBack } from "react-icons/io";
import { CiWarning } from "react-icons/ci";
import { motion } from "framer-motion";
import Link from "next/link";

const Error = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: "spring", delay: 1 }}
      className={styles.container}
    >
      <div className={styles.text_one}>
        <FaFaceSadTear className={styles.icon} />
        <h1>Ooops! Something went wrong.</h1>
      </div>
      <div className={styles.text_two}>
        <p>
          <CiWarning className={styles.icon} />
          Please make sure that this google account email is not already
          registered with us!
        </p>
        <small>
          We will try to fix this error, if it's coming from our end!
        </small>
        <div className={styles.go_back}>
          <IoMdArrowRoundBack className={styles.icon} />
          <Link href="?auth=signin">back to sign in</Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Error;
