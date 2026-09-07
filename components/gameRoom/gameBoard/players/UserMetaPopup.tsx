import useUserMetaStore from "@/store/user/userMetaStore";
import styles from "./Players.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { formatDate, substringText } from "@/utils/misc";
import { useLocale, useTranslations } from "next-intl";

const UserMetaPopup = ({ playerId }: { playerId: string }) => {
  const t = useTranslations("GameRoom.gameBoard.players.userMeta");
  const locale = useLocale();

  const { isMetaVisible, fetchUserMeta, userMeta, status } = useUserMetaStore();

  const isGuest = playerId.startsWith("guest_");

  useEffect(() => {
    if (isMetaVisible && !isGuest) {
      fetchUserMeta(playerId);
    }
  }, [isMetaVisible, playerId, fetchUserMeta, isGuest]);

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
          {isGuest || status === "failed" ? (
            <p className={styles.bio}>{t("guestUser")}</p>
          ) : (
            <>
              <div className={styles.name}>
                <h5>
                  {userMeta?.firstName} {userMeta?.lastName}
                </h5>
              </div>
              <p className={styles.bio}>
                {substringText(userMeta?.bio ?? "", 180)}
              </p>
              <h6>
                {t("rating")} <span>{userMeta?.rating}</span>
              </h6>
              <h6>
                {t("level")}{" "}
                <span className={styles.level}>{userMeta?.level}</span>
              </h6>
              <h6>
                {t("member")}{" "}
                <span>{formatDate(userMeta?.memberSince, locale)}</span>
              </h6>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserMetaPopup;
