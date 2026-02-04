"use client";

import styles from "./AvatarGallery.module.scss";
import Image from "next/image";
import useAvatarStore from "@/store/user/avatarStore";
import { FaTimesCircle } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import Loader from "@/components/loaders/Loader";
import { AnimatePresence, motion } from "framer-motion";

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

  useEffect(() => {
    if (!avatars.length) {
      getAvatars();
    }
  }, [avatars.length, getAvatars]);

  const handleSelectAvatar = (url: string) => {
    setNewAvatar(url);
  };

  const handleDone = () => {
    if (newAvatar) {
      setAvatar(newAvatar);
    }
    toggleAvatarGallery();
    setNewAvatar("");
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
            <div className={styles.header}>
              <h2>Select Your Avatar</h2>

              {(avatar || newAvatar) && (
                <div className={styles.preview}>
                  <Image
                    src={newAvatar ? newAvatar : avatar!}
                    alt="Selected Avatar"
                    width={100}
                    height={100}
                    className={styles.preview_image}
                  />

                  <button className={styles.done_btn} onClick={handleDone}>
                    Done
                  </button>
                  <button
                    className={styles.cancel_btn}
                    onClick={() => setNewAvatar("")}
                    disabled={!newAvatar}
                  >
                    Cancel
                  </button>
                </div>
              )}
              <button className={styles.close_btn} onClick={handleClose}>
                <FaTimesCircle />
              </button>
            </div>

            {status === "loading" && (
              <div className={styles.loader}>
                <Loader />
              </div>
            )}

            {status === "failed" && (
              <p className={styles.error}>Failed to load avatars.</p>
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
