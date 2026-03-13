import { useEffect, useRef } from "react";
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
import useDisplayRoomStore from "@/store/displayRoomStore";

interface CardProps {
  room: Room | null;
}

const Card: React.FC<CardProps> = ({ room }) => {
  const socket = useSocket();
  const { user } = useUserStore();
  const { setTogglePasswordPrompt } = useRoomStore();
  const { jCoins, toggleGetMoreModal } = useJCoinsStore();
  const { setMsg } = useFlashMsgStore();
  const { setDisplayRoomType } = useDisplayRoomStore();
  const router = useRouter();

  const isLeavingRef = useRef(false);
  const hasNavigatedRef = useRef(false);
  const clickedRoomIdRef = useRef<string | null>(null);

  const roomUser = room?.users.find(
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

  useEffect(() => {
    if (!room && !user) return;
    if (isLeavingRef.current) return;
    if (hasNavigatedRef.current) return;

    if (
      room?.isActive &&
      roomUser &&
      roomUser.status === "active" &&
      occupiedSeats >= 4
    ) {
      hasNavigatedRef.current = true;
      const timeout = setTimeout(() => {
        if (!isLeavingRef.current) {
          router.push(`/rooms/${room?.id}`);
        } else {
          hasNavigatedRef.current = false;
        }
      }, 1000);

      return () => {
        clearTimeout(timeout);
        hasNavigatedRef.current = false;
      };
    }
  }, [room, router, user, roomUser, occupiedSeats]);

  useEffect(() => {
    if (!roomUser || roomUser.status === "left") {
      hasNavigatedRef.current = false;
      const timeout = setTimeout(() => {
        isLeavingRef.current = false;
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [roomUser]);

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

      const type = room?.bet ? "betting" : room?.type || "none";
      setDisplayRoomType({ type, withUser: false });
    }
  };

  const handleJoin = (roomId: string) => {
    if (room && user) {
      isLeavingRef.current = false;

      if (occupiedSeats >= 4) {
        setMsg("Room is full", "error");
        return;
      }

      if (roomId === room?.id && room?.status === "private") {
        setTogglePasswordPrompt(true);
        clickedRoomIdRef.current = roomId;
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

      const type = room?.bet ? "betting" : room?.type;

      setDisplayRoomType({ type, withUser: true });
    }
  };

  const handleRejoin = () => {
    if (!socket || !room || !user) return;

    isLeavingRef.current = false;

    socket.emit("updateUserStatus", room.id, user._id, "active");
    const timeout = setTimeout(() => {
      router.push(`/rooms/${room.id}`);
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
  }, [socket, setMsg]);

  return (
    <div
      className={
        room?.users?.some((ru) => ru.id === user?._id && ru.status !== "left")
          ? styles.room_card_joined
          : room?.isActive
            ? styles.room_card_active
            : styles.room_card
      }
    >
      <PasswordPrompt
        room={room as Room}
        clickedRoomId={clickedRoomIdRef.current}
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

        {room?.isActive &&
          (roomUser?.status === "active" ||
            roomUser?.status === "inactive" ||
            roomUser?.status === "busy") && (
            <div className={styles.btns}>
              {(roomUser.status === "inactive" ||
                roomUser.status === "busy") && (
                <button className={styles.rejoin_btn} onClick={handleRejoin}>
                  Continue Playing
                </button>
              )}
              <button className={styles.leave_btn} onClick={handleLeave}>
                Leave
              </button>
            </div>
          )}

        {!room?.isActive && roomUser?.status === "active" && (
          <button className={styles.leave_btn} onClick={handleLeave}>
            Leave
          </button>
        )}

        {!roomUser && !room?.isActive && (
          <button
            className={styles.join_btn}
            onClick={() => handleJoin(room?.id || "")}
          >
            Join
          </button>
        )}
      </footer>
    </div>
  );
};

export default Card;
