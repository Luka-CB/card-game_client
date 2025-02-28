"use client";

import { useState } from "react";
import styles from "./Avatar.module.scss";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import Image from "next/image";
import useAvatarStore from "@/app/store/avatarStore";

const Avatar = () => {
  const { avatar, setAvatar } = useAvatarStore();

  const handleChooseFile = (file: File) => {
    if (file && file instanceof Blob) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.file}>
        <input
          type="file"
          id="file"
          hidden
          accept="image/*"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            e.target.files !== null && handleChooseFile(e.target.files[0])
          }
        />
        <button>
          <label htmlFor="file">
            {!avatar ? (
              <div className={styles.choose}>
                <MdOutlineAddPhotoAlternate className={styles.icon} />
                <span>Choose</span>
              </div>
            ) : (
              <div className={styles.image} title="Change avatar">
                <Image src={avatar} alt="avatar" fill />
              </div>
            )}
          </label>
        </button>
      </div>
    </div>
  );
};

export default Avatar;
