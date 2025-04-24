import Image from "next/image";
import styles from "../Cards.module.scss";

interface UserProps {
  user: { id: string; username: string; avatar: string | null } | null;
}

const User: React.FC<UserProps> = ({ user }) => {
  return (
    <div className={styles.user} title={user?.username}>
      {user ? (
        <Image
          src={user.avatar || "/avatars/avatar-1.jpeg"}
          alt={user.username || "User"}
          width={200}
          height={200}
        />
      ) : (
        <div className={styles.user_placeholder}></div>
      )}
    </div>
  );
};

export default User;
