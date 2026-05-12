import { Room, RoomUser } from "@/utils/interfaces";
import styles from "./DisplayCard.module.scss";
import useUserStore from "@/store/user/userStore";
import useJCoinsStore from "@/store/user/stats/jCoinsStore";
import { FaLock, FaLockOpen, FaRocketchat } from "react-icons/fa";
import useFlashMsgStore from "@/store/flashMsgStore";
import { useRef, useState } from "react";
import useRoomStore from "@/store/gamePage/roomStore";
import { substringText } from "@/utils/misc";
import Image from "next/image";
import useSocket from "@/hooks/useSocket";
import useDisplayRoomStore from "@/store/displayRoomStore";
import { useLocale, useTranslations } from "next-intl";
import { buildJoinRoomUserPayload } from "@/utils/roomJoin";

interface DisplayCardProps {
  room: Room;
  type: "classic" | "nines" | "betting";
  roomImIn?: Room | null;
}

const DisplayCard: React.FC<DisplayCardProps> = ({ room, type, roomImIn }) => {
  const t = useTranslations("GamePage.cards.card");

  const { setTogglePasswordPrompt } = useRoomStore();
  const { user } = useUserStore();
  const { jCoins, toggleGetMoreModal } = useJCoinsStore();
  const { setMsg } = useFlashMsgStore();
  const { setDisplayRoomType } = useDisplayRoomStore();
  const socket = useSocket();

  const isLeavingRef = useRef(false);
  const hasNavigatedRef = useRef(false);
  const [isWarningVisible, setIsWarningVisible] = useState(false);

  const isPrivateCreatorLeaveWarning = Boolean(
    room &&
    user &&
    !room.isActive &&
    room.status === "private" &&
    room.creatorId === user._id,
  );

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
      if (isPrivateCreatorLeaveWarning) {
        setIsWarningVisible(true);
        return;
      }

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

  const onConfirmWarning = () => {
    if (!room || !user) return;

    isLeavingRef.current = true;
    hasNavigatedRef.current = false;

    socket?.emit("leaveRoom", room.id, user._id);
    setDisplayRoomType({ type, withUser: false });
    setIsWarningVisible(false);
  };

  const onCancelWarning = () => {
    setIsWarningVisible(false);
  };

  const handleJoin = () => {
    if (room && user) {
      isLeavingRef.current = false;

      if (occupiedSeats >= 4) {
        setMsg(t("msgs.fullRoom"), "error");
        return;
      }

      if (user.isGuest && room.bet) {
        setMsg(t("msgs.guestNoBet"), "error");
        return;
      }

      if (roomImIn) {
        setMsg(t("msgs.alreadyInRoom"), "error");
        return;
      }

      if (room.status === "private") {
        setTogglePasswordPrompt(true);
        return;
      }

      if (jCoins && jCoins.raw < 100) {
        toggleGetMoreModal(true);
        setMsg(t("msgs.coinsNeeded"), "error");
        return;
      }

      if (room.bet && jCoins && parseInt(room.bet) > jCoins.raw) {
        toggleGetMoreModal(true);
        setMsg(t("msgs.notEnoughCoins"), "error");
        return;
      }

      socket?.emit(
        "joinRoom",
        room.id,
        user._id,
        buildJoinRoomUserPayload(user),
      );

      setDisplayRoomType({ type, withUser: true });
    }
  };

  return (
    <div className={styles.room_card}>
      {isWarningVisible && (
        <LeaveWarning onConfirm={onConfirmWarning} onCancel={onCancelWarning} />
      )}
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
          <span>
            {room?.type === "classic" ? t("types.classic") : t("types.nines")}
          </span>
          {room?.bet && <span className={styles.dash}>--</span>}
          {room?.bet && (
            <div className={styles.bet}>
              <span>
                {t("bet")}: {room?.bet}
              </span>
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
          <span>
            {room?.status === "private"
              ? t("status.private")
              : t("status.public")}
          </span>
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
            {t("hisht")} <b>{room?.hisht}</b>
          </span>
          <div className={styles.chat}>
            <FaRocketchat className={styles.chat_icon} />
            <small>
              {t("chat.label")}{" "}
              <b>{room?.hasChat ? t("chat.on") : t("chat.off")}</b>
            </small>
          </div>
        </div>

        {!room?.isActive && roomUser?.status === "active" && (
          <button className={styles.leave_btn} onClick={handleLeave}>
            {t("btns.leave")}
          </button>
        )}

        {!roomUser && !room?.isActive && (
          <button className={styles.join_btn} onClick={() => handleJoin()}>
            {t("btns.join")}
          </button>
        )}
      </div>
    </div>
  );
};

export default DisplayCard;

const LeaveWarning = ({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  const t = useTranslations("GamePage.cards.card.leaveWarning.creatorRoom");
  const locale = useLocale();

  return (
    <div className={styles.leave_warning} data-locale={locale}>
      <p>{t("paragraph")}</p>
      <small>{t("small")}</small>
      <div className={styles.leave_warning_btns}>
        <button className={styles.confirm_btn} onClick={onConfirm}>
          {t("btns.yes")}
        </button>
        <button className={styles.cancel_btn} onClick={onCancel}>
          {t("btns.no")}
        </button>
      </div>
    </div>
  );
};

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
