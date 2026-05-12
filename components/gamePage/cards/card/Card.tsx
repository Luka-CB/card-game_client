import { useEffect, useRef, useState } from "react";
import { FaLock, FaLockOpen, FaRocketchat } from "react-icons/fa";
import styles from "../Cards.module.scss";
import { substringText } from "@/utils/misc";
import { Room } from "@/utils/interfaces";
import useSocket from "@/hooks/useSocket";
import useUserStore from "@/store/user/userStore";
import useFlashMsgStore from "@/store/flashMsgStore";
import User from "./User";
import PasswordPrompt from "./PasswordPrompt";
import useRoomStore from "@/store/gamePage/roomStore";
import { useRouter } from "next/navigation";
import { usePathname } from "@/i18n/navigation";
import Image from "next/image";
import useJCoinsStore from "@/store/user/stats/jCoinsStore";
import useDisplayRoomStore from "@/store/displayRoomStore";
import { useLocale, useTranslations } from "next-intl";
import api from "@/utils/axios";
import { buildJoinRoomUserPayload } from "@/utils/roomJoin";

interface CardProps {
  room: Room | null;
}

const Card: React.FC<CardProps> = ({ room }) => {
  const t = useTranslations("GamePage.cards.card");

  const socket = useSocket();
  const { user, usersOnline } = useUserStore();
  const { setTogglePasswordPrompt } = useRoomStore();
  const { jCoins, toggleGetMoreModal } = useJCoinsStore();
  const { setMsg } = useFlashMsgStore();
  const { setDisplayRoomType } = useDisplayRoomStore();
  const router = useRouter();

  const isLeavingRef = useRef(false);
  const hasNavigatedRef = useRef(false);
  const clickedRoomIdRef = useRef<string | null>(null);

  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const [isGeneratingInvite, setIsGeneratingInvite] = useState(false);

  const isPrivateCreatorLeaveWarning = Boolean(
    room &&
    user &&
    !room.isActive &&
    room.status === "private" &&
    room.creatorId === user._id,
  );

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

    const isEveryUserBot = room?.users.every((u) => !!u.isBot);
    if (isEveryUserBot) return;

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

  const handleLeave = (isForGood: boolean) => {
    if (room && user) {
      hasNavigatedRef.current = false;

      if (isForGood || isPrivateCreatorLeaveWarning) {
        setIsWarningVisible(true);
        return;
      }

      isLeavingRef.current = true;

      if (!isForGood) {
        socket?.emit("leaveRoom", room.id, user._id);

        const type = room?.bet ? "betting" : room?.type || "none";
        setDisplayRoomType({ type, withUser: false });
      }
    }
  };

  const onConfirmWarning = () => {
    if (room && user) {
      isLeavingRef.current = true;

      if (isPrivateCreatorLeaveWarning) {
        socket?.emit("leaveRoom", room.id, user._id);

        const type = room?.bet ? "betting" : room?.type || "none";
        setDisplayRoomType({ type, withUser: false });
        setIsWarningVisible(false);
        return;
      }

      const usersWhoLeft = room?.users.filter(
        (roomUser) => roomUser.status === "left",
      );

      if (usersWhoLeft?.length === 3) {
        socket?.emit("destroyRoom", room.id);
      }

      socket?.emit("updateUserStatus", room.id, user._id, "left");

      const type = room?.bet ? "betting" : room?.type || "none";
      setDisplayRoomType({ type, withUser: false });

      setIsWarningVisible(false);
    }
  };

  const onCancelWarning = () => {
    setIsWarningVisible(false);
  };

  const pathname = usePathname();

  const handleJoin = (roomId: string) => {
    if (!user) {
      router.push(`${pathname}?auth=signin`);
      return;
    }
    if (room && user) {
      isLeavingRef.current = false;

      if (occupiedSeats >= 4) {
        setMsg("Room is full", "error");
        return;
      }

      if (user.isGuest && room.bet) {
        setMsg(t("msgs.guestNoBet"), "error");
        return;
      }

      if (roomId === room?.id && room?.status === "private") {
        setTogglePasswordPrompt(true);
        clickedRoomIdRef.current = roomId;
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

      const type = room?.bet ? "betting" : room?.type;

      setDisplayRoomType({ type, withUser: true });
    }
  };

  const handleCreateInvite = async () => {
    if (!room || !user || room.creatorId !== user._id) return;

    setIsGeneratingInvite(true);

    try {
      const { data } = await api.post("/room-invites", { roomId: room.id });
      const inviteUrl = data?.invite?.inviteUrl as string | undefined;

      if (!inviteUrl) {
        throw new Error(t("invite.createError"));
      }

      await navigator.clipboard.writeText(inviteUrl);
      setMsg(t("invite.copySuccess"), "success");
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (
          error as { response?: { data?: { error?: { message?: string } } } }
        ).response?.data?.error?.message === "string"
          ? (
              error as {
                response?: { data?: { error?: { message?: string } } };
              }
            ).response?.data?.error?.message
          : t("invite.createError");

      setMsg(message || t("invite.createError"), "error");
    } finally {
      setIsGeneratingInvite(false);
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
          : room?.isActive || room?.isDummyRoomActive
            ? styles.room_card_active
            : room?.bet
              ? styles.room_card_betting
              : room?.type === "classic"
                ? styles.room_card_classic
                : room?.type === "nines"
                  ? styles.room_card_nines
                  : styles.room_card
      }
    >
      <PasswordPrompt
        room={room as Room}
        clickedRoomId={clickedRoomIdRef.current}
        user={user}
      />
      {isWarningVisible && (
        <LeaveWarning
          onConfirm={onConfirmWarning}
          onCancel={onCancelWarning}
          destroyRoomOnLeave={isPrivateCreatorLeaveWarning}
        />
      )}
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
            {t("hisht")}: <b>{room?.hisht}</b>
          </span>
          {usersOnline?.length > 100 && (
            <div className={styles.chat}>
              <FaRocketchat className={styles.chat_icon} />
              <small>
                {t("chat")}: <b>{room?.hasChat ? t("on") : t("off")}</b>
              </small>
            </div>
          )}
        </div>

        {room?.isActive &&
          (roomUser?.status === "active" ||
            roomUser?.status === "inactive" ||
            roomUser?.status === "busy") && (
            <div className={styles.btns}>
              {(roomUser.status === "inactive" ||
                roomUser.status === "busy") && (
                <button className={styles.rejoin_btn} onClick={handleRejoin}>
                  {t("btns.continue")}
                </button>
              )}
              <button
                className={styles.leave_btn}
                onClick={() => handleLeave(true)}
              >
                {t("btns.leave")}
              </button>
            </div>
          )}

        {!room?.isActive &&
          roomUser?.status === "active" &&
          (room?.status === "private" && room.creatorId === user?._id ? (
            <div className={styles.btns}>
              <button
                className={styles.rejoin_btn}
                onClick={handleCreateInvite}
                disabled={isGeneratingInvite}
              >
                {isGeneratingInvite ? t("invite.creating") : t("invite.btn")}
              </button>
              <button
                className={styles.leave_btn}
                onClick={() => handleLeave(false)}
              >
                {t("btns.leave")}
              </button>
            </div>
          ) : (
            <button
              className={styles.leave_btn}
              onClick={() => handleLeave(false)}
            >
              {t("btns.leave")}
            </button>
          ))}

        {!roomUser && !room?.isActive && (
          <button
            className={styles.join_btn}
            onClick={() => handleJoin(room?.id || "")}
          >
            {t("btns.join")}
          </button>
        )}
      </footer>
    </div>
  );
};

export default Card;

const LeaveWarning = ({
  onConfirm,
  onCancel,
  destroyRoomOnLeave,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  destroyRoomOnLeave: boolean;
}) => {
  const t = useTranslations("GamePage.cards.card.leaveWarning");
  const locale = useLocale();

  return (
    <div className={styles.leave_warning} data-locale={locale}>
      <p>{destroyRoomOnLeave ? t("creatorRoom.paragraph") : t("paragraph")}</p>
      <small>{destroyRoomOnLeave ? t("creatorRoom.small") : t("small")}</small>
      <div className={styles.leave_warning_btns}>
        <button className={styles.confirm_btn} onClick={onConfirm}>
          {destroyRoomOnLeave ? t("creatorRoom.btns.yes") : t("btns.yes")}
        </button>
        <button className={styles.cancel_btn} onClick={onCancel}>
          {destroyRoomOnLeave ? t("creatorRoom.btns.no") : t("btns.no")}
        </button>
      </div>
    </div>
  );
};
