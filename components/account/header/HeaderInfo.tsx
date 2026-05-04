import Image from "next/image";
import styles from "./HeaderInfo.module.scss";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { GoUnverified } from "react-icons/go";
import { MdEdit } from "react-icons/md";
import useUpdateEmailStore from "@/store/email/updateEmailStore";
import { timeAgoStrict } from "@/utils/misc";
import useAvatarStore from "@/store/user/avatarStore";
import useChangeUsernameStore from "@/store/user/changeUsernameStore";
import { useLocale, useTranslations } from "next-intl";

interface HeaderInfoProps {
  avatar: string;
  firstName: string;
  lastName: string;
  username: string;
  originalUsername: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
  provider: "local" | "google" | "facebook";
}

const HeaderInfo: React.FC<HeaderInfoProps> = ({
  avatar,
  firstName,
  lastName,
  username,
  originalUsername,
  email,
  isVerified,
  createdAt,
  provider,
}) => {
  const t = useTranslations("AccountPage.header");
  const locale = useLocale();

  const { toggleChangeEmailModal } = useUpdateEmailStore();
  const { toggleAvatarGallery } = useAvatarStore();
  const { toggleChangeUsername } = useChangeUsernameStore();

  return (
    <header className={styles.header}>
      <div className={styles.avatar} aria-hidden>
        <Image
          src={avatar || "/default-avatar.jpeg"}
          alt="User Avatar"
          width={72}
          height={72}
          className={styles.avatar_img}
        />
        <div
          className={styles.edit}
          onClick={toggleAvatarGallery}
          title={t("editAvatarTitle")}
        >
          <MdEdit className={styles.edit_icon} />
        </div>
      </div>
      <div className={styles.headerInfo}>
        <div className={styles.name_wrapper}>
          <h1 className={styles.name}>
            {firstName && lastName
              ? `${firstName} ${lastName}`
              : originalUsername || "User"}
            {isVerified && (
              <RiVerifiedBadgeFill
                className={styles.verified_icon}
                title={t("verifiedTitle")}
              />
            )}
            {!isVerified && (
              <GoUnverified
                className={styles.not_verified_icon}
                title={t("notVerifiedTitle")}
              />
            )}
          </h1>
        </div>
        <div className={styles.username}>
          <p className={styles.handle}>@{username}</p>
          <button
            className={styles.edit_btn}
            title={t("editUsernameTitle")}
            onClick={() => toggleChangeUsername(true)}
          >
            <MdEdit className={styles.edit_icon} />
          </button>
        </div>
        <p className={styles.sub}>
          {t("date")} {timeAgoStrict(createdAt, locale)}
        </p>
        <div className={styles.user_email} title={t("editEmailTitle")}>
          <p className={styles.email}>{email}</p>
          {provider === "local" && (
            <button
              className={styles.edit_btn}
              onClick={toggleChangeEmailModal}
            >
              <MdEdit className={styles.edit_icon} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderInfo;
