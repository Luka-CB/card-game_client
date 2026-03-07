import useUserOptionStore from "@/store/user/userOptionStore";
import styles from "./Avatar.module.scss";
import useUserStore from "@/store/user/userStore";
import Image from "next/image";
import { FaCaretDown } from "react-icons/fa6";
import useWindowSize from "@/hooks/useWindowSize";
import UserOption from "../home/UserOption";

const Avatar = () => {
  const { setIsOpen, isOpen } = useUserOptionStore();
  const { user } = useUserStore();
  const windowSize = useWindowSize();

  return (
    <>
      <div
        className={windowSize.width <= 700 ? styles.avatar_sm : styles.avatar}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Image
          src={user?.avatar || "/default-avatar.jpeg"}
          alt="avatar"
          width={50}
          height={50}
          className={styles.avatar_img}
        />
        <div className={styles.caret}>
          <FaCaretDown className={styles.caret_icon} />
        </div>
      </div>
      <UserOption />
    </>
  );
};

export default Avatar;
