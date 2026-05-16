"use client";

import styles from "./AvatarGallery.module.scss";
import Image from "next/image";
import useAvatarStore from "@/store/user/avatarStore";
import { FaTimesCircle } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import { MdOutlineDoneOutline } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import Loader from "@/components/loaders/Loader";
import { AnimatePresence, motion } from "framer-motion";
import useUserAccountStore from "@/store/user/userAccountStore";
import useFlashMsgStore from "@/store/flashMsgStore";
import useUserActivityStore from "@/store/user/userActivityStore";
import { useLocale, useTranslations } from "next-intl";

const LazyAvatar = ({
  av,
  isSelected,
  onSelect,
}: {
  av: { _id: string; url: string; name: string };
  isSelected: boolean;
  onSelect: (url: string) => void;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "50px" },
    );

    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={imgRef}
      title={av.name}
      className={`${styles.avatar_item} ${isSelected ? styles.selected : ""}`}
      onClick={() => onSelect(av.url)}
    >
      {isVisible ? (
        <Image
          src={av.url}
          alt={av.name}
          width={120}
          height={120}
          loading="lazy"
          className={styles.avatar_image}
        />
      ) : (
        <div className={styles.avatar_placeholder}></div>
      )}
    </div>
  );
};

const AvatarGallery = () => {
  const t = useTranslations("Auth.leftPanel.avatarGallery");
  const locale = useLocale();

  const {
    setAvatar,
    setNewAvatar,
    avatars,
    avatar,
    newAvatar,
    status,
    getAvatars,
    isAvatarGalleryOpen,
    toggleAvatarGallery,
  } = useAvatarStore();
  const { updateUserAvatar, updateAvatarStatus, userAccount } =
    useUserAccountStore();
  const { setMsg } = useFlashMsgStore();
  const { fetchUserActivities } = useUserActivityStore();

  useEffect(() => {
    if (!avatars.length) {
      getAvatars();
    }
  }, [avatars.length, getAvatars]);

  const handleSelectAvatar = (url: string) => {
    setNewAvatar(url);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (updateAvatarStatus === "success") {
      setMsg(t("success"), "success");
      fetchUserActivities();

      timer = setTimeout(() => {
        toggleAvatarGallery();
        setNewAvatar("");
      }, 2000);
    } else if (updateAvatarStatus === "error") {
      setMsg(t("error"), "error");
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [
    updateAvatarStatus,
    setMsg,
    fetchUserActivities,
    toggleAvatarGallery,
    setNewAvatar,
  ]);

  const handleDone = () => {
    if (newAvatar && userAccount?._id) {
      updateUserAvatar(newAvatar);
    } else {
      setAvatar(newAvatar || avatar || "");
      toggleAvatarGallery();
      setNewAvatar("");
    }
  };

  const handleClose = () => {
    setNewAvatar("");
    toggleAvatarGallery();
  };

  return (
    <AnimatePresence>
      {isAvatarGalleryOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          exit={{ opacity: 0 }}
          className={styles.gallery_bg}
        >
          <motion.div
            initial={{ top: 0, opacity: 0 }}
            animate={{ top: "50%", opacity: 1 }}
            exit={{ top: 0, opacity: 0 }}
            transition={{ duration: 0.3, type: "spring" }}
            className={styles.gallery}
          >
            <div className={styles.header} data-locale={locale}>
              {(avatar || newAvatar) && (
                <div className={styles.preview}>
                  <div className={styles.image_wrapper}>
                    <Image
                      src={newAvatar ? newAvatar : avatar!}
                      alt="Selected Avatar"
                      width={100}
                      height={100}
                      className={styles.preview_image}
                    />

                    {updateAvatarStatus === "loading" && (
                      <div className={styles.loading_overlay}></div>
                    )}
                  </div>

                  <button
                    className={styles.done_btn}
                    disabled={updateAvatarStatus === "loading"}
                    onClick={handleDone}
                  >
                    <MdOutlineDoneOutline className={styles.icon} />
                  </button>
                  <button
                    className={styles.cancel_btn}
                    onClick={() => setNewAvatar("")}
                    disabled={!newAvatar || updateAvatarStatus === "loading"}
                  >
                    <ImCancelCircle className={styles.icon} />
                  </button>
                </div>
              )}
              <button className={styles.close_btn} onClick={handleClose}>
                <FaTimesCircle />
              </button>
              <h2>{t("title")}</h2>
            </div>

            {status === "loading" && (
              <div className={styles.loader}>
                <Loader />
              </div>
            )}

            {status === "failed" && (
              <p className={styles.error}>{t("failed")}</p>
            )}

            <div className={styles.body}>
              {status === "success" && (
                <div className={styles.avatar_grid}>
                  {avatars.map((av) => (
                    <LazyAvatar
                      key={av._id}
                      av={av}
                      isSelected={newAvatar === av.url}
                      onSelect={handleSelectAvatar}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AvatarGallery;
