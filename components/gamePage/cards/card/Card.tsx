import { useEffect } from "react";
import { FaLock, FaLockOpen } from "react-icons/fa";
import styles from "../Cards.module.scss";
import { substringText, getStoredRandomAvatar } from "@/utils/misc";
import { Room } from "@/utils/interfaces";
import useSocket from "@/hooks/useSocket";
import useUserStore from "@/store/user/userStore";
import useFlashMsgStore from "@/store/flashMsgStore";
import User from "./User";
import PasswordPrompt from "./PasswordPrompt";
import useRoomStore from "@/store/gamePage/roomStore";
import { useRouter } from "next/navigation";

interface CardProps {
  room: Room | null;
}

const Card: React.FC<CardProps> = ({ room }) => {
  const socket = useSocket();
  const { user } = useUserStore();
  const { setTogglePasswordPrompt } = useRoomStore();
  const { setMsg } = useFlashMsgStore();
  const router = useRouter();

  useEffect(() => {
    if (!room && !user) return;

    if (
      room?.users.some((user) => user.id === user.id) &&
      room?.users.length === 4
    ) {
      const timeout = setTimeout(() => {
        router.push(`/games/${room.id}`);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [room, router, user]);

  const handleLeave = () => {
    if (room && user) {
      socket?.emit("leaveRoom", room.id, user._id);
    }
  };

  const handleJoin = () => {
    if (room && user) {
      if (room.status === "private") {
        setTogglePasswordPrompt(true);
        return;
      }

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

  const isInProgress = room?.isActive;

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
    <div
      className={room?.isActive ? styles.room_card_active : styles.room_card}
    >
      <PasswordPrompt
        room={room as Room}
        user={
          user
            ? { id: user._id, username: user.username, avatar: user.avatar }
            : null
        }
      />
      <header>
        <h4 title={room?.name && room.name.length > 14 ? room.name : undefined}>
          {room?.name ? substringText(room.name, 14) : ""}
        </h4>
        <div className={styles.game_type}>
          <span>{room?.type}</span>
        </div>
        <div className={styles.status}>
          {room?.status === "private" ? (
            <FaLock className={styles.icon} />
          ) : (
            <FaLockOpen className={styles.icon} />
          )}
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
        <div className={styles.left}>
          <span>
            Hisht: <b>{room?.hisht}</b>
          </span>
        </div>
        {isUserInRoom ? (
          <button className={styles.leave_btn} onClick={handleLeave}>
            Leave
          </button>
        ) : (
          <button
            className={styles.join_btn}
            onClick={handleJoin}
            disabled={isInProgress}
          >
            {isInProgress ? "In Progress" : "Join"}
          </button>
        )}
      </footer>
    </div>
  );
};

export default Card;
