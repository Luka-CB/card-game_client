import { Room, RoomUser } from "@/utils/interfaces";
import styles from "./DisplayCard.module.scss";
import useUserStore from "@/store/user/userStore";
import useJCoinsStore from "@/store/user/stats/jCoinsStore";
import { FaLock, FaLockOpen, FaRocketchat } from "react-icons/fa";
import useFlashMsgStore from "@/store/flashMsgStore";
import { useRef } from "react";
import useRoomStore from "@/store/gamePage/roomStore";
import {
  getRandomBotAvatar,
  getRandomColor,
  substringText,
} from "@/utils/misc";
import Image from "next/image";
import useSocket from "@/hooks/useSocket";
import useDisplayRoomStore from "@/store/displayRoomStore";

interface DisplayCardProps {
  room: Room;
  type: "classic" | "nines" | "betting";
  roomImIn?: Room | null;
}

const DisplayCard: React.FC<DisplayCardProps> = ({ room, type, roomImIn }) => {
  const { setTogglePasswordPrompt } = useRoomStore();
  const { user } = useUserStore();
  const { jCoins, toggleGetMoreModal } = useJCoinsStore();
  const { setMsg } = useFlashMsgStore();
  const { setDisplayRoomType } = useDisplayRoomStore();
  const socket = useSocket();

  const isLeavingRef = useRef(false);
  const hasNavigatedRef = useRef(false);

  const roomUser = room?.users?.find(
    (u) => u.id === user?._id && u.status !== "left",
  );

  const occupiedSeats = (() => {
    if (!room?.users) return 0;
    const activeUsers = new Set<string>();
    for (const u of room.users) {
      if (u?.id && u.status !== "left") {
        activeUsers.add(u.id);
      }
    }
    return activeUsers.size;
  })();

  const handleLeave = () => {
    if (room && user) {
      isLeavingRef.current = true;
      hasNavigatedRef.current = false;

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
      setDisplayRoomType({ type, withUser: false });
    }
  };

  const handleJoin = () => {
    if (room && user) {
      isLeavingRef.current = false;

      if (occupiedSeats >= 4) {
        setMsg("Room is full", "error");
        return;
      }

      if (roomImIn) {
        setMsg("You can't be more than one room at the same time!", "error");
        return;
      }

      if (room.status === "private") {
        setTogglePasswordPrompt(true);
        return;
      }

      if (jCoins && jCoins.raw < 100) {
        toggleGetMoreModal(true);
        setMsg("You need at least 100 JCoins to join a room", "error");
        return;
      }

      if (room.bet && jCoins && parseInt(room.bet) > jCoins.raw) {
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

      setDisplayRoomType({ type, withUser: true });
    }
  };

  return (
    <div className={styles.room_card}>
      <div className={styles.card_header}>
        <h4
          title={room?.name && room.name?.length > 10 ? room.name : undefined}
        >
          {room?.name ? substringText(room.name, 10) : ""}
        </h4>
        <div
          className={styles.game_type}
          title={
            room?.bet
              ? `Type: ${room?.type} - Bet: ${room?.bet}`
              : `Type: ${room?.type}`
          }
        >
          <span>{room?.type}</span>
          {room?.bet && <span className={styles.dash}>--</span>}
          {room?.bet && (
            <div className={styles.bet}>
              <span>Bet: {room?.bet}</span>
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
      </div>
      <div className={styles.card_body}>
        <User user={room?.users && room.users[0] ? room.users[0] : null} />
        <User user={room?.users && room?.users[1] ? room.users[1] : null} />
        <User user={room?.users && room?.users[2] ? room.users[2] : null} />
        <User user={room?.users && room?.users[3] ? room.users[3] : null} />
      </div>
      <div className={styles.card_footer}>
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

        {!room?.isActive && roomUser?.status === "active" && (
          <button className={styles.leave_btn} onClick={handleLeave}>
            Leave
          </button>
        )}

        {!roomUser && !room?.isActive && (
          <button className={styles.join_btn} onClick={() => handleJoin()}>
            Join
          </button>
        )}
      </div>
    </div>
  );
};

export default DisplayCard;

interface UserProps {
  user: RoomUser | null;
}

const User: React.FC<UserProps> = ({ user }) => {
  return (
    <div className={styles.user} title={user?.username}>
      {user ? (
        <Image
          src={
            user.status === "left"
              ? user.botAvatar || "/bots/bot-1.jpeg"
              : user.avatar || "/avatars/avatar-1.jpeg"
          }
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
