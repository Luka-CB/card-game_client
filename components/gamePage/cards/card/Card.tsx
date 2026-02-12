import { useEffect } from "react";
import { FaLock, FaLockOpen, FaRocketchat } from "react-icons/fa";
import styles from "../Cards.module.scss";
import {
  substringText,
  getRandomBotAvatar,
  getRandomColor,
} from "@/utils/misc";
import { Room } from "@/utils/interfaces";
import useSocket from "@/hooks/useSocket";
import useUserStore from "@/store/user/userStore";
import useFlashMsgStore from "@/store/flashMsgStore";
import User from "./User";
import PasswordPrompt from "./PasswordPrompt";
import useRoomStore from "@/store/gamePage/roomStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useJCoinsStore from "@/store/user/stats/jCoinsStore";
import { color } from "framer-motion";

interface CardProps {
  room: Room | null;
}

const Card: React.FC<CardProps> = ({ room }) => {
  const socket = useSocket();
  const { user } = useUserStore();
  const { setTogglePasswordPrompt } = useRoomStore();
  const { jCoins, toggleGetMoreModal } = useJCoinsStore();
  const { setMsg } = useFlashMsgStore();
  const router = useRouter();

  const roomUser = room?.users.find((roomUser) => roomUser.id === user?._id);

  useEffect(() => {
    if (!room && !user) return;

    if (roomUser && roomUser.status === "active" && room?.users.length === 4) {
      const timeout = setTimeout(() => {
        router.push(`/games/${room.id}`);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [room, router, user]);

  const handleLeave = () => {
    if (room && user) {
      if (roomUser?.status === "active") {
        socket?.emit("leaveRoom", room.id, user._id);
      } else {
        const usersWhoLeft = room?.users.filter(
          (roomUser) => roomUser.status === "left",
        );

        if (usersWhoLeft?.length === 3) {
          socket?.emit("destroyRoom", room.id);
        }

        socket?.emit("updateUserStatus", room.id, user._id, "left");
      }
    }
  };

  const handleJoin = () => {
    if (room && user) {
      if (room.status === "private") {
        setTogglePasswordPrompt(true);
        return;
      }

      if (jCoins && jCoins.raw < 100) {
        toggleGetMoreModal(true);
        setMsg("You need at least 100 JCoins to join a room", "error");
        return;
      }

      if (room.bett && jCoins && parseInt(room.bett) > jCoins.raw) {
        toggleGetMoreModal(true);
        setMsg(
          "You don't have enough JCoins to join this room with the current bet",
          "error",
        );
        return;
      }

      socket?.emit("joinRoom", room.id, user._id, {
        id: user._id,
        username: user.username,
        status: "active",
        avatar: user.avatar || "/default-avatar.jpeg",
        botAvatar: getRandomBotAvatar(),
        color: getRandomColor(),
      });
    }
  };

  const handleRejoin = () => {
    if (!socket || !room || !user) return;

    socket.emit("updateUserStatus", room.id, user._id, "active");
    const timeout = setTimeout(() => {
      router.push(`/games/${room.id}`);
    }, 500);

    return () => clearTimeout(timeout);
  };

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
      className={
        room?.users?.length === 4 ? styles.room_card_active : styles.room_card
      }
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
        <h4 title={room?.name && room.name.length > 10 ? room.name : undefined}>
          {room?.name ? substringText(room.name, 10) : ""}
        </h4>
        <div
          className={styles.game_type}
          title={
            room?.bett
              ? `Type: ${room?.type} - Bett: ${room?.bett}`
              : `Type: ${room?.type}`
          }
        >
          <span>{room?.type}</span>
          {room?.bett && <span className={styles.dash}>--</span>}
          {room?.bett && (
            <div className={styles.bett}>
              <span>Bett: {room?.bett}</span>
              <Image
                src="/coinIco.ico"
                alt="coin"
                width={15}
                height={15}
                className={styles.coin_img}
              />
            </div>
          )}
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
          <span className={styles.hisht}>
            Hisht: <b>{room?.hisht}</b>
          </span>
          <div className={styles.chat}>
            <FaRocketchat className={styles.chat_icon} />
            <small>
              Chat: <b>{room?.hasChat ? "On" : "Off"}</b>
            </small>
          </div>
        </div>
        {(roomUser?.status === "active" ||
          roomUser?.status === "inactive" ||
          roomUser?.status === "busy") && (
          <div className={styles.btns}>
            {(roomUser.status === "inactive" || roomUser.status === "busy") && (
              <button className={styles.rejoin_btn} onClick={handleRejoin}>
                Continue Playing
              </button>
            )}
            <button className={styles.leave_btn} onClick={handleLeave}>
              Leave
            </button>
          </div>
        )}

        {!roomUser && (
          <button className={styles.join_btn} onClick={handleJoin}>
            Join
          </button>
        )}
      </footer>
    </div>
  );
};

export default Card;
