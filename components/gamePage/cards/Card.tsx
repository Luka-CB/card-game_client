import styles from "./Cards.module.scss";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { substringText, getStoredRandomAvatar } from "@/utils/misc";
import { Room } from "@/utils/interfaces";
import Image from "next/image";
import useSocket from "@/hooks/useSocket";
import useUserStore from "@/store/user/userStore";
import useFlashMsgStore from "@/store/flashMsgStore";
import { useEffect } from "react";

interface propsIFace {
  room: Room | null;
}

const Card: React.FC<propsIFace> = ({ room }) => {
  const socket = useSocket();
  const { user } = useUserStore();
  const { setMsg } = useFlashMsgStore();

  const handleLeave = () => {
    if (room && user) {
      socket?.emit("leaveRoom", room.id, user._id);
    }
  };

  const handleJoin = () => {
    if (room && user) {
      const userAvatar = user.avatar || getStoredRandomAvatar();
      socket?.emit("joinRoom", room.id, user._id, {
        id: user._id,
        username: user.username,
        avatar: userAvatar,
      });
    }
  };

  const isUserInRoom = room?.users.some(
    (roomUser) => roomUser.id === user?._id
  );

  const isRoomFull = room?.users.length === 4;

  useEffect(() => {
    if (!socket) return;

    socket.on("error", (error: string) => {
      setMsg(error, "error");
    });

    return () => {
      socket.off("error");
    };
  }, [socket]);

  return (
    <div className={styles.room_card}>
      <header>
        <h4 title={room?.name && room.name.length > 14 ? room.name : undefined}>
          {room?.name ? substringText(room.name, 14) : ""}
        </h4>
        <div className={styles.status}>
          <FaLockOpen className={styles.icon} />
          <span>{room?.status}</span>
        </div>
      </header>
      <div className={styles.body}>
        <User user={room?.users[0] ? room.users[0] : null} />
        <User user={room?.users[1] ? room.users[1] : null} />
        <User user={room?.users[2] ? room.users[2] : null} />
        <User user={room?.users[3] ? room.users[3] : null} />
      </div>
      <footer>
        {isUserInRoom ? (
          <button className={styles.leave_btn} onClick={handleLeave}>
            Leave
          </button>
        ) : (
          <button
            className={styles.join_btn}
            onClick={handleJoin}
            disabled={isRoomFull}
          >
            {isRoomFull ? "Full" : "Join"}
          </button>
        )}
      </footer>
    </div>
  );
};

interface User {
  user: { id: string; username: string; avatar: string | null } | null;
}

const User: React.FC<User> = ({ user }) => {
  return (
    <div className={styles.user} title={user?.username}>
      {user ? (
        <Image
          src={user.avatar ? user.avatar : getStoredRandomAvatar()}
          alt={user.username}
          width={200}
          height={200}
        />
      ) : (
        <div className={styles.user_placeholder}></div>
      )}
    </div>
  );
};

export default Card;
