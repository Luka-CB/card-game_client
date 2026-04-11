import useUserMetaStore from "@/store/user/userMetaStore";
import styles from "./Players.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { formatDate, substringText } from "@/utils/misc";

const UserMetaPopup = ({ playerId }: { playerId: string }) => {
  const { isMetaVisible, state, fetchUserMeta, userMeta } = useUserMetaStore();

  useEffect(() => {
    if (isMetaVisible) {
      fetchUserMeta(playerId);
    }
  }, [isMetaVisible, playerId, fetchUserMeta]);

  return (
    <AnimatePresence>
      {isMetaVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          className={styles.user_meta}
        >
          <div className={styles.name}>
            <h5>
              {userMeta?.firstName} {userMeta?.lastName}
            </h5>
          </div>
          <p className={styles.bio}>
            {substringText(userMeta?.bio ?? "", 180)}
          </p>
          <h6>
            Rating: <span>{userMeta?.rating}</span>
          </h6>
          <h6>
            Member Since: <span>{formatDate(userMeta?.memberSince)}</span>
          </h6>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserMetaPopup;
